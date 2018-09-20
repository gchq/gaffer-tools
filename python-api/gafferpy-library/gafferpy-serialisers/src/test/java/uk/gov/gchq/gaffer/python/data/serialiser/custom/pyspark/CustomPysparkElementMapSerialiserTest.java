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
import org.junit.Test;
import uk.gov.gchq.gaffer.commonutil.CommonTimeUtil;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.time.Instant;

public class CustomPysparkElementMapSerialiserTest {

    @Test
    public void testSerialiser(){

        HyperLogLogPlus hllp = new HyperLogLogPlus(10,10);
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

        RBMBackedTimestampSet timestamps = new RBMBackedTimestampSet(CommonTimeUtil.TimeBucket.SECOND, Instant.ofEpochMilli(System.currentTimeMillis()));
        timestamps.add(Instant.ofEpochMilli(System.currentTimeMillis() - 86400000L));

        Edge edge = new Edge.Builder()
                .source("A")
                .dest("B")
                .group("group")
                .directed(true)
                .property("timestamps", timestamps)
                .property("sketch", hllp)
                .property("count", 1L)
                .build();

        CustomPysparkElementMapSerialiser serialiser = new CustomPysparkElementMapSerialiser();

        System.out.println(serialiser.convert(edge));

    }

}
