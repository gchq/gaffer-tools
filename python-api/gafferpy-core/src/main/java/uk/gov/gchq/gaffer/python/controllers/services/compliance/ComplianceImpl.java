/*
 * Copyright 2016-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.python.controllers.services.compliance;

import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.controllers.services.compliance.execptions.ComplianceException;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class ComplianceImpl implements Compliance {

    private static PropertiesService service = new PropertiesService();

    private Schema schema;
    private GraphConfig graphConfig;
    private StoreProperties storeProperties;

    public ComplianceImpl(final Schema schema, final GraphConfig graphConfig, final StoreProperties storeProperties) {
        setSchema(schema);
        setGraphConfig(graphConfig);
        setStoreProperties(storeProperties);
    }


    @Override
    public Graph createGraph(final User user, final String reason) throws ComplianceException {
        try {
            if (getSchema() == null || getGraphConfig() == null || getStoreProperties() == null) {
                return new Graph.Builder()
                        .storeProperties(service.getStoreProperties())
                        .config(new FileInputStream(service.getGraphConfig()))
                        .addSchema(new FileInputStream(service.getSchemaPath()))
                        .build();
            } else {
                return new Graph.Builder()
                        .storeProperties(getStoreProperties())
                        .config(getGraphConfig())
                        .addSchema(getSchema())
                        .build();
            }
        } catch (final FileNotFoundException e) {
            throw new ComplianceException(e.getMessage());
        }
    }

    @Override
    public Graph executeOperation(final User user, final Operation op, final String reason) throws ComplianceException {
        try {
            if (getSchema() == null || getGraphConfig() == null || getStoreProperties() == null) {
                return new Graph.Builder()
                        .storeProperties(service.getStoreProperties())
                        .config(new FileInputStream(service.getGraphConfig()))
                        .addSchema(new FileInputStream(service.getSchemaPath()))
                        .build();
            } else {
                return new Graph.Builder()
                        .storeProperties(getStoreProperties())
                        .config(getGraphConfig())
                        .addSchema(getSchema())
                        .build();
            }
        } catch (final FileNotFoundException e) {
            throw new ComplianceException(e.getMessage());
        }
    }

    private Schema getSchema() {
        return schema;
    }

    private void setSchema(final Schema schema) {
        this.schema = schema;
    }

    private GraphConfig getGraphConfig() {
        return graphConfig;
    }

    private void setGraphConfig(final GraphConfig graphConfig) {
        this.graphConfig = graphConfig;
    }

    private StoreProperties getStoreProperties() {
        return storeProperties;
    }

    private void setStoreProperties(final StoreProperties storeProperties) {
        this.storeProperties = storeProperties;
    }
}
