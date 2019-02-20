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

package uk.gov.gchq.gaffer.python.data.serialiser.custom.pyspark;

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import org.junit.Before;
import org.junit.Test;
import uk.gov.gchq.gaffer.commonutil.CommonTimeUtil;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.impl.HyperLogLogPlusPythonSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.impl.RBMBackedTimestampSetPythonSerialiser;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class CustomPysparkElementMapSerialiserTests {

    private DirectedType directed = DirectedType.DIRECTED;
    private HyperLogLogPlus hllp;
    private RBMBackedTimestampSet timestamps;

    @Before
    public void setHllp(){
        hllp = new HyperLogLogPlus(10,10);
        hllp.offer("a");
        hllp.offer("a");
        hllp.offer("a");
        hllp.offer("b");
        hllp.offer("b");
        hllp.offer("b");
        hllp.offer("b");
        hllp.offer("c");
        hllp.offer("c");
        hllp.offer("d");
    }

    @Before
    public void setTimestamps(){
        long time = System.currentTimeMillis();
        timestamps = new RBMBackedTimestampSet(CommonTimeUtil.TimeBucket.SECOND, Instant.ofEpochMilli(time));
    }

    @Test
    public void testSerialiser() {

        String source = "A";
        String dest = "B";
        String edgeGroup = "Edge";
        Integer count = 1;
        Edge edge = new Edge.Builder()
                .source(source)
                .dest(dest)
                .group(edgeGroup)
                .directed(true)
                .property("timestamps", timestamps)
                .property("sketch", hllp)
                .property("count", count)
                .build();

        Map<String, Object> elementMap = new HashMap<>();
        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put("count", count);

        HyperLogLogPlusPythonSerialiser hyperLogLogPlusPythonSerialiser = new HyperLogLogPlusPythonSerialiser();
        propertiesMap.put("sketch", hyperLogLogPlusPythonSerialiser.serialise(hllp));

        RBMBackedTimestampSetPythonSerialiser timestampSetPythonSerialiser = new RBMBackedTimestampSetPythonSerialiser();
        propertiesMap.put("timestamps", timestampSetPythonSerialiser.serialise(timestamps));

        try {
            System.out.println(Arrays.toString(JSONSerialiser.serialise(timestamps, true)));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        elementMap.put(Constants.PROPERTIES.getValue(), propertiesMap);
        elementMap.put(Constants.GROUP.getValue(), edgeGroup);
        elementMap.put(Constants.TYPE.getValue(), Constants.EDGE);
        elementMap.put(Constants.SOURCE.getValue(), source);
        elementMap.put(Constants.DESTINATION.getValue(), dest);
        elementMap.put(Constants.DIRECTED.getValue(), directed);

        CustomPysparkElementMapSerialiser serialiser = new CustomPysparkElementMapSerialiser();

        assertEquals(elementMap, serialiser.convert(edge));

    }

}
