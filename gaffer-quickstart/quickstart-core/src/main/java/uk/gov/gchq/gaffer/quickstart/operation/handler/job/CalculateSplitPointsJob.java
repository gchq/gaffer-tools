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

import org.apache.accumulo.core.data.Key;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;

import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.key.AccumuloElementConverter;
import uk.gov.gchq.gaffer.commonutil.CommonConstants;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.SplitStoreFromFile;
import uk.gov.gchq.gaffer.quickstart.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.sparkaccumulo.operation.utils.java.ElementConverterFunction;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.library.NoGraphLibrary;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class CalculateSplitPointsJob {

    private static final int NUM_ARGS = 11;

    private String dataPath;
    private String generatorPath;
    private String outputPath;
    private String failurePath;
    private String numPartitionsString;

    private String schemaJson;
    private String tableName;
    private String accumuloStorePropertiesJson;

    private String splitsFilePath;
    private String sampleRatioForSplitsString;
    private String keyConverterClassName;

    public static void main(final String[] args) {

        if (args.length != NUM_ARGS) {
            throw new IllegalArgumentException("not enough args: got " + args.length + ", need " + NUM_ARGS);
        }

        try {
            new CalculateSplitPointsJob().run(args);
        } catch (final OperationException e) {
            e.printStackTrace();
        }
    }

    private void run(final String[] args) throws OperationException {

        this.dataPath = args[0];
        this.generatorPath = args[1];
        this.outputPath = args[2];
        this.failurePath = args[3];
        this.numPartitionsString = args[4];
        this.schemaJson = args[5];
        this.tableName = args[6];
        this.accumuloStorePropertiesJson = args[7];
        this.splitsFilePath = args[8];
        this.sampleRatioForSplitsString = args[9];
        this.keyConverterClassName = args[10];

        double sampleRatioForsplits = Double.parseDouble(sampleRatioForSplitsString);
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

        Broadcast<CsvElementGenerator> generatorBroadcast = jsc.broadcast(csvElementGenerator);


        AccumuloElementConverter keyConverter = null;

        try {
            Constructor constructor = Class.forName(keyConverterClassName).getConstructor(Schema.class);
            keyConverter = (AccumuloElementConverter) constructor.newInstance(schema);
        } catch (final InstantiationException | IllegalAccessException | ClassNotFoundException | NoSuchMethodException | InvocationTargetException e) {
            e.printStackTrace();
        }

        Broadcast<AccumuloElementConverter> keyConverterBroadcast = jsc.broadcast(keyConverter);
        ElementConverterFunction func = new ElementConverterFunction(keyConverterBroadcast);

        List<Key> rowKeys = jsc.textFile(dataPath, numPartitions)
                .sample(false, sampleRatioForsplits)
                .flatMap(s -> generatorBroadcast.getValue()._apply(s).iterator())
                .flatMapToPair(func)
                .map(kv -> kv._1)
                .sortBy(x -> x, false, 1)
                .collect();

        int numKeys = rowKeys.size();

        int outputNth = numKeys / numPartitions;

        Configuration conf = new Configuration();
        FileSystem fs = null;
        try {
            fs = FileSystem.get(conf);
        } catch (final IOException e) {
            e.printStackTrace();
        }

        PrintStream splitsWriter = null;
        try {
            splitsWriter = new PrintStream(
                    new BufferedOutputStream(fs.create(new Path(splitsFilePath), true)),
                    false, CommonConstants.UTF_8);
        } catch (final IOException e) {
            e.printStackTrace();
        }

        int i = 0;
        for (final Key k : rowKeys) {
            if (i == outputNth) {
                String split = new String(Base64.encodeBase64(k.getRow().getBytes()));
                splitsWriter.println(split);
                i = 0;
            }
            i++;
        }

        splitsWriter.close();

        try {
            fs.close();
        } catch (final IOException e) {
            e.printStackTrace();
        }

        SplitStoreFromFile splitStoreFromFile = new SplitStoreFromFile.Builder()
                .inputPath(splitsFilePath)
                .build();

        graph.execute(splitStoreFromFile, user);

    }



}
