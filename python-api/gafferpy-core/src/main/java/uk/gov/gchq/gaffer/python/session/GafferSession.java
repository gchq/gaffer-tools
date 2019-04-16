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

package uk.gov.gchq.gaffer.python.session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import py4j.GatewayServer;

import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.graph.PythonGraph;
import uk.gov.gchq.gaffer.python.util.SessionCounter;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;
import uk.gov.gchq.gaffer.user.User;

import java.net.InetAddress;
import java.util.HashMap;

/**
 * A GafferSession starts a Py4j gateway server process and has methods for constructing Gaffer graphs that can be called from Python
 */
public final class GafferSession implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(GafferSession.class);

    private static PropertiesService service = new PropertiesService();

    private InetAddress address;
    private int portNumber;
    private GatewayServer server;
    private int statusCode = 0;
    private String authToken;
    private User user;

    private HashMap<String, PythonGraph> allGraphs = new HashMap<>();

    /**
     * @param address custom address on network
     * @param portNumber custom port number for multiple access on network
     * @param authToken for authentication on to the JVM
     * @param user provides a user to the graph so that operations can be executed with user mascaraing as someone else
     * this is designed to be the secure access for the JVM
     */
    private GafferSession(final InetAddress address, final int portNumber, final String authToken, final User user) {
        this.address = address;
        this.portNumber = portNumber;
        this.authToken = authToken;
        this.user = user;

        this.server = new GatewayServer.GatewayServerBuilder()
                .entryPoint(this)
                .authToken(this.getAuthToken())
                .javaAddress(this.getAddress())
                .javaPort(this.getPortNumber())
                .callbackClient(this.portNumber + 1, this.getAddress())
                .build();
    }

    public int getStatusCode() {
        return this.statusCode;
    }

    public InetAddress getAddress() {
        return address;
    }

    public int getPortNumber() {
        return portNumber;
    }

    public String getAuthToken() {
        return authToken;
    }

    private GatewayServer getServer() throws ServerNullException {
        if (this.server == null) {
            throw new ServerNullException("Server not set");
        } else {
            return server;
        }
    }

    /**
     * @param schemaPath path to graph schema
     * @param configPath path to graph config
     * @param storePropertiesPath path to store properties
     * @return PythonGraph reference back to python
     */
    public PythonGraph getPythonGraph(final byte[] schemaPath, final byte[] configPath, final byte[] storePropertiesPath) {
        return new PythonGraph.Builder()
                .storeProperties(storePropertiesPath)
                .schemaConfig(schemaPath)
                .graphConfig(configPath)
                .build();
    }

    public HashMap<String, PythonGraph> getAllPythonGraphs() {
        return allGraphs;
    }

    public PythonGraph getGraphById(final String id) {

        PythonGraph graph = this.allGraphs.get(id);

        if (graph != null) {
            return graph;
        }

        graph = new PythonGraph.Builder()
                .user(this.user)
                .graphConfig(service.getGraphConfig())
                .schemaConfig(service.getSchemaPath())
                .storeProperties(service.getStoreProperties())
                .build();

        this.allGraphs.put(id, graph);

        return graph;
    }

    /**
     * Starts server in new thread
     */
    @Override
    public void run() {
        try {
            Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
            this.getServer().start();
            this.statusCode = 1;
            SessionCounter.getInstance().increment();
            LOGGER.info("Gaffer Session Started");
            LOGGER.info("Gaffer Session address = {}", this.getServer().getAddress());
            LOGGER.info("Gaffer Session listening on port = {}", this.getServer().getListeningPort());
        } catch (final ServerNullException e) {
            LOGGER.error(e.getMessage());
        }
    }

    /**
     * @throws ServerNullException if server hasn't been created
     * Stops the server gracefully
     */
    public void stop() throws ServerNullException {
        this.statusCode = -1;
        this.getServer().shutdown();
        SessionCounter.getInstance().decrement();
        LOGGER.info("Gaffer Session interrupted");
        LOGGER.info("Gaffer Session shutting down - Code: {}", getStatusCode());
    }

    public User getUser() {
        return user;
    }

    private class ServerShutDownHook extends Thread { // killing the thread also handles shutdown
        @Override
        public void run() {
            try {
                GafferSession.this.stop();
            } catch (final ServerNullException e) {
                GafferSession.LOGGER.error(e.getMessage());
            }
        }
    }

    public static class Builder {

        private InetAddress address;
        private int portNumber;
        private String authToken;
        private User user;

        public GafferSession build() {
            return new GafferSession(address, portNumber, authToken, user);
        }

        public Builder address(final InetAddress address) {
            this.address = address;
            return this;
        }

        public Builder portNumber(final int portNumber) {
            this.portNumber = portNumber;
            return this;
        }

        public Builder authToken(final String authToken) {
            this.authToken = authToken;
            return this;
        }

        public Builder user(final User user) {
            this.user = user;
            return this;
        }
    }
}
