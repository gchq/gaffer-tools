/*
 * Copyright 2016-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.quickstart.operation.handler.job;

import org.apache.commons.io.FileUtils;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;

import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.spark.operation.javardd.ImportJavaRDDOfElements;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.library.NoGraphLibrary;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.IOException;

public class LoadFromHdfsJob {

    private static final int NUM_ARGS = 9;

    private String dataPath;
    private String generatorPath;
    private String outputPath;
    private String failurePath;
    private String numPartitionsString;

    private String schemaJson;
    private String tableName;
    private String accumuloStorePropertiesJson;
    private String delimiter;

    public static void main(final String[] args) {

        if (args.length != NUM_ARGS) {
            throw new IllegalArgumentException("not enough args: got " + args.length + ", need " + NUM_ARGS);
        }

        try {
            new LoadFromHdfsJob().run(args);
        } catch (final OperationException e) {
            e.printStackTrace();
        }

    }

    public void run(final String[] args) throws OperationException {

        this.dataPath = args[0];
        this.generatorPath = args[1];
        this.outputPath = args[2];
        this.failurePath = args[3];
        this.numPartitionsString = args[4];
        this.schemaJson = args[5];
        this.tableName = args[6];
        this.accumuloStorePropertiesJson = args[7];
        this.delimiter = args[8];

        int numPartitions = Integer.parseInt(numPartitionsString);

        AccumuloProperties accumuloProperties = null;

        try {
            accumuloProperties = JSONSerialiser.deserialise(accumuloStorePropertiesJson, AccumuloProperties.class);
        } catch (final SerialisationException e) {
            throw new OperationException(e.getMessage());
        }

        Schema schema = null;

        try {
            schema = JSONSerialiser.deserialise(schemaJson, Schema.class);
        } catch (final SerialisationException e) {
            throw new OperationException(e.getMessage());
        }

        GraphConfig graphConfig = new GraphConfig.Builder()
                .graphId(tableName)
                .library(new NoGraphLibrary())
                .build();

        Graph graph = new Graph.Builder()
                .addSchema(schema)
                .config(graphConfig)
                .storeProperties(accumuloProperties)
                .build();

        User user = new User.Builder()
                .userId("user")
                .build();

        Context context = SparkContextUtil.createContext(user, graph.getStoreProperties());

        SparkContext sc = SparkContextUtil.getSparkSession(context, graph.getStoreProperties()).sparkContext();

        JavaSparkContext jsc = JavaSparkContext.fromSparkContext(sc);

        CsvElementGenerator csvElementGenerator = null;
        try {
            csvElementGenerator = JSONSerialiser.deserialise(
                    FileUtils.openInputStream(new File(generatorPath)),
                    CsvElementGenerator.class
            );
        } catch (final IOException e) {
            e.printStackTrace();
        }

        csvElementGenerator.setDelimiter(delimiter.charAt(0));

        Broadcast<CsvElementGenerator> generatorBroadcast = jsc.broadcast(csvElementGenerator);

        JavaRDD<Element> rdd = jsc.textFile(dataPath, numPartitions)
                .flatMap(s -> generatorBroadcast.getValue()._apply(s).iterator());

        ImportJavaRDDOfElements importRDDOfElements = new ImportJavaRDDOfElements.Builder()
                .input(rdd)
                .option("outputPath", outputPath)
                .option("failurePath", failurePath)
                .build();

        try {
            graph.execute(importRDDOfElements, user);
        } catch (final OperationException e) {
            e.printStackTrace();
        }

    }

}


