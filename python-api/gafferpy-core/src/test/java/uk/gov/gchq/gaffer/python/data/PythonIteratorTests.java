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

package uk.gov.gchq.gaffer.python.data;

import org.junit.Before;
import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PythonIteratorTests {

    List<Edge> edgesList = null;

    @Before
    public void getEdges() {
        edgesList = new ArrayList<>(3);

        Edge edge1 = new Edge.Builder()
                .group("Test")
                .source("a")
                .dest("b")
                .directed(true)
                .property("count", 1)
                .build();

        Edge edge2 = new Edge.Builder()
                .group("Test")
                .source("b")
                .dest("c")
                .directed(true)
                .property("count", 11)
                .build();

        Edge edge3 = new Edge.Builder()
                .group("Test")
                .source("c")
                .dest("a")
                .directed(true)
                .property("count", 111)
                .build();

        edgesList.add(edge1);
        edgesList.add(edge2);
        edgesList.add(edge3);
    }

    @Test
    public void testPythonIterator() {

        Iterator iterator = edgesList.iterator();

        PythonElementMapSerialiser serialiser = new PythonElementMapSerialiser();

        PythonIterator pythonIterator = new PythonIterator(edgesList.iterator(), serialiser);

        while (pythonIterator.hasNext()) {
            assertEquals(serialiser.serialise((Element) iterator.next()), pythonIterator.next());
        }
    }

}
