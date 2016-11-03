/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package gaffer.gafferpop;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

import com.google.common.collect.Lists;
import gaffer.commonutil.TestGroups;
import gaffer.commonutil.TestPropertyNames;
import org.apache.tinkerpop.gremlin.structure.Property;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.hamcrest.core.IsCollectionContaining;
import org.junit.Test;
import java.util.ArrayList;
import java.util.Iterator;

public class GafferPopEdgeTest {
    @Test
    public void shouldConstructEdge() {
        // Given
        final String source = "source";
        final String dest = "dest";
        final GafferPopGraph graph = mock(GafferPopGraph.class);
        final GafferPopVertex outVertex = new GafferPopVertex(GafferPopGraph.ID_LABEL, source, graph);
        final GafferPopVertex inVertex = new GafferPopVertex(GafferPopGraph.ID_LABEL, dest, graph);

        // When
        final GafferPopEdge edge = new GafferPopEdge(TestGroups.EDGE, outVertex, inVertex, graph);

        // Then
        assertEquals(source, edge.id().getSource());
        assertEquals(dest, edge.id().getDest());
        assertSame(outVertex, edge.outVertex());
        assertSame(inVertex, edge.inVertex());
        final Iterator<Vertex> vertices = edge.bothVertices();
        assertSame(outVertex, vertices.next());
        assertSame(inVertex, vertices.next());
        assertSame(graph, edge.graph());
        assertTrue(edge.keys().isEmpty());
    }

    @Test
    public void shouldAddAndGetEdgeProperties() {
        // Given
        final String source = "source";
        final String dest = "dest";
        final GafferPopGraph graph = mock(GafferPopGraph.class);
        final GafferPopEdge edge = new GafferPopEdge(TestGroups.EDGE, source, dest, graph);
        final String propValue1 = "propValue1";
        final int propValue2 = 10;

        // When
        edge.property(TestPropertyNames.STRING, propValue1);
        edge.property(TestPropertyNames.INT, propValue2);

        // Then
        assertEquals(propValue1, edge.property(TestPropertyNames.STRING).value());
        assertEquals(propValue2, edge.property(TestPropertyNames.INT).value());
    }

    @Test
    public void shouldGetIterableOfEdgeProperties() {
        // Given
        final String source = "source";
        final String dest = "dest";
        final GafferPopGraph graph = mock(GafferPopGraph.class);
        final GafferPopEdge edge = new GafferPopEdge(TestGroups.EDGE, source, dest, graph);
        final String propValue1 = "propValue1";
        final int propValue2 = 10;
        edge.property(TestPropertyNames.STRING, propValue1);
        edge.property(TestPropertyNames.INT, propValue2);

        // When
        final Iterator<Property<Object>> props = edge.properties(TestPropertyNames.STRING, TestPropertyNames.INT);

        // Then
        final ArrayList<Property> propList = Lists.newArrayList(props);
        assertThat(propList, IsCollectionContaining.hasItems(
                new GafferPopProperty<>(edge, TestPropertyNames.STRING, propValue1),
                new GafferPopProperty<>(edge, TestPropertyNames.INT, propValue2)
        ));
    }

    @Test
    public void shouldCreateReadableToString() {
        // Given
        final GafferPopGraph graph = mock(GafferPopGraph.class);
        final GafferPopEdge edge = new GafferPopEdge(TestGroups.EDGE, "source", "dest", graph);

        // When
        final String toString = edge.toString();

        // Then
        assertEquals("e[source-BasicEdge->dest]", toString);
    }
}