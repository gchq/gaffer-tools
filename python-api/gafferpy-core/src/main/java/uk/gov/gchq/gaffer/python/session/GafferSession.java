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

public final class GafferSession {

    private static boolean running = false;
    private int serverUp = 0;
    private static final Logger LOGGER = LoggerFactory.getLogger(GafferSession.class);

    private static GafferSession thisInstance = null;

    public static GafferSession getInstance() {
        if (thisInstance == null) {
            thisInstance = new GafferSession();
        }
        thisInstance.serverUp = 1;
        return thisInstance;
    }

    private GafferSession() {
    }


    public PythonGraph getPythonGraph(final String schemaPath, final String configPath, final String storePropertiesPath) {
        return new PythonGraph(schemaPath, configPath, storePropertiesPath);
    }

    public static void main(final String[] args) {
        GafferSession.getInstance().startServer();
    }

    public int serverUp() {
        return this.serverUp;
    }

    public boolean serverRunning() {
        return running;
    }

    private void startServer() {

        Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
        GatewayServer gatewayServer = new GatewayServer(GafferSession.getInstance());
        gatewayServer.start();

        LOGGER.info("Gaffer Python Server Started");
        LOGGER.info("Gaffer Python Server address = {}", gatewayServer.getAddress());
        LOGGER.info("Gaffer Python Server listening on port = {}", gatewayServer.getListeningPort());

        running = true;
        while (running) {
        }

        System.exit(0);
    }

    private class ServerShutDownHook extends Thread {
        @Override
        public void run() {

            LOGGER.info("Gaffer Python Server shutting down");

            GafferSession.running = false;

        }
    }
}
