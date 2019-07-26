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

package uk.gov.gchq.gaffer.python.graph;

import org.apache.hadoop.conf.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.data.elementdefinition.exception.SchemaException;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.io.Input;
import uk.gov.gchq.gaffer.operation.io.Output;
import uk.gov.gchq.gaffer.python.controllers.services.compliance.Compliance;
import uk.gov.gchq.gaffer.python.controllers.services.compliance.ComplianceImpl;
import uk.gov.gchq.gaffer.python.controllers.services.compliance.execptions.ComplianceException;
import uk.gov.gchq.gaffer.python.data.PythonIterator;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.config.PythonSerialiserConfig;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;

/**
 * An entry point for python to interact with a java Gaffer graph object through wrapper methods
 */

public final class Grapper {

    private static final Logger LOGGER = LoggerFactory.getLogger(Grapper.class);

    private Compliance compliance;

    private PythonSerialiserConfig pythonSerialisers = null;
    private Graph graph;
    private User user;
    private Schema schema;
    private GraphConfig graphConfig;
    private StoreProperties storeProperties;

    private Grapper() {
        buildGraph();
    }

    /**
     * @param user created user object inorder to run queries against a prebuilt graph
     * @param schemaConfig passes in the schema configuration file
     * @param graphConfig passes in the graph configuration file
     * @param storeProperties passes in the store properties
     */
    private Grapper(final User user, final InputStream schemaConfig, final InputStream graphConfig, final InputStream storeProperties) {
        this.user = user;
        try {
            this.schema = Schema.fromJson(schemaConfig);

            this.graphConfig = new GraphConfig.Builder()
                    .json(graphConfig)
                    .build();

            this.storeProperties = StoreProperties.loadStoreProperties(storeProperties);

            compliance = new ComplianceImpl(this.schema, this.graphConfig, this.storeProperties);

        } catch (final SchemaException e) {
            LOGGER.error("ERROR BUILDING GRAPH: {}", e.getMessage());
        }
        buildGraph();
    }

    private void buildGraph() {
        if (this.getSchema() == null || this.getGraphConfig() == null || this.getStoreProperties() == null) {
            throw new IllegalStateException("Schema, Graph Config or Store Properties hasn't or couldn't be found");
        }

        setPythonSerialisers(this.getStoreProperties());
        this.graph = new Graph.Builder()
                .addSchema(this.getSchema())
                .config(this.getGraphConfig())
                .storeProperties(this.getStoreProperties())
                .build();
    }

    public Graph getGraph() {
        return graph;
    }

    private User getUser() {
        return user;
    }

    private Schema getSchema() {
        return schema;
    }

    private GraphConfig getGraphConfig() {
        return graphConfig;
    }

    private StoreProperties getStoreProperties() {
        return storeProperties;
    }

    public Object execute(final String opJson, final String opReason) {

        LOGGER.info("received operation : {}", opJson);
        LOGGER.info("received user : {}", this.getUser().getUserId());

        Operation operation = null;

        try {
            operation = JSONSerialiser.deserialise(opJson, Operation.class);
        } catch (final SerialisationException e) {
            LOGGER.error(e.getMessage());
        }

        Graph graph = null;

        try {
             graph = compliance.executeOperation(this.getUser(), operation, opReason);
        } catch (final ComplianceException e) {
            LOGGER.error(e.getMessage());
        }

        Object result = null;

        if (operation instanceof Output) {

            LOGGER.info("executing Output operation");
            try {
                result = graph.execute((Output) operation, this.getUser());
            } catch (final OperationException e) {
                LOGGER.error(e.getMessage());
            }

        } else if (operation instanceof Input) {
            try {
                LOGGER.info("executing Input operation");
                graph.execute(operation, user);
            } catch (final OperationException e) {
                LOGGER.error("Input operation failed : {}", e.getMessage());
                return 1;
            }
            result = 0;
        } else {
            try {
                LOGGER.info("executing operation {}", operation.getClass().getCanonicalName());
                graph.execute(operation, user);
            } catch (final OperationException e) {
                LOGGER.error(String.format("operation %s failed: %s", operation.getClass().getCanonicalName(), e.getMessage()));
                return 1;
            }
            return 0;
        }

        if (result != null) {
            if (result instanceof Configuration) {
                return result;
            }
            if (result instanceof Iterable) {
                Iterator it = ((Iterable) result).iterator();
//                //((Output) operation).getOutputTypeReference()
                Object first = it.next();
                PythonSerialiser serialiser = getSerialiser(first);
//                //make sure iterable is closed
                return new PythonIterator(((Iterable) result).iterator(), serialiser);
            }
        }

        return result;
    }

