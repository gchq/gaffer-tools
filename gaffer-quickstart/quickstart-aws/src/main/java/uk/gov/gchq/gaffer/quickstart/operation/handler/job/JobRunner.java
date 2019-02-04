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

import org.apache.commons.io.IOUtils;
import org.apache.spark.launcher.SparkLauncher;
import uk.gov.gchq.gaffer.operation.OperationException;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

public class JobRunner {

    public static void main(String[] args) throws OperationException {

        new JobRunner().run();
    }

    private void run() throws OperationException {

        Map<String, String> env = new HashMap<>();
        env.put("SPARK_PRINT_LAUNCH_COMMAND", "1");

        try {
            Process sparkLauncherProcess = new SparkLauncher(env)
                    .setAppName("hardcoded-job")
                    .setMaster("yarn")
                    .setMainClass(LoadFromHdfsJob.class.getCanonicalName())
                    .setAppResource("/home/hadoop/gaffer-quickstart-jar-with-dependencies.jar")
                    .setSparkHome("/usr/lib/spark")
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
            throw new OperationException("cannot launch job " + LoadFromHdfsJob.class.getCanonicalName() + " from /home/hadoop/gaffer-quickstart-jar-with-dependencies.jar");
        }


    }

}
