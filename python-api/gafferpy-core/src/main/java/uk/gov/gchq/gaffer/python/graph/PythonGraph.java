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
import uk.gov.gchq.gaffer.python.data.PythonIterator;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.config.PythonSerialiserConfig;
import uk.gov.gchq.gaffer.python.util.Constants;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Iterator;
import java.util.Map;

/**
 * An entry point for python to interact with a java Gaffer graph object through wrapper methods
 */

public final class PythonGraph {

    private Graph graph = null;
    private static final Logger LOGGER = LoggerFactory.getLogger(PythonGraph.class);
    private PythonSerialiserConfig pythonSerialisers = null;

    public PythonGraph(final Schema schema, final GraphConfig graphConfig, final StoreProperties storeProperties) {
        buildGraph(schema, graphConfig, storeProperties);
    }

    public PythonGraph(final String schemaPath, final String configPath, final String storePropertiesPath) {

        Schema schema = null;
        GraphConfig config = null;
        StoreProperties storeProperties = null;

        try {
            schema = Schema.fromJson(new FileInputStream(new File(schemaPath)));
            config = new GraphConfig.Builder()
                    .json(new FileInputStream(new File(configPath)))
                    .build();
            storeProperties = StoreProperties.loadStoreProperties(new FileInputStream(new File(storePropertiesPath)));
        } catch (final FileNotFoundException | SchemaException e) {
            e.printStackTrace();
        }
        buildGraph(schema, config, storeProperties);
    }

    private void buildGraph(final Schema schema, final GraphConfig graphConfig, final StoreProperties storeProperties) {

        if (schema == null | graphConfig == null | storeProperties == null) {
            throw new IllegalStateException("schema, config or storeproperties hasn't worked");
        }

        Graph graph = new Graph.Builder()
                .addSchema(schema)
                .config(graphConfig)
                .storeProperties(storeProperties)
                .build();

        setPythonSerialisers(storeProperties);
        this.graph = graph;

    }

    public Graph getGraph() {
        return graph;
    }


    public Object execute(final String opJson, final String userJson) {

        LOGGER.debug("received operation : {}", opJson);
        LOGGER.debug("received user : {}", userJson);

        Operation operation = null;
        User user = null;

        try {
            operation = JSONSerialiser.deserialise(opJson, Operation.class);
            user = JSONSerialiser.deserialise(userJson, User.class);
        } catch (final SerialisationException e) {
            e.printStackTrace();
        }

        Object result = null;

        if (operation instanceof Output) {

                LOGGER.debug("executing Output operation");
            try {
                result = graph.execute((Output) operation, user);
            } catch (final OperationException e) {
                e.printStackTrace();
            }

        } else if (operation instanceof Input) {
            try {
                LOGGER.debug("executing Input operation");
                graph.execute((Input) operation, user);
            } catch (final OperationException e) {
                LOGGER.debug("Input operation failed : {}", e.getMessage());
                return new Integer(1);
            }
            result = new Integer(0);
        } else {
            try {
                LOGGER.debug("executing operation " + operation.getClass().getCanonicalName());
                graph.execute(operation, user);
            } catch (final OperationException e) {
                LOGGER.debug("operation " + operation.getClass().getCanonicalName() + "failed : " + e.getMessage());
                e.printStackTrace();
                return new Integer(1);
            }
            return new Integer(0);
        }

        if (result != null) {
            if (result instanceof Configuration) {
                return result;
            }
            if (result instanceof Iterable) {
                Iterator it = ((Iterable) result).iterator();
                //((Output) operation).getOutputTypeReference()
                Object first = it.next();
                PythonSerialiser serialiser = getSerialiser(first);
                //make sure iterable is closed
                return new PythonIterator(((Iterable) result).iterator(), serialiser);
            }
        }

        return result;

    }

    private void setPythonSerialisers(final StoreProperties storeProperties) {
        if (storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME) != null) {
            String filePath = storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME);
            try {
                this.pythonSerialisers = new PythonSerialiserConfig(new FileInputStream(new File(filePath)));
            } catch (final FileNotFoundException e) {
                e.printStackTrace();
            }
        } else if (storeProperties.get(Constants.SERIALISATION_DECLARATIONS_PROPERTY_NAME) == null) {
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

    public void setPythonSerialisers(final Map<String, String> serialisers) {
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
            e.printStackTrace();
        }
        if (serialiserClass != null && serialiserClass != null) {
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




}
