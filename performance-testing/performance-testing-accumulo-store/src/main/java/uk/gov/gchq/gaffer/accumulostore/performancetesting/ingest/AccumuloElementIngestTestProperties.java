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
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import uk.gov.gchq.gaffer.performancetesting.ingest.ElementIngestTestProperties;

public class AccumuloElementIngestTestProperties extends ElementIngestTestProperties {
    private static final long serialVersionUID = -5817791421306186151L;

    private static final String TEMP_DIRECTORY = "gaffer.accumulostore.performancetesting.ingest.tempDirectory";
    private static final String NUM_ELEMENTS_FOR_SPLIT_ESTIMATION =
            "gaffer.accumulostore.performancetesting.ingest.numElementsForSplitEstimation";
    private static final String NUM_SPLIT_POINTS_PER_TABLET_SERVER =
            "gaffer.accumulostore.performancetesting.ingest.numSplitPointsPerTabletServer";

    public AccumuloElementIngestTestProperties() {
        super();
    }

    public String getTempDirectory() {
        return getProperty(TEMP_DIRECTORY);
    }

    public void setTempDirectory(final String tempDirectory) {
        setProperty(TEMP_DIRECTORY, tempDirectory);
    }

    public String getNumElementsForSplitEstimation() {
        return getProperty(NUM_ELEMENTS_FOR_SPLIT_ESTIMATION, "10000");
    }

    public void setNumElementsForSplitEstimation(final String numElementsForSplitEstimation) {
        setProperty(NUM_ELEMENTS_FOR_SPLIT_ESTIMATION, numElementsForSplitEstimation);
    }

    public String getNumSplitPointsPerTabletServer() {
        return getProperty(NUM_SPLIT_POINTS_PER_TABLET_SERVER, "1");
    }

    public void setNumSplitPointsPerTabletServer(final String numSplitPointsPerTabletServer) {
        setProperty(NUM_SPLIT_POINTS_PER_TABLET_SERVER, numSplitPointsPerTabletServer);
    }
}
