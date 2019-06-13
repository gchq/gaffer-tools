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

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.FileReader;

public final class AwsEmrUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(AwsEmrUtils.class);

    private static final String EMR_JOB_FLOW_FILE_LOCATION = "/mnt/var/lib/info/job-flow.json";

    private static String emrJobFlowId = null;

    private AwsEmrUtils() {
    }

    public static String getJobFlowId() {
        if (emrJobFlowId == null) {
            try {
                final FileReader emrFlowFileReader = new FileReader(EMR_JOB_FLOW_FILE_LOCATION);
                final JSONObject info = (JSONObject) JSONValue.parse(emrFlowFileReader);
                if (info.containsKey("jobFlowId")) {
                    emrJobFlowId = info.get("jobFlowId").toString();
                }
            } catch (final FileNotFoundException e) {
                LOGGER.error("Unable to open EMR job flow file: " + EMR_JOB_FLOW_FILE_LOCATION, e);
            }
        }

        return emrJobFlowId;
    }

}
