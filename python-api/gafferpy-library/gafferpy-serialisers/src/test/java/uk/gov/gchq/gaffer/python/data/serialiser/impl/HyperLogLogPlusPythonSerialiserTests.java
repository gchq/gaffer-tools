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

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class HyperLogLogPlusPythonSerialiserTests {

    @Test
    public void testHyperLogLogPlusPythonSerialiser(){
        HyperLogLogPlus hllp = new HyperLogLogPlus(10,10);

        hllp.offer("a");
        hllp.offer("a");
        hllp.offer("b");
        hllp.offer("b");
        hllp.offer("c");
        hllp.offer("c");
        hllp.offer("c");
        hllp.offer("d");
        hllp.offer("e");
        hllp.offer("f");

        assertEquals((Long) 6L, (Long) new HyperLogLogPlusPythonSerialiser().serialise(hllp));

    }

    @Test
    public void testCanSerialiseEmptySketch(){
        HyperLogLogPlus hllp = new HyperLogLogPlus(10,10);

        assertEquals((Long) 0L, (Long) new HyperLogLogPlusPythonSerialiser().serialise(hllp));

    }

}
