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

import org.roaringbitmap.RoaringBitmap;

import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;
import uk.gov.gchq.gaffer.python.util.Constants;

import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class RBMBackedTimestampSetPythonSerialiser implements PythonSerialiser<RBMBackedTimestampSet, Map<String, Object>> {

    @Override
    public Map<String, Object> serialise(final RBMBackedTimestampSet rbmBackedTimestampSet) {

        Map<String, Object> timestampMap = new HashMap<>();

        timestampMap.put(Constants.TIMEBUCKET_KEY_NAME, rbmBackedTimestampSet.getTimeBucket());

        RoaringBitmap rbm = rbmBackedTimestampSet.getRbm();

        List<Integer> timestamps = new ArrayList<>(rbm.getCardinality());

        Iterator<Integer> iterator = rbm.iterator();
        while (iterator.hasNext()) {
            timestamps.add(iterator.next());
        }

        timestampMap.put(Constants.TIMESTAMPS_KEY_NAME, timestamps);

        return timestampMap;
    }

    @Override
    public boolean canHandle(final Class aClass) {
        return RBMBackedTimestampSet.class.equals(aClass);
    }
}
