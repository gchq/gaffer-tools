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

package uk.gov.gchq.gaffer.python.controllers.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.SessionManager;
import uk.gov.gchq.gaffer.python.util.SessionCounter;

import java.io.IOException;
import java.util.Date;

public class MetricsHandler implements HttpHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    @Override
    public void handle(final HttpExchange httpExchange) throws IOException {

        System.out.println("Connection made");

        LOGGER.info("Connection made from: {} at {}", httpExchange.getRemoteAddress(), new Date());

        String payload = "Total number of running sessions: " + SessionCounter.getInstance().getCounter();

        httpExchange.getResponseHeaders().set("Content-Type", "text/html");
        httpExchange.sendResponseHeaders(200, payload.getBytes().length);
        httpExchange.getResponseBody().write(payload.getBytes());

        httpExchange.close();

        LOGGER.info("GET sent to: {} at {}", httpExchange.getRemoteAddress(), new Date());
    }
}
