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

import uk.gov.gchq.gaffer.python.graph.PythonGraph;
import uk.gov.gchq.gaffer.python.util.SessionCounter;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;

import java.io.ByteArrayInputStream;
import java.net.InetAddress;

/**
 * A GafferSession starts a Py4j gateway server process and has methods for constructing Gaffer graphs that can be called from Python
 */
public final class GafferSession implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(GafferSession.class);

    private InetAddress address;
    private int portNumber;
    private GatewayServer server;
    private int statusCode = 0;
    private String authToken;

    /**
     * @param address Custom address for network
     * @param portNumber custom port number for multiple access on network
     * this is designed to be unsecured access point to the JVM
     */
    public GafferSession(final InetAddress address, final int portNumber) {
        this.setAddress(address);
        this.setPortNumber(portNumber);

        this.server = new GatewayServer.GatewayServerBuilder()
                .entryPoint(this)
                .javaAddress(this.getAddress())
                .javaPort(this.getPortNumber())
                .callbackClient(this.portNumber + 1, this.getAddress())
                .build();
    }

    /**
     * @param address custom address on network
     * @param portNumber custom port number for multiple access on network
     * @param authToken for authentication on to the JVM
     * this is designed to be the secure access for the JVM
     */
    public GafferSession(final InetAddress address, final int portNumber, final String authToken) {
        this.setAddress(address);
        this.setPortNumber(portNumber);
        this.setAuthToken(authToken);

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

    private void setStatusCode(final int statusCode) {
        this.statusCode = statusCode;
    }

    public InetAddress getAddress() {
        return address;
    }

    private void setAddress(final InetAddress address) {
        this.address = address;
    }

    public int getPortNumber() {
        return portNumber;
    }

    private void setPortNumber(final int portNumber) {
        this.portNumber = portNumber;
    }

    public String getAuthToken() {
        return authToken;
    }

    private void setAuthToken(final String authToken) {
        this.authToken = authToken;
    }

    private GatewayServer getServer() throws ServerNullException {
        if (this.server == null) {
            throw new ServerNullException("Server not set");
        } else {
            return server;
        }
    }

    public void setServer(final GatewayServer server) {
        this.server = server;
    }

    /**
     * @param schemaPath path to graph schema
     * @param configPath path to graph config
     * @param storePropertiesPath path to store properties
     * @return PythonGraph reference back to python
     */
    public PythonGraph getPythonGraph(final byte[] schemaPath, final byte[] configPath, final byte[] storePropertiesPath) {
        return new PythonGraph(new ByteArrayInputStream(schemaPath),
                new ByteArrayInputStream(configPath),
                new ByteArrayInputStream(storePropertiesPath));
    }

    /**
     * Starts server in new thread
     */
    @Override
    public void run() {
        try {
            Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
            this.getServer().start();
            this.setStatusCode(1);
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
        setStatusCode(-1);
        this.getServer().shutdown();
        SessionCounter.getInstance().decrement();
        LOGGER.info("Gaffer Session interrupted");
        LOGGER.info("Gaffer Session shutting down - Code: {}", getStatusCode());
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
}
