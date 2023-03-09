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

package uk.gov.gchq.gaffer.performancetesting.aws;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@SuppressFBWarnings("DMI_HARDCODED_ABSOLUTE_FILENAME")
public final class AwsEmrUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(AwsEmrUtils.class);

    private static final String EMR_JOB_FLOW_FILE_LOCATION = "/mnt/var/lib/info/job-flow.json";

    private static String emrJobFlowId = null;

    private AwsEmrUtils() {
    }

    public static String getJobFlowId() {
        if (emrJobFlowId == null) {
            try {
                final BufferedReader emrFlowFileReader = Files.newBufferedReader(Paths.get(EMR_JOB_FLOW_FILE_LOCATION), StandardCharsets.UTF_8);
                final JSONObject info = (JSONObject) JSONValue.parse(emrFlowFileReader);
                if (info.containsKey("jobFlowId")) {
                    emrJobFlowId = info.get("jobFlowId").toString();
                }
            } catch (final IOException e) {
                LOGGER.error("Unable to open EMR job flow file: " + EMR_JOB_FLOW_FILE_LOCATION, e);
            }
        }

        return emrJobFlowId;
    }

}
