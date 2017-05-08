/*
 * Copyright 2017 Crown Copyright
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
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.SequenceFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.accumulostore.operation.hdfs.operation.SampleDataForSplitPoints;
import uk.gov.gchq.gaffer.accumulostore.operation.hdfs.operation.SplitTable;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.performancetesting.ingest.RandomElementIngestTest;
import uk.gov.gchq.gaffer.performancetesting.ingest.RandomElementIngestTestProperties;
import uk.gov.gchq.gaffer.randomelementgeneration.generator.RandomElementGenerator;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ElementSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.IOException;
import java.util.Collections;

/**
 *
 */
public class AccumuloRandomElementIngestTest extends Configured {
    private static final Logger LOGGER = LoggerFactory.getLogger(AccumuloRandomElementIngestTest.class);

    private Graph graph;
    private AccumuloRandomElementIngestTestProperties testProperties;

    public AccumuloRandomElementIngestTest(final Graph graph,
                                           final AccumuloRandomElementIngestTestProperties testProperties) {
        this.graph = graph;
        this.testProperties = testProperties;
    }

    protected void run() throws OperationException {
        // Configuration
        final Configuration conf = getConf();

        // Create generator
        final ElementSupplier elementSupplier = new ElementSupplierFactory(testProperties).get();
        final RandomElementGenerator generator = new RandomElementGenerator(
                Long.parseLong(testProperties.getNumElementsForSplitEstimation()), elementSupplier);

        // Serialiser to go from elements to a byte array and back
        final ElementSerialisation serialisation = new ElementSerialisation(graph.getSchema());

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

        // Sample this data to estimate split points.
        // NB: Use a sample proportion of 1 to indicate that all the data should be sampled as we only wrote out
        // enough data to create a good size sample.
        final String splitsFile = testProperties.getTempDirectory() + "/splits_file";
        final String splitsOutputPath = testProperties.getTempDirectory() + "/splits_output/";
        LOGGER.info("Running SampleDataForSplitPoints job");
        final SampleDataForSplitPoints sample = new SampleDataForSplitPoints.Builder()
                .addInputPath(tmpData)
                .resultingSplitsFilePath(splitsFile)
                .outputPath(splitsOutputPath)
                .jobInitialiser(new SequenceFileJobInitialiser())
                .validate(false)
                .proportionToSample(1.0F)
                .mapperGenerator(BytesWritableMapperGenerator.class)
                .build();
        graph.execute(sample, new User());

        // Add the splits point to the table
        LOGGER.info("Adding split points to table");
        final SplitTable splitTable = new SplitTable.Builder()
                .inputPath(splitsFile)
                .build();
        graph.execute(splitTable, new User());

        // Run test
        LOGGER.info("Running RandomElementIngestTest");
        final RandomElementIngestTest test = new RandomElementIngestTest(graph, testProperties);
        test.run();
    }

    private static class ElementSupplierFactory {
        private RandomElementIngestTestProperties testProperties;

        ElementSupplierFactory(final RandomElementIngestTestProperties testProperties) {
            this.testProperties = testProperties;
        }

        ElementSupplier get() {
            final String elementSupplierClass = testProperties.getElementSupplierClass();
            if (elementSupplierClass.equals(RmatElementSupplier.class.getName())) {
                final double[] rmatProbabilities = testProperties.getRmatProbabilities();
                final long maxNodeId = testProperties.getRmatMaxNodeId();
                final boolean includeEntities = testProperties.getRmatIncludeEntities();
                return new RmatElementSupplier(rmatProbabilities, maxNodeId, includeEntities);
            } else {
                throw new RuntimeException("Unknown ElementSupplier class of " + elementSupplierClass);
            }
        }
    }

    public static void main(final String[] args) throws StoreException {
        if (args.length != 3) {
            throw new RuntimeException("Usage: <schema_directory> <store_properties_file> <test_properties_file>");
        }
        final Schema schema = Schema.fromJson(new File(args[0]).toPath());
        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(args[1]);
        final AccumuloStore accumuloStore = new AccumuloStore();
        accumuloStore.initialise(schema, storeProperties);
        final AccumuloRandomElementIngestTestProperties testProperties = new AccumuloRandomElementIngestTestProperties();
        testProperties.loadTestProperties(args[2]);
        final Graph graph = new Graph.Builder()
                .storeProperties(storeProperties)
                .addSchema(schema)
                .build();
        final AccumuloRandomElementIngestTest test = new AccumuloRandomElementIngestTest(graph, testProperties);
        try {
            test.run();
            LOGGER.info("Test ran successfully");
        } catch (final OperationException e) {
            LOGGER.error("Error running test: ", e);
        }
    }
}
