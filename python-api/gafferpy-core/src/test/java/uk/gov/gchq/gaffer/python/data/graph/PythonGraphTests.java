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
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import uk.gov.gchq.gaffer.python.data.PythonIterator;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;
import uk.gov.gchq.gaffer.python.graph.PythonGraph;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class PythonGraphTests {

    String schemaPath = "src/test/resources/simple-schema.json";
    String graphConfigPath = "src/test/resources/graphconfig.json";
    String storePropertiesPath = "src/test/resources/mock-accumulo.properties";

    @Test
    public void testCanConstructGraph(){

        PythonGraph pythonGraph = new PythonGraph(schemaPath, graphConfigPath, storePropertiesPath);

        if(pythonGraph.getGraph().getSchema() != null){
            assert(true);
        }

    }

    @Test
    public void testCanAddElements(){

        Edge edge = new Edge.Builder()
                .source("a")
                .dest("b")
                .directed(true)
                .group("BasicEdge")
                .property("count", 1L)
                .build();

        PythonGraph pythonGraph = new PythonGraph(schemaPath, graphConfigPath, storePropertiesPath);

        User user = new User.Builder()
                .userId("user")
                .build();

        String userJson = null;

        try {
            userJson = new String(JSONSerialiser.serialise(user));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        AddElements addElements = new AddElements.Builder()
                .input(edge)
                .build();


        String addOpJson = null;

        try {
            addOpJson = new String(JSONSerialiser.serialise(addElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        assertEquals(0, pythonGraph.execute(addOpJson, userJson));
    }

    @Test
    public void testCanRetrieveElements(){
        Edge edge = new Edge.Builder()
                .source("a")
                .dest("b")
                .directed(true)
                .group("BasicEdge")
                .property("count", 1L)
                .build();

        PythonGraph pythonGraph = new PythonGraph(schemaPath, graphConfigPath, storePropertiesPath);

        User user = new User.Builder()
                .userId("user")
                .build();

        String userJson = null;

        try {
            userJson = new String(JSONSerialiser.serialise(user));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        AddElements addElements = new AddElements.Builder()
                .input(edge)
                .build();

        String addOpJson = null;

        try {
            addOpJson = new String(JSONSerialiser.serialise(addElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        pythonGraph.execute(addOpJson, userJson);

        GetAllElements getAllElements = new GetAllElements.Builder()
                .build();

        String getAllElementsJson = null;
        try {
            getAllElementsJson = new String(JSONSerialiser.serialise(getAllElements));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }

        PythonElementMapSerialiser serialiser = new PythonElementMapSerialiser();

        pythonGraph.setPythonSerialiser(Edge.class.getCanonicalName(), serialiser.getClass().getCanonicalName());

        PythonIterator iterator = (PythonIterator) pythonGraph.execute(getAllElementsJson, userJson);

        while(iterator.hasNext()){
            assertEquals(serialiser.serialise(edge), iterator.next());
        }

    }


}
