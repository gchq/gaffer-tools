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
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;
import org.apache.spark.sql.SparkSession;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.spark.operation.javardd.ImportJavaRDDOfElements;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromHdfsQuickstart;

public class LoadFromHdfsJob {

    private static final int numArgs = 4;

//    private String dataPath = "/user/hadoop/test.csv";
//    private String generatorPath = "/home/hadoop/example/element-generator.json";
//    private String outputPath = "/user/hadoop/output";
//    private String failurePath = "/user/hadoop/failure";


    private String dataPath;
    private String generatorPath;
    private String outputPath;
    private String failurePath;

    private String schemaPath = "/home/hadoop/gaffer-config/schema.json";
    private String graphConfigPath = "/home/hadoop/gaffer-config/graphconfig.json";
    private String storePropertiesPath = "/home/hadoop/gaffer-config/accumulo-store.properties";

    public static void main(String[] args){

        if(args.length != numArgs){
            throw new IllegalArgumentException("not enough args: got " + args.length +", need " + numArgs);
        }

        try {
            new LoadFromHdfsJob().run(args);
        } catch (OperationException e) {
            e.printStackTrace();
        }

    }

    public void run(String[] args) throws OperationException {

        this.dataPath = args[0];
        this.generatorPath = args[1];
        this.outputPath = args[2];
        this.failurePath = args[3];
//
//        this.schemaPath = args[4];
//        this.graphConfigPath = args[5];
//        this.storePropertiesPath = args[6];

        Graph graph = null;

        try {
            graph = new Graph.Builder()
                    .addSchema(new FileInputStream(new File(schemaPath)))
                    .config(new FileInputStream(new File(graphConfigPath)))
                    .storeProperties(new FileInputStream(new File(storePropertiesPath)))
                    .build();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        User user = new User.Builder()
                .userId("user")
                .build();

        Context context = SparkContextUtil.createContext(user, graph.getStoreProperties());

        SparkSession sparkSession = SparkContextUtil.getSparkSession(context, graph.getStoreProperties())
                .builder()
//                .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
//                .config("spark.kryo.registrator", "uk.gov.gchq.gaffer.sparkaccumulo.operation.handler.CustomRegistrator")
//                .config("spark.driver.allowMultipleContexts", "true")
                .getOrCreate();

        JavaSparkContext sc = JavaSparkContext.fromSparkContext(sparkSession.sparkContext());

        final CsvElementGenerator csvElementGenerator;
        try {
            csvElementGenerator = JSONSerialiser.deserialise(
                    FileUtils.openInputStream(new File(generatorPath)),
                    CsvElementGenerator.class
            );
        } catch (final IOException e) {
            throw new OperationException("Cannot create fieldMappings from file " + generatorPath + " " + e.getMessage());
        }

        System.out.println("Using csv generator");

        Broadcast<CsvElementGenerator> generatorBroadcast = sc.broadcast(csvElementGenerator);

        int numPartitions = 1;

        JavaRDD<Element> rdd = sc.textFile(dataPath, numPartitions)
                .flatMap(s -> generatorBroadcast.getValue()._apply(s).iterator());

        ImportJavaRDDOfElements importRDDOfElements = new ImportJavaRDDOfElements.Builder()
                .input(rdd)
                .option("outputPath", outputPath)
                .option("failurePath", failurePath)
                .build();

        try {
            graph.execute(importRDDOfElements, user);
        } catch (OperationException e) {
            e.printStackTrace();
        }


//        AddElementsFromHdfsQuickstart addOp = new AddElementsFromHdfsQuickstart.Builder()
//                .dataPath(dataPath)
//                .elementGeneratorConfig(generatorPath)
//                .outputPath(outputPath)
//                .failurePath(failurePath)
//                .build();
//
//        User user = new User.Builder()
//                .userId("user")
//                .build();
//
//        try {
//            graph.execute(addOp, user);
//        } catch (OperationException e) {
//            e.printStackTrace();
//        }

    }

}
