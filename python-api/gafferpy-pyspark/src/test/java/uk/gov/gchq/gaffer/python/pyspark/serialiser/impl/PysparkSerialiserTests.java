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

package uk.gov.gchq.gaffer.python.pyspark.serialiser.impl;

import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.python.util.Constants;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class PysparkSerialiserTests {

    @Test
    public void testPysparkElementMapSerialiser() {

        String source = "A";
        String dest = "B";
        String edgeGroup = "edges";
        String entityGroup = "entities";
        String propertyName = "count";
        long propertyValue = 1L;
        DirectedType directed = DirectedType.DIRECTED;

        Edge edge = new Edge.Builder()
                .group(edgeGroup)
                .source(source)
                .dest(dest)
                .directed(directed.isDirected())
                .property(propertyName, propertyValue)
                .build();

        Entity entity = new Entity.Builder()
                .vertex(source)
                .group(entityGroup)
                .property(propertyName, propertyValue)
                .build();

        Map<String, Object> edgeResult = new HashMap<>();
        edgeResult.put(Constants.SOURCE, source);
        edgeResult.put(Constants.DESTINATION, dest);
        edgeResult.put(Constants.DIRECTED, directed);
        edgeResult.put(Constants.GROUP, edgeGroup);
        edgeResult.put(Constants.TYPE, "edge");
        Map<String, Object> properties = new HashMap<>();
        properties.put(propertyName, propertyValue);
        edgeResult.put(Constants.PROPERTIES, properties);

        Map<String, Object> entityResult = new HashMap<>();
        entityResult.put(Constants.TYPE, "entity");
        entityResult.put(Constants.VERTEX, source);
        entityResult.put(Constants.GROUP, entityGroup);
        entityResult.put(Constants.PROPERTIES, properties);

        PysparkElementMapSerialiser serialiser = new PysparkElementMapSerialiser();

        assertEquals(edgeResult, serialiser.convert(edge));
        assertEquals(entityResult, serialiser.convert(entity));

    }

    @Test
    public void testPysparkElementJsonSerialiser() {
        String source = "A";
        String dest = "B";
        String edgeGroup = "edges";
        String entityGroup = "entities";
        String propertyName = "count";
        long propertyValue = 1L;
        DirectedType directed = DirectedType.DIRECTED;

        Edge edge = new Edge.Builder()
                .group(edgeGroup)
                .source(source)
                .dest(dest)
                .directed(directed.isDirected())
                .property(propertyName, propertyValue)
                .build();

        Entity entity = new Entity.Builder()
                .vertex(source)
                .group(entityGroup)
                .property(propertyName, propertyValue)
                .build();


        Map<String, Object> edgeResult = new HashMap<>();
        try {
            edgeResult.put(Constants.JSON, new String(JSONSerialiser.serialise(edge)));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        Map<String, Object> entityResult = new HashMap<>();
        try {
            entityResult.put(Constants.JSON, new String(JSONSerialiser.serialise(entity)));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        PysparkElementJsonSerialiser serialiser = new PysparkElementJsonSerialiser();

        assertEquals(edgeResult, serialiser.convert(edge));
        assertEquals(entityResult, serialiser.convert(entity));
    }
}
