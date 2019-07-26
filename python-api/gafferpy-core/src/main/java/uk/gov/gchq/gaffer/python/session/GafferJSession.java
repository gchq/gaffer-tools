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

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryonet.Connection;
import com.esotericsoftware.kryonet.Listener;
import com.esotericsoftware.kryonet.Server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.graph.Grapper;

import java.io.IOException;

public final class GafferJSession implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(GafferJSession.class);

    private PropertiesService propsService;

    private Server server;

    public GafferJSession(final PropertiesService service) throws IOException {

        this.setPropsService(service);

        this.setServer(new Server());
        this.getServer().bind(54555, 54777);

        LOGGER.info("Java Session Created");

        this.registerObjects();
        this.addListeners();
    }

    @Override
    public void run() {
        LOGGER.info("Java Session Started");
        this.getServer().start();
    }

    private void addListeners() {
        this.getServer().addListener(new Listener() {
            @Override
            public void received(final Connection connection, final Object object) {
                LOGGER.info("New Request");
                LOGGER.info("Request is a Graph request");

                Grapper graph = new Grapper.Builder()
                        .graphConfig(getPropsService().getGraphConfig())
                        .schemaConfig(getPropsService().getSchemaPath())
                        .storeProperties(getPropsService().getStoreProperties())
                        .build();

                LOGGER.info("Request sending");

                connection.sendTCP(graph);

            }
        });
    }

    private void registerObjects() {
        Kryo kryo = this.getServer().getKryo();
        kryo.register(Graph.class);
    }

    private Server getServer() {
        return server;
    }

    private void setServer(final Server server) {
        this.server = server;
    }

    private PropertiesService getPropsService() {
        return propsService;
    }

    private void setPropsService(final PropertiesService propsService) {
        this.propsService = propsService;
    }
}


