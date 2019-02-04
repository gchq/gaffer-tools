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

import org.apache.commons.io.IOUtils;
import org.apache.spark.launcher.SparkLauncher;
import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromHdfsQuickstart;
import uk.gov.gchq.gaffer.quickstart.operation.handler.job.AddElementsFromQuickstartHandlerJob;
import uk.gov.gchq.gaffer.quickstart.operation.handler.job.JobRunner;
import uk.gov.gchq.gaffer.quickstart.operation.handler.job.LoadFromHdfsJob;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.operation.handler.OperationHandler;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class AddElementsFromHdfsQuickstartHandler implements OperationHandler<AddElementsFromHdfsQuickstart> {

    private static final String JOB_JAR_PATH_KEY = "spark.loader.jar";
    private static final String SPARK_MASTER_KEY = "spark.master";
    private static final String SPARK_HOME_KEY = "spark.home";
    private static final String APP_NAME = AddElementsFromHdfsQuickstart.class.getCanonicalName();

    @Override
    public Object doOperation(AddElementsFromHdfsQuickstart operation, Context context, Store store) throws OperationException {
        doOperation(operation, context, (AccumuloStore) store);
        return null;
    }

    private void doOperation(AddElementsFromHdfsQuickstart operation, Context context, AccumuloStore accumuloStore) throws OperationException {


//        System.out.println("using hardcoded version");
//
//        JobRunner.main(new String[]{});

        String schemaString = null;
        String userString = null;
        String storePropertiesString = null;

        try {
            schemaString = new String(JSONSerialiser.serialise(accumuloStore.getSchema()));
        } catch (SerialisationException e) {
            throw new OperationException("Couldn't serialise schema");
        }

        try {
            userString = new String(JSONSerialiser.serialise(context.getUser()));
        } catch (SerialisationException e) {
            throw new OperationException("Couldn't serialise context");
        }

        try {
            storePropertiesString = new String(JSONSerialiser.serialise(accumuloStore.getProperties()));
        } catch (SerialisationException e) {
            throw new OperationException("Couldn't serialise store-properties");
        }

        String graphId = accumuloStore.getGraphId();

        String jobMainClass = AddElementsFromQuickstartHandlerJob.class.getCanonicalName();
        String sparkMaster = accumuloStore.getProperties().get(SPARK_MASTER_KEY);
        String jarPath = accumuloStore.getProperties().get(JOB_JAR_PATH_KEY);
        String sparkHome = accumuloStore.getProperties().get(SPARK_HOME_KEY);

        Map<String, String> env = new HashMap<>();
        env.put("SPARK_PRINT_LAUNCH_COMMAND", "1");

        try {
            Process sparkLauncherProcess = new SparkLauncher(env)
                    .setAppName(APP_NAME)
                    .setMaster(sparkMaster)
//                    .setMainClass(AddElementsFromQuickstartHandlerJob.class.getCanonicalName())
                    .setMainClass(LoadFromHdfsJob.class.getCanonicalName())
                    .setAppResource(jarPath)
                    .setSparkHome(sparkHome)
                    .addAppArgs(
                            operation.getDataPath(),
                            operation.getElementGeneratorConfig(),
                            operation.getFailurePath(),
                            operation.getOutputPath()
//                            schemaString,
//                            userString,
//                            storePropertiesString,
//                            graphId
                    )
                    .launch();

            StringWriter inputStreamWriter = new StringWriter();
            StringWriter errorStreamWriter = new StringWriter();
            IOUtils.copy(sparkLauncherProcess.getInputStream(), inputStreamWriter);
            IOUtils.copy(sparkLauncherProcess.getErrorStream(), errorStreamWriter);
            String inputStream = inputStreamWriter.toString();
            String errorStream = errorStreamWriter.toString();

            System.out.println(inputStream);
            System.out.println(errorStream);

        } catch (IOException e) {
            throw new OperationException("cannot launch job " + jobMainClass + " from " + jarPath);
        }

    }


}
