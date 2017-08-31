/*
 * Copyright 2016 Crown Copyright
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

package uk.gov.gchq.gaffer.federated.rest.util;

import org.apache.commons.io.FileUtils;
import org.glassfish.grizzly.http.server.HttpServer;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.federated.rest.SystemProperty;
import uk.gov.gchq.gaffer.federated.rest.dto.SystemStatus;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;
import static org.junit.Assert.assertEquals;

public class FederatedSystemTestUtil {
    public static final String FED_URI = "http://localhost:8080/fed/v1";
    private static final JSONSerialiser JSON_SERIALISER = new JSONSerialiser();
    private final static Logger LOGGER = LoggerFactory.getLogger(FederatedSystemTestUtil.class);
    public static final Client client = ClientBuilder.newClient();

    private static Map<String, HttpServer> serverMap = new HashMap<>();

    private FederatedSystemTestUtil() {
        // This class should not be constructed it only has utility methods
    }

    public static void reinitialiseGraph(final TemporaryFolder testFolder, final String schemaResourcePath, final String storePropertiesResourcePath) throws IOException {
        final Schema schema = Schema.fromJson(StreamUtil.openStream(FederatedSystemTestUtil.class, schemaResourcePath));
        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(StreamUtil
                .openStream(FederatedSystemTestUtil.class, storePropertiesResourcePath));
        FileUtils.writeByteArrayToFile(testFolder.newFile("schema.json"), schema
                .toJson(true));

        try (OutputStream out = new FileOutputStream(testFolder.newFile("store.properties"))) {
            storeProperties.getProperties()
                           .store(out, "This is an optional header comment string");
        }

        // set properties for REST service
        System.setProperty(SystemProperty.STORE_PROPERTIES_PATH, testFolder.getRoot() + "/store.properties");
        System.setProperty(SystemProperty.SCHEMA_PATHS, testFolder.getRoot() + "/schema.json");
    }

    public static void addElements(final Element... elements) throws IOException {
        executeOperation(new AddElements.Builder()
                .input(elements)
                .build());
    }

    public static Response executeOperation(final Operation operation) throws IOException {
        return client.target(FED_URI)
                     .path("/graph/doOperation")
                     .request()
                     .post(Entity.entity(JSON_SERIALISER.serialise(new OperationChain<>(operation)), APPLICATION_JSON_TYPE));
    }

    public static Response executeOperationChain(final OperationChain opChain) throws IOException {
        return client.target(FED_URI)
                     .path("/graph/doOperation")
                     .request()
                     .post(Entity.entity(JSON_SERIALISER.serialise(opChain), APPLICATION_JSON_TYPE));
    }

    public static Response executeOperationChainChunked(final OperationChain opChain) throws IOException {
        return client.target(FED_URI)
                     .path("/graph/doOperation/chunked")
                     .request()
                     .post(Entity.entity(JSON_SERIALISER.serialise(opChain), APPLICATION_JSON_TYPE));
    }

    private static void checkServerStatus(final String url) {
        // Given
        final Response response = client.target(url)
                                        .path("status")
                                        .request()
                                        .get();

        // When
        final String statusMsg = response.readEntity(SystemStatus.class)
                                         .getDescription();

        // Then
        assertEquals("The system is working normally.", statusMsg);
    }

}
