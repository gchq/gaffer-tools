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

package uk.gov.gchq.gaffer.python.data.graph;

import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllElements;
import uk.gov.gchq.gaffer.python.data.PythonIterator;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;
import uk.gov.gchq.gaffer.python.graph.Grapper;
import uk.gov.gchq.gaffer.user.User;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class GrapperTest {

    private final String schemaPath = "src/test/resources/simple-schema.json";
    private final String graphConfigPath = "src/test/resources/graphconfig.json";
    private final String storePropertiesPath = "src/test/resources/mock-accumulo.properties";

    private final String opReason = "Test reason";

    @Test
    public void testCanConstructGraph() {

        Grapper grapper = new Grapper.Builder()
                .user(
                    new User.Builder()
                            .userId("user")
                            .build()
                )
                .graphConfig(graphConfigPath)
                .schemaConfig(schemaPath)
                .storeProperties(storePropertiesPath)
                .build();

        assertNotNull(grapper.getGraph().getSchema());
    }

    @Test
    public void testCanAddElements() {

        Edge edge = new Edge.Builder()
                .source("a")
                .dest("b")
                .directed(true)
                .group("BasicEdge")
                .property("count", 1L)
                .build();

        Grapper grapper = new Grapper.Builder().user(new User.Builder()
                .userId("user")
                .build())
                .graphConfig(graphConfigPath)
                .schemaConfig(schemaPath)
                .storeProperties(storePropertiesPath)
                .build();

        AddElements addElements = new AddElements.Builder()
                .input(edge)
                .build();


        String addOpJson = null;

        try {
            addOpJson = new String(JSONSerialiser.serialise(addElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        assertEquals(0, grapper.execute(addOpJson, opReason));
    }

    @Test
    public void testCanRetrieveElements() {
        Edge edge = new Edge.Builder()
                .source("a")
                .dest("b")
                .directed(true)
                .group("BasicEdge")
                .property("count", 1L)
                .build();

        Grapper grapper = new Grapper.Builder()
                .user(
                    new User.Builder()
                            .userId("user")
                            .build()
                )
                .storeProperties(storePropertiesPath)
                .schemaConfig(schemaPath)
                .graphConfig(graphConfigPath)
                .build();


        AddElements addElements = new AddElements.Builder()
                .input(edge)
                .build();

        String addOpJson = null;

        try {
            addOpJson = new String(JSONSerialiser.serialise(addElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        grapper.execute(addOpJson, opReason);

        GetAllElements getAllElements = new GetAllElements.Builder()
                .build();

        String getAllElementsJson = null;
        try {
            getAllElementsJson = new String(JSONSerialiser.serialise(getAllElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        PythonElementMapSerialiser serialiser = new PythonElementMapSerialiser();

        grapper.setPythonSerialiser(Edge.class.getCanonicalName(), serialiser.getClass().getCanonicalName());

        PythonIterator iterator = (PythonIterator) grapper.execute(getAllElementsJson, opReason);

        while (iterator.hasNext()) {
            assertEquals(serialiser.serialise(edge), iterator.next());
        }
    }
}
