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

package uk.gov.gchq.gaffer.python.data.serialiser.impl;

import org.junit.Test;

import uk.gov.gchq.gaffer.commonutil.CommonTimeUtil;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class RBMBackedTimestampSetPythonSerialiserTests {

    @Test
    public void testSerialiser() {
        long time = System.currentTimeMillis();
        long time2 = time - 86400000L;
        long time3 = time - 2 * 86400000L;
        CommonTimeUtil.TimeBucket timeBucket = CommonTimeUtil.TimeBucket.SECOND;

        RBMBackedTimestampSet timestampSet = new RBMBackedTimestampSet(timeBucket);

        timestampSet.add(Instant.ofEpochMilli(time));
        timestampSet.add(Instant.ofEpochMilli(time2));
        timestampSet.add(Instant.ofEpochMilli(time3));

        Map<String, Object> timestampsMap = new HashMap<>();
        List<Integer> timestampsList = new ArrayList<>(3);
        timestampsList.add((int) (CommonTimeUtil.timeToBucket(time3, CommonTimeUtil.TimeBucket.SECOND) / 1000L));
        timestampsList.add((int) (CommonTimeUtil.timeToBucket(time2, CommonTimeUtil.TimeBucket.SECOND) / 1000L));
        timestampsList.add((int) (CommonTimeUtil.timeToBucket(time, CommonTimeUtil.TimeBucket.SECOND) / 1000L));
        timestampsMap.put(Constants.TIMESTAMPS_KEY_NAME.getValue(), timestampsList);
        timestampsMap.put(Constants.TIMEBUCKET_KEY_NAME.getValue(), timeBucket);

        RBMBackedTimestampSetPythonSerialiser serialiser = new RBMBackedTimestampSetPythonSerialiser();

        assertEquals(timestampsMap.toString(), serialiser.serialise(timestampSet).toString());

    }
}
