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

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import uk.gov.gchq.gaffer.commonutil.CommonConstants;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.serialisation.implementation.raw.CompactRawSerialisationUtils;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.schema.SchemaElementDefinition;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Map;

/**
 *
 */
public class ElementSerialisation {
    private static final byte ENTITY = (byte) 0;
    private static final byte EDGE = (byte) 1;
    private static final byte UNDIRECTED = (byte) 0;
    private static final byte DIRECTED = (byte) 1;
    private static final byte NULL = (byte) 0;
    private static final byte NON_NULL = (byte) 1;
    private static final Charset UTF8 = Charset.forName(CommonConstants.UTF_8);

    private Schema schema;

    public ElementSerialisation() {

    }

    public ElementSerialisation(final Schema schema) {
        this.schema = schema;
    }

    @SuppressFBWarnings(value = "BC_UNCONFIRMED_CAST", justification = "If not an Entity then must be an Edge")
    public byte[] serialise(final Element element) throws SerialisationException {
        if (element instanceof Entity) {
            return serialiseEntity((Entity) element);
        } else {
            return serialiseEdge((Edge) element);
        }
    }

    public Element deserialise(final byte[] bytes) throws SerialisationException {
        if (null == bytes || bytes.length == 0) {
            throw new SerialisationException("Cannot deserialise a null or zero length byte array");
        }
        if (bytes[0] == ENTITY) {
            return deserialiseEntity(bytes);
        } else if (bytes[0] == EDGE) {
            return deserialiseEdge(bytes);
        } else {
            throw new SerialisationException("Unexpected first byte in byte array to deserialise (got " + bytes[0] + ")");
        }
    }

    private byte[] serialiseEntity(final Entity entity) throws SerialisationException {
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Write flag to indicate Entity
        baos.write(ENTITY);

        // Write group
        serialiseGroup(entity.getGroup(), baos);

        // Write the serialised vertex
        serialiseVertex(entity.getVertex(), baos);

        // Write the properties
        serialiseProperties(entity.getProperties(), schema.getElement(entity.getGroup()), baos);

        return baos.toByteArray();
    }

    private Entity deserialiseEntity(final byte[] bytes) throws SerialisationException {
        final ByteArrayInputStream bais = new ByteArrayInputStream(bytes);

        // Skip the first byte as we already know it indicates that this is an Entity.
        bais.read();

        // Read group
        final String group = deserialiseGroup(bais);

        // Read vertex
        final Object vertex = deserialiseVertex(bais);

        // Create Entity
        final Entity entity = new Entity(group, vertex);

        // Read the properties
        final Properties properties = deserialiseProperties(schema.getEntity(entity.getGroup()), bais);
        for (final Map.Entry<String, Object> entry : properties.entrySet()) {
            entity.putProperty(entry.getKey(), entry.getValue());
        }

        return entity;
    }

    private byte[] serialiseEdge(final Edge edge) throws SerialisationException {
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Write flag to indicate Edge
        baos.write(EDGE);

        // Write group
        serialiseGroup(edge.getGroup(), baos);

        // Write the serialised vertices
        serialiseVertex(edge.getSource(), baos);
        serialiseVertex(edge.getDestination(), baos);

        // Write directed flag
        if (edge.isDirected()) {
            baos.write(DIRECTED);
        } else {
            baos.write(UNDIRECTED);
        }

        // Write the properties
        serialiseProperties(edge.getProperties(), schema.getElement(edge.getGroup()), baos);

        return baos.toByteArray();
    }

    private Edge deserialiseEdge(final byte[] bytes) throws SerialisationException {
        final ByteArrayInputStream bais = new ByteArrayInputStream(bytes);

        // Skip the first byte as we already know it indicates that this is an Entity.
        bais.read();

        // Read group
        final String group = deserialiseGroup(bais);

        // Read vertices
        final Object source = deserialiseVertex(bais);
        final Object destination = deserialiseVertex(bais);

        // Read directed flag
        final byte flag = (byte) bais.read();
        boolean directed;
        if (flag == DIRECTED) {
            directed = true;
        } else if (flag == UNDIRECTED) {
            directed = false;
        } else {
            throw new SerialisationException("Unexpected directed flag of " + flag);
        }

        // Create Edge
        final Edge edge = new Edge(group, source, destination, directed);

        // Read the properties
        final Properties properties = deserialiseProperties(schema.getEdge(edge.getGroup()), bais);
        for (final Map.Entry<String, Object> entry : properties.entrySet()) {
            edge.putProperty(entry.getKey(), entry.getValue());
        }

        return edge;
    }

