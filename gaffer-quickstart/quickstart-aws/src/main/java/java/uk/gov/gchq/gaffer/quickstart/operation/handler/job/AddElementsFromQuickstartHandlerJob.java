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

package java.uk.gov.gchq.gaffer.quickstart.operation.handler.job;


import org.apache.commons.io.FileUtils;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.log4j.Logger;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;
import org.apache.spark.sql.SparkSession;
import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.spark.operation.javardd.ImportJavaRDDOfElements;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.IOException;

public class AddElementsFromQuickstartHandlerJob {

    private Logger LOGGER = Logger.getLogger(AddElementsFromQuickstartHandlerJob.class);

    private static final int numArgs = 8;

    private String dataPath;
    private String elementGeneratorConfig;
    private String outputPath;
    private String failurePath;

    private String schemaString;
    private String userString;
    private String storePropertiesString;
    private String graphId;

    public static void main(String[] args) throws SerialisationException, OperationException {
        if(args.length != numArgs){
            throw new IllegalArgumentException("wrong number of args. I need " + numArgs + ", I got " + args.length);
        }
        new AddElementsFromQuickstartHandlerJob().run(args);
    }

    public void run(String[] args) throws SerialisationException, OperationException {

        this.dataPath = args[0];
        this.elementGeneratorConfig = args[1];
        this.outputPath = args[2];
        this.failurePath = args[3];

        this.schemaString = args[4];
        this.userString = args[5];
        this.storePropertiesString = args[6];
        this.graphId = args[7];

        System.out.println("starting job");

        Schema schema = JSONSerialiser.deserialise(schemaString, Schema.class);
        User user = JSONSerialiser.deserialise(userString, User.class);
        AccumuloProperties properties = JSONSerialiser.deserialise(storePropertiesString, AccumuloProperties.class);

        AccumuloStore accumuloStore = new AccumuloStore();

        try {
            accumuloStore.initialise(graphId, schema, properties);
        } catch (StoreException e) {
            e.printStackTrace();
        }

        Context context = SparkContextUtil.createContext(user, accumuloStore.getProperties());

        SparkSession sparkSession = SparkContextUtil.getSparkSession(context, accumuloStore.getProperties())
                .builder()
                .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
                .config("spark.kryo.registrator", "uk.gov.gchq.gaffer.sparkaccumulo.operation.handler.CustomRegistrator")
                .config("spark.driver.allowMultipleContexts", "true")
                .getOrCreate();

        JavaSparkContext sc = JavaSparkContext.fromSparkContext(sparkSession.sparkContext());

        final CsvElementGenerator csvElementGenerator;
        try {
            csvElementGenerator = JSONSerialiser.deserialise(
                    FileUtils.openInputStream(new File(elementGeneratorConfig)),
                    CsvElementGenerator.class
            );
        } catch (final IOException e) {
            throw new OperationException("Cannot create fieldMappings from file " + elementGeneratorConfig + " " + e.getMessage());
        }

        Broadcast<CsvElementGenerator> generatorBroadcast = sc.broadcast(csvElementGenerator);

        int numPartitions = 1;

        try {
            numPartitions = accumuloStore.getTabletServers().size();
        } catch (StoreException e) {
            e.printStackTrace();
        }

        JavaRDD<Element> rdd = sc.textFile(dataPath, numPartitions)
                .flatMap(s -> generatorBroadcast.getValue()._apply(s).iterator());

        ImportJavaRDDOfElements importRDDOfElements = new ImportJavaRDDOfElements.Builder()
                .input(rdd)
                .option("outputPath", outputPath)
                .option("failurePath", failurePath)
                .build();

        accumuloStore.execute(importRDDOfElements, context);

    }




}
