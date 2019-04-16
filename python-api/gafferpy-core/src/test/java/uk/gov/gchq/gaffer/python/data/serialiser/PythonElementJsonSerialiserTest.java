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
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.types.FreqMap;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class PythonElementJsonSerialiserTest {

    private String source = "source";
    private String group = "Test";
    private DirectedType directedType = DirectedType.DIRECTED;
    private Integer count = 1;
    private FreqMap map = new FreqMap();

    @Before
    public void initialiseFreqMap(){
        map.upsert("test_1",4L);
        map.upsert("test_2");
    }

    @Test
    public void testCanDefaultSerialiseEdge(){

        Edge edge = new Edge.Builder()
                .group(group)
                .source(source)
                .dest("dest")
                .directed(true)
                .property("count", count)
                .property("map", map)
                .build();

        String json = null;

        try {
            json = new String(JSONSerialiser.serialise(edge));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        PythonElementJsonSerialiser serialiser = new PythonElementJsonSerialiser();

        assertNotNull(json);

        Map<String, Object> serialised = new HashMap<>();
        serialised.put(Constants.JSON.getValue(), json);

        assertEquals(serialised, serialiser.serialise(edge));

    }

    @Test
    public void testCanDefaultSerialiseEntity(){

        Entity entity = new Entity.Builder()
                .group(group)
                .vertex(source)
                .property("count", count)
                .property("map", map)
                .build();

        String json = null;

        try {
            json = new String(JSONSerialiser.serialise(entity));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        PythonElementJsonSerialiser serialiser = new PythonElementJsonSerialiser();

        assertNotNull(json);

        Map<String, Object> serialised = new HashMap<>();
        serialised.put(Constants.JSON.getValue(), json);

        assertEquals(serialised, serialiser.serialise(entity));

    }
}