    private void serialiseGroup(final String group, final ByteArrayOutputStream baos) throws SerialisationException {
        final byte[] serialisedGroup = group.getBytes(UTF8);
        try {
            baos.write(CompactRawSerialisationUtils.writeLong(serialisedGroup.length));
            baos.write(serialisedGroup);
        } catch (final IOException e) {
            throw new SerialisationException("IOException writing group", e);
        }
    }

    private String deserialiseGroup(final ByteArrayInputStream bais) throws SerialisationException {
        int length = (int) CompactRawSerialisationUtils.read(bais);
        final byte[] serialisedGroup = new byte[length];
        int check;
        try {
            check = bais.read(serialisedGroup);
        } catch (final IOException e) {
            throw new SerialisationException("Exception reading from ByteArrayInputStream");
        }
        if (check == -1) {
            throw new SerialisationException("Exception reading from ByteArrayInputStream");
        }
        return new String(serialisedGroup, UTF8);
    }

    private void serialiseVertex(final Object vertex, final ByteArrayOutputStream baos) throws SerialisationException {
        final byte[] serialisedVertex = schema.getVertexSerialiser().serialise(vertex);
        try {
            baos.write(CompactRawSerialisationUtils.writeLong(serialisedVertex.length));
            baos.write(serialisedVertex);
        } catch (final IOException e) {
            throw new SerialisationException("IOException writing vertex", e);
        }
    }

    private Object deserialiseVertex(final ByteArrayInputStream bais) throws SerialisationException {
        final int length = (int) CompactRawSerialisationUtils.read(bais);
        final byte[] serialisedVertex = new byte[length];
        int check;
        try {
            check = bais.read(serialisedVertex);
        } catch (final IOException e) {
            throw new SerialisationException("Exception reading from ByteArrayInputStream");
        }
        if (check == -1) {
            throw new SerialisationException("Exception reading from ByteArrayInputStream");
        }
        return schema.getVertexSerialiser().deserialise(serialisedVertex);
    }

    private void serialiseProperties(final Properties properties,
                                     final SchemaElementDefinition sed,
                                     final ByteArrayOutputStream baos) throws SerialisationException {
        // Write the properties: each property is written in turn, first a flag to indicate whether it is null or not,
        // then the number of bytes in the serialised form, then the serialised bytes.
        for (final Map.Entry<String, Object> entry : properties.entrySet()) {
            final String propertyName = entry.getKey();
            final Object property = entry.getValue();
            if (property == null) {
                baos.write(NULL);
            } else {
                baos.write(NON_NULL);
                final byte[] serialisedProperty = sed.getPropertyTypeDef(propertyName).getSerialiser().serialise(property);
                try {
                    baos.write(CompactRawSerialisationUtils.writeLong(serialisedProperty.length));
                    baos.write(serialisedProperty);
                } catch (final IOException e) {
                    throw new SerialisationException("IOException writing property", e);
                }
            }
        }
    }

    private Properties deserialiseProperties(final SchemaElementDefinition sed, final ByteArrayInputStream bais)
            throws SerialisationException {
        final Properties properties = new Properties();
        for (final String propertyName : sed.getProperties()) {
            final byte nullIndicator = (byte) bais.read();
            if (NULL == nullIndicator) {
                properties.put(propertyName, null);
            } else if (NON_NULL == nullIndicator) {
                int length = (int) CompactRawSerialisationUtils.read(bais);
                final byte[] serialisedProperty = new byte[length];
                int check;
                try {
                    check = bais.read(serialisedProperty);
                } catch (final IOException e) {
                    throw new SerialisationException("Exception reading from ByteArrayInputStream");
                }
                if (check == -1) {
                    throw new SerialisationException("Exception reading from ByteArrayInputStream");
                }
                final Object property = sed.getPropertyTypeDef(propertyName).getSerialiser().deserialise(serialisedProperty);
                properties.put(propertyName, property);
            } else {
                throw new SerialisationException("Found unexpected byte - expected " + NULL + " or " + NON_NULL +
                        ", found " + nullIndicator);
            }
        }
        return properties;
    }
}
