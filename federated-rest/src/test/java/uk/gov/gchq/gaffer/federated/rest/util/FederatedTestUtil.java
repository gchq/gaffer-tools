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
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.federated.rest.SystemProperty;
import uk.gov.gchq.gaffer.federated.rest.application.FederatedApplicationConfig;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.rest.application.ApplicationConfig;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedGraphConfigurationUtil.addUrl;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedGraphConfigurationUtil.deleteUrl;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedStatusUtil.checkServerStatus;

public class FederatedTestUtil {
    public static final String FED_URI = "http://localhost:8080/fed/v1";
    private static final JSONSerialiser JSON_SERIALISER = new JSONSerialiser();
    private final static Logger LOGGER = LoggerFactory.getLogger(FederatedTestUtil.class);
    public static final Client client = ClientBuilder.newClient();
    private static HttpServer federatedServer;

    private static Map<String, HttpServer> serverMap = new HashMap<>();

    private FederatedTestUtil() {
        // This class should not be constructed it only has utility methods
    }

    public static void reinitialiseGraph(final TemporaryFolder testFolder, final String schemaResourcePath, final String storePropertiesResourcePath) throws IOException {
        final Schema schema = Schema.fromJson(StreamUtil.openStream(FederatedTestUtil.class, schemaResourcePath));
        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(StreamUtil
                .openStream(FederatedTestUtil.class, storePropertiesResourcePath));
        FileUtils.writeByteArrayToFile(testFolder.newFile("schema.json"), schema
                .toJson(true));

        try (OutputStream out = new FileOutputStream(testFolder.newFile("store.properties"))) {
            storeProperties.getProperties()
                    .store(out, "This is an optional header comment string");
        }

        // set properties for REST service
        System.setProperty(uk.gov.gchq.gaffer.rest.SystemProperty.GRAPH_ID, "graph1");
        System.setProperty(SystemProperty.STORE_PROPERTIES_PATH, testFolder.getRoot() + "/store.properties");
        System.setProperty(SystemProperty.SCHEMA_PATHS, testFolder.getRoot() + "/schema.json");
    }

    public static void addElements(final Element... elements) throws IOException {
        executeOperation(new AddElements.Builder()
                .input(elements)
                .build());
    }

    public static Response executeServerOperation(final String url, final Operation operation) throws SerialisationException {
        return executeServerOperationChain(url, new OperationChain<>(operation));
    }

    public static Response executeServerOperationChain(final String url, final OperationChain<?> opChain) throws SerialisationException {
        return client.target(url)
                .path("/graph/doOperation")
                .request()
                .post(Entity.entity(JSON_SERIALISER.serialise(opChain), APPLICATION_JSON_TYPE));
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

    public static void startServer(final String name, final String url) {
        if (null != federatedServer) {
            if (serverMap.get(name) == null) {
                System.out.println("Starting server " + name);

                final HttpServer server = GrizzlyHttpServerFactory.createHttpServer(URI
                        .create(url), new ApplicationConfig());
                serverMap.put(name, server);

                addUrl(name, url);

                checkServerStatus(url);
            }
        } else {
            LOGGER.error("Cannot start server since Federated server is not running.");
        }
    }

    public static void stopServer(final String name) {
        if (null != federatedServer) {
            if (null != serverMap.get(name)) {
                System.out.println("Stopping server " + name);
                serverMap.remove(name).shutdownNow();
                deleteUrl(name);
            }
        } else {
            LOGGER.error("Cannot stop server since Federated server is not running.");
        }
    }

    public static void startFederatedServer() {
        if (null == federatedServer) {
            System.out.println("Starting Federated server");
            federatedServer = GrizzlyHttpServerFactory.createHttpServer(URI.create(FED_URI), new FederatedApplicationConfig());
        }
    }

    public static void stopFederatedServer() {
        if (null != federatedServer) {
            System.out.println("Stopping Federated server");
            federatedServer.shutdownNow();
            federatedServer = null;
        }
    }

}
