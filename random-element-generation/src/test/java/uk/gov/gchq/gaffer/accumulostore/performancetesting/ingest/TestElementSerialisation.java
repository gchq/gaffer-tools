/*
 * Copyright 2017 Crown Copyright
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
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import org.junit.Test;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.serialisation.FreqMapSerialiser;
import uk.gov.gchq.gaffer.serialisation.implementation.StringSerialiser;
import uk.gov.gchq.gaffer.serialisation.implementation.raw.CompactRawLongSerialiser;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.schema.SchemaEdgeDefinition;
import uk.gov.gchq.gaffer.store.schema.SchemaEntityDefinition;
import uk.gov.gchq.gaffer.store.schema.TypeDefinition;
import uk.gov.gchq.gaffer.types.FreqMap;

import static org.junit.Assert.assertEquals;

/**
 *
 */
public class TestElementSerialisation {

    private static final Schema SCHEMA = new Schema.Builder()
            .type("long", new TypeDefinition.Builder()
                    .serialiser(new CompactRawLongSerialiser())
                    .build())
            .type("string", new TypeDefinition.Builder()
                    .serialiser(new StringSerialiser())
                    .build())
            .type("freqmap", new TypeDefinition.Builder()
                    .serialiser(new FreqMapSerialiser())
                    .build())
            .vertexSerialiser(new StringSerialiser())
            .entity("ENTITY", new SchemaEntityDefinition.Builder()
                    .vertex("string")
                    .property("count", "long")
                    .property("freqmap", "freqmap")
                    .build())
            .edge("EDGE", new SchemaEdgeDefinition.Builder()
                    .source("string")
                    .destination("string")
                    .property("count", "long")
                    .build())
            .build();
    private static final ElementSerialisation SERIALISATION = new ElementSerialisation(SCHEMA);

    @Test
    public void testSerialiseAndDeserialiseWithProperties() throws SerialisationException {
        // Given
        final FreqMap map = new FreqMap();
        map.put("X", 100L);
        map.put("Y", 1000L);
        final Entity entity = new Entity.Builder()
                .group("ENTITY")
                .vertex("A")
                .property("count", 5L)
                .property("freqmap", map)
                .build();
        final Edge edge = new Edge.Builder()
                .group("EDGE")
                .source("A")
                .dest("B")
                .property("count", 100L)
                .build();

        test(entity);
        test(edge);
    }

    @Test
    public void testSerialiseAndDeserialiseNoProperties() throws SerialisationException {
        // Given
        final Entity entity = new Entity.Builder()
                .group("ENTITY")
                .vertex("A")
                .build();
        final Edge edge = new Edge.Builder()
                .group("EDGE")
                .source("A")
                .dest("B")
                .build();

        test(entity);
        test(edge);
    }

    private void test(final Element element) throws SerialisationException {
        // When
        final byte[] serialisedElement = SERIALISATION.serialise(element);
        final Element deserialisedElement = SERIALISATION.deserialise(serialisedElement);

        // Then
        assertEquals(element, deserialisedElement);
    }
}
