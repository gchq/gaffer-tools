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

package uk.gov.gchq.gaffer.quickstart.operation.handler;

import org.apache.commons.io.FileUtils;
import org.apache.spark.launcher.SparkLauncher;
import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromHdfsQuickstart;
import uk.gov.gchq.gaffer.quickstart.operation.handler.job.LoadFromHdfsJob;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.operation.handler.OperationHandler;
import uk.gov.gchq.gaffer.store.schema.Schema;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class AddElementsFromHdfsQuickstartHandler implements OperationHandler<AddElementsFromHdfsQuickstart> {

    private static final String JOB_JAR_PATH_KEY = "spark.loader.jar";
    private static final String SPARK_MASTER_KEY = "spark.master";
    private static final String SPARK_HOME_KEY = "spark.home";
    private static final String APP_NAME = "AddElementsFromQuickstart";

    @Override
    public Object doOperation(AddElementsFromHdfsQuickstart operation, Context context, Store store) throws OperationException {
        doOperation(operation, context, (AccumuloStore) store);
        return null;
    }

    private void doOperation(AddElementsFromHdfsQuickstart operation, Context context, AccumuloStore accumuloStore) throws OperationException {

        AccumuloProperties properties = accumuloStore.getProperties();
        String accumuloPropertiesJson  = null;
        try {
            accumuloPropertiesJson = new String(JSONSerialiser.serialise(properties));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        Schema schema = accumuloStore.getSchema();
        String schemaJson = new String(schema.toCompactJson());

        String tableName = accumuloStore.getTableName();

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss_SSS");
        Date date = new Date(System.currentTimeMillis());
        String dateString = dateFormat.format(date);

        String jobname = APP_NAME + "_" + dateString;

        String failurePath;
        String outputPath;
        String numSplitsString;

        if(null == operation.getFailurePath()){
            failurePath = APP_NAME + "_" + dateString + "/failure";
        }else{
            failurePath = operation.getFailurePath();
        }

        if(null == operation.getOutputPath()){
            outputPath = APP_NAME + "_" + dateString + "/output";
        }else{
            outputPath = operation.getOutputPath();
        }

        String jobMainClass = LoadFromHdfsJob.class.getCanonicalName();
        String sparkMaster = accumuloStore.getProperties().get(SPARK_MASTER_KEY);
        String jarPath = accumuloStore.getProperties().get(JOB_JAR_PATH_KEY);
        String sparkHome = accumuloStore.getProperties().get(SPARK_HOME_KEY);

        int numSplits = operation.getNumSplits();

        if(numSplits == 0){
            int numTabletServers = 0;
            try {
                numTabletServers = (accumuloStore.getTabletServers().size());
            } catch (StoreException e) {
                e.printStackTrace();
            }

            if(0 != numTabletServers){
                numSplitsString = String.valueOf(numTabletServers);
            }else{
                numSplitsString = String.valueOf(operation.getNumSplits());
            }
        }else{
            numSplitsString = String.valueOf(operation.getNumSplits());
        }

        Map<String, String> env = new HashMap<>();
        env.put("SPARK_PRINT_LAUNCH_COMMAND", "1");

        File logFile = new File(APP_NAME + "_" + dateString + "/log/stdout.log");
        File errFile = new File(APP_NAME + "_" + dateString + "/log/stderr.log");
        try {
            FileUtils.write(logFile, "logs for job " + APP_NAME, true);
            FileUtils.write(errFile, "logs for job " + APP_NAME, true);
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            Process sparkLauncherProcess = new SparkLauncher(env)
                    .setAppName(jobname)
                    .setMaster(sparkMaster)
                    .setMainClass(jobMainClass)
                    .setAppResource(jarPath)
                    .setSparkHome(sparkHome)
                    .redirectOutput(logFile)
                    .redirectError(errFile)
                    .addAppArgs(
                            operation.getDataPath(),
                            operation.getElementGeneratorConfig(),
                            outputPath,
                            failurePath,
                            numSplitsString,
                            schemaJson,
                            tableName,
                            accumuloPropertiesJson
                    )
                    .launch();

        } catch (IOException e) {
            throw new OperationException("cannot launch job " + jobMainClass + " from " + jarPath);
        }

    }


}