    private void setPythonSerialisers(final StoreProperties storeProperties) {
        if (storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME.getValue()) != null) {
            String filePath = storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME.getValue());
            try {
                this.pythonSerialisers = new PythonSerialiserConfig(new FileInputStream(new File(filePath)));
            } catch (final FileNotFoundException e) {
                LOGGER.error(e.getMessage());
            }
        } else if (storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME.getValue()) == null) {
            pythonSerialisers = new PythonSerialiserConfig();
        }
    }

    public PythonSerialiserConfig getPythonSerialisers() {
        return this.pythonSerialisers;
    }

    private PythonSerialiser getSerialiser(final Object o) {

        if (pythonSerialisers != null) {
            return pythonSerialisers.getSerialiser(o.getClass());
        }
        return null;
    }

    public void setPythonSerialisers(final HashMap<String, String> serialisers) {
        for (final String classNameToSerialise : serialisers.keySet()) {
            setPythonSerialiser(classNameToSerialise, serialisers.get(classNameToSerialise));
        }
    }

    public void setPythonSerialiser(final String classNameToSerialise, final String serialiser) {
        Class classToSerialise = null;
        Class serialiserClass = null;
        try {
            classToSerialise = Class.forName(classNameToSerialise);
            serialiserClass = Class.forName(serialiser);
        } catch (final ClassNotFoundException e) {
            LOGGER.error(e.getMessage());
        }
        if (serialiserClass != null) {
            pythonSerialisers.addSerialiser(classToSerialise, serialiserClass);
        }
    }

    private Store getStore() {
        return Store.createStore(graph.getGraphId(), graph.getSchema(), graph.getStoreProperties());
    }

    public String getVertexSerialiserClassName() {

        String vertexSerialiserClass = null;

        Store store = getStore();

        vertexSerialiserClass = store.getSchema().getVertexSerialiser().getClass().getCanonicalName();

        return vertexSerialiserClass;
    }

    public String getKeyPackageClassName() {

        String keyPackageClassName = null;

        Store store = getStore();

        try {
            keyPackageClassName = ((AccumuloStore) store).getKeyPackage().getClass().getCanonicalName();
        } catch (final ClassCastException e) {
            throw new IllegalStateException("this isn't an accumulo store and therefore doesn't have a keyPackage");
        }

        return keyPackageClassName;
    }

    public static class Builder {

        private User user;

        private InputStream graphConfig;
        private InputStream schemaConfig;
        private InputStream storeProperties;

        public Grapper build() {
            return new Grapper(
                    this.user, this.schemaConfig, this.graphConfig, this.storeProperties
            );
        }

        public Builder graphConfig(final byte[] graphConfig) {
            this.graphConfig = new ByteArrayInputStream(graphConfig);
            return this;
        }

        public Builder schemaConfig(final byte[] schemaConfig) {
            this.schemaConfig = new ByteArrayInputStream(schemaConfig);
            return this;
        }

        public Builder storeProperties(final byte[] storeProperties) {
            this.storeProperties = new ByteArrayInputStream(storeProperties);
            return this;
        }

        public Builder graphConfig(final String graphConfigPath) {
            try {
                this.graphConfig = new FileInputStream(graphConfigPath);
            } catch (final FileNotFoundException e) {
                LOGGER.info("GRAPH CONFIG ERROR: {}", e.getMessage());
            }
            return this;
        }

        public Builder schemaConfig(final String schemaConfigPath) {
            try {
                this.schemaConfig = new FileInputStream(schemaConfigPath);
            } catch (final FileNotFoundException e) {
                LOGGER.info("SCHEMA ERROR: {}", e.getMessage());
            }
            return this;
        }

        public Builder storeProperties(final String storePropertiesPath) {
            try {
                this.storeProperties = new FileInputStream(storePropertiesPath);
            } catch (final FileNotFoundException e) {
                LOGGER.info("STORE PROPERTIES ERROR: {}", e.getMessage());
            }
            return this;
        }

        public Builder user(final User user) {
            this.user = user;
            return this;
        }

    }
}
