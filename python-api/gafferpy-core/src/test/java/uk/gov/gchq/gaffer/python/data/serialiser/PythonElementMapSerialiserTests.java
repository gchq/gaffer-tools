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

package uk.gov.gchq.gaffer.python.data.serialiser;

import org.junit.Before;
import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.types.FreqMap;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class PythonElementMapSerialiserTests {

    String source = "source";
    String dest = "dest";
    String group = "Test";
    boolean directed = true;
    DirectedType directedType = DirectedType.DIRECTED;
    Integer count = 1;
    FreqMap map = new FreqMap();

    @Before
    public void initialiseFreqMap() {
        map.upsert("test_1", 4L);
        map.upsert("test_2");
    }

    @Test
    public void testCanDefaultSerialiseEdge() {

        Edge edge = new Edge.Builder()
                .group("Test")
                .source(source)
                .dest(dest)
                .directed(directed)
                .property("count", count)
                .property("map", map)
                .build();

        Map<String, Object> edgeMap = new HashMap<>();
        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put("count", count);
        propertiesMap.put("map", map);
        edgeMap.put(Constants.TYPE, Constants.EDGE);
        edgeMap.put(Constants.GROUP, group);
        edgeMap.put(Constants.SOURCE, source);
        edgeMap.put(Constants.DESTINATION, dest);
        edgeMap.put(Constants.DIRECTED, directedType);
        edgeMap.put(Constants.PROPERTIES, propertiesMap);

        PythonElementMapSerialiser serialiser = new PythonElementMapSerialiser();

        assertEquals(edgeMap, serialiser.serialise(edge));

    }

    @Test
    public void testCanDefaultSerialiseEntity() {

        Entity entity = new Entity.Builder()
                .group(group)
                .vertex(source)
                .property("count", count)
                .property("map", map)
                .build();

        Map<String, Object> entityMap = new HashMap<>();
        Map<String, Object> propertiesMap = new HashMap<>();
        propertiesMap.put("count", count);
        propertiesMap.put("map", map);
        entityMap.put(Constants.TYPE, Constants.ENTITY);
        entityMap.put(Constants.GROUP, group);
        entityMap.put(Constants.VERTEX, source);
        entityMap.put(Constants.PROPERTIES, propertiesMap);

        PythonElementMapSerialiser serialiser = new PythonElementMapSerialiser();

        assertEquals(entityMap, serialiser.serialise(entity));

    }
}
