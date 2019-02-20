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

/**
 * A GafferSession starts a Py4j gateway server process and has methods for constructing Gaffer graphs that can be called from Python
 */

public final class GafferSession {

    private static final Logger LOGGER = LoggerFactory.getLogger(GafferSession.class);

    private static GafferSession instance = null;

    private int statusCode = 0;

    private GafferSession() {
        // Singleton pattern stops multiple creations
    }

    public static synchronized GafferSession getInstance() {
        if (instance == null) {
            instance = new GafferSession();
        }
        return instance;
    }


    public int getStatusCode() {
        return this.statusCode;
    }

    public void setStatusCode(final int statusCode) {
        this.statusCode = statusCode;
    }

    /**
     * @param schemaPath path to graph schema
     * @param configPath path to graph config
     * @param storePropertiesPath path to store properties
     * @return PythonGraph reference back to python
     */
    public PythonGraph getPythonGraph(final String schemaPath, final String configPath, final String storePropertiesPath) {
        return new PythonGraph(schemaPath, configPath, storePropertiesPath);
    }

    public void startServer() {
        Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
        GatewayServer gatewayServer = new GatewayServer(GafferSession.getInstance());
        gatewayServer.start();

        GafferSession.getInstance().setStatusCode(1);

        LOGGER.info("Gaffer Python Server Started");
        LOGGER.info("Gaffer Python Server address = {}", gatewayServer.getAddress());
        LOGGER.info("Gaffer Python Server listening on port = {}", gatewayServer.getListeningPort());

        while (GafferSession.getInstance().getStatusCode() == 1) {
            // runs server
        }
        System.exit(0);
    }

    private class ServerShutDownHook extends Thread { // killing the thread also handles shutdown
        @Override
        public void run() {
            GafferSession.getInstance().setStatusCode(-1);
            LOGGER.info("Gaffer Python Server interrupted");
            LOGGER.info("Gaffer Python Server shutting down - Code: {}", GafferSession.getInstance().getStatusCode());
        }
    }
}
