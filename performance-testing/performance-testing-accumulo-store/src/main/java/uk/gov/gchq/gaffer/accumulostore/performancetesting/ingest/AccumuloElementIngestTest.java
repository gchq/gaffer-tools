/*
 * Copyright 2017-2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.SequenceFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.hdfs.operation.SampleDataForSplitPoints;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.SplitStore;
import uk.gov.gchq.gaffer.performancetesting.ingest.ElementIngestTest;
import uk.gov.gchq.gaffer.randomelementgeneration.generator.ElementGeneratorFromSupplier;
import uk.gov.gchq.gaffer.serialisation.ToBytesSerialiser;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.serialiser.ElementSerialiser;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.function.Supplier;

public class AccumuloElementIngestTest extends Configured {
    private static final Logger LOGGER = LoggerFactory.getLogger(AccumuloElementIngestTest.class);

    private Graph graph;
    private AccumuloStore accumuloStore;
    private AccumuloElementIngestTestProperties testProperties;

    public AccumuloElementIngestTest(final Graph graph,
                                     final AccumuloStore accumuloStore,
                                     final AccumuloElementIngestTestProperties testProperties) {
        this.graph = graph;
        this.accumuloStore = accumuloStore;
        this.testProperties = testProperties;
    }

    protected void run() throws OperationException {
        // Configuration
        final Configuration conf = getConf();
        final FileSystem fs;
        try {
            fs = FileSystem.get(conf);
        } catch (final IOException e) {
            throw new OperationException("IOException obtaining FileSystem from conf", e);
        }

        // Create generator
        final Supplier<Element> elementSupplier = new ElementIngestTest.ElementSupplierFactory(testProperties).get();
        final ElementGeneratorFromSupplier generator = new ElementGeneratorFromSupplier(
                Long.parseLong(testProperties.getNumElementsForSplitEstimation()), elementSupplier);

        // Serialiser to go from elements to a byte array and back
        final ToBytesSerialiser<Element> serialisation = new ElementSerialiser(accumuloStore.getSchema());

        // Write random data to a sequence file
        LOGGER.info("Writing random elements to a temporary file");
        if (null == testProperties.getTempDirectory()) {
            throw new OperationException("Missing temporary directory");
        }
        final String tmpData = testProperties.getTempDirectory() + "/tmp_random_data/";
        try {
            final SequenceFile.Writer writer = SequenceFile.createWriter(conf,
                    SequenceFile.Writer.file(new Path(tmpData)),
                    SequenceFile.Writer.compression(SequenceFile.CompressionType.NONE),
                    SequenceFile.Writer.keyClass(NullWritable.class),
                    SequenceFile.Writer.valueClass(BytesWritable.class));
            for (final Element element : generator.apply(Collections.singletonList("DUMMY"))) {
                writer.append(NullWritable.get(), new BytesWritable(serialisation.serialise(element)));
            }
            writer.close();
        } catch (final IOException e) {
            throw new OperationException("IOException creating SequenceFile of random data", e);
        }

        // Find out number of tablet servers so that we can create the correct number of split points
        final int numTabletServers;
        try {
            numTabletServers = accumuloStore.getConnection().instanceOperations().getTabletServers().size();
        } catch (final StoreException e) {
            throw new OperationException("StoreException obtaining the number of tablet servers");
        }
        final int numSplitPoints = numTabletServers * Integer.parseInt(testProperties.getNumSplitPointsPerTabletServer());

        // Sample this data to estimate split points.
        // NB: Use a sample proportion of 1 to indicate that all the data should be sampled as we only wrote out
        // enough data to create a good size sample.
        final String splitsFile = testProperties.getTempDirectory() + "/splits_file";
        final String splitsOutputPath = testProperties.getTempDirectory() + "/splits_output/";
        LOGGER.info("Running SampleDataForSplitPoints job");
        final SampleDataForSplitPoints sample = new SampleDataForSplitPoints.Builder()
                .numSplits(numSplitPoints)
                .addInputMapperPair(tmpData, BytesWritableMapperGenerator.class.getName())
                .splitsFilePath(splitsFile)
                .outputPath(splitsOutputPath)
                .jobInitialiser(new SequenceFileJobInitialiser())
                .validate(false)
                .proportionToSample(1.0F)
                .build();
        accumuloStore.execute(sample, new Context());

        // Check if split points were output (if there was only 1 tablet server then no split points will be output)
        boolean splitsFileExists = false;
        try {
            if (fs.exists(new Path(splitsFile))) {
                splitsFileExists = true;
            }
        } catch (final IOException e) {
            throw new OperationException("IOException finding out if splits file exists", e);
        }

        if (!splitsFileExists) {
            LOGGER.info("No splits file was written by SampleDataForSplitPoints so not adding split points to table");
        } else {
            // Add the splits point to the table
            LOGGER.info("Adding split points to table");
            final SplitStore splitTable = new SplitStore.Builder()
                    .inputPath(splitsFile)
                    .build();
            accumuloStore.execute(splitTable, new Context());
        }

        // Run test
        LOGGER.info("Running ElementIngestTest");
        final ElementIngestTest test = new ElementIngestTest(graph, testProperties);
        test.run();
    }

    public static void main(final String[] args) throws StoreException, IOException {
        if (args.length != 3) {
            throw new RuntimeException("Usage: <schema_directory> <store_properties_file> <test_properties_file>");
        }
        final Schema schema = Schema.fromJson(new File(args[0]).toPath());
        LOGGER.info("Using schema of {}", schema);
        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(args[1]);
        final AccumuloElementIngestTestProperties testProperties = new AccumuloElementIngestTestProperties();
        testProperties.loadTestProperties(args[2]);
        final AccumuloStore accumuloStore = new AccumuloStore();
        accumuloStore.initialise(testProperties.getGraphId(), schema, storeProperties);
        LOGGER.info("Initialised Accumulo store (instance name is {}, graph id is {})",
                accumuloStore.getProperties().getInstance(),
                accumuloStore.getProperties().getTable());
        LOGGER.info("Using test properties of {}", testProperties);
        final Graph graph = new Graph.Builder()
                .graphId(testProperties.getGraphId())
                .store(accumuloStore)
                .addSchema(schema)
                .build();
        final AccumuloElementIngestTest test = new AccumuloElementIngestTest(graph, accumuloStore, testProperties);
        Configuration conf = new Configuration();
        test.setConf(conf);
        LOGGER.info("Running test");
        try {
            test.run();
            LOGGER.info("Test ran successfully");
        } catch (final OperationException e) {
            LOGGER.error("Error running test: ", e);
        }
    }
}
