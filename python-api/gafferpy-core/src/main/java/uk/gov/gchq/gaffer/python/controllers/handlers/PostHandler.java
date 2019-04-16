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

import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.SessionManager;
import uk.gov.gchq.gaffer.python.controllers.entities.SecureUser;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.session.GafferSession;
import uk.gov.gchq.gaffer.python.util.exceptions.NoPortsAvailableException;
import uk.gov.gchq.gaffer.user.User;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class PostHandler implements HttpHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    private static final PropertiesService PROPERTIES_SERVICE = new PropertiesService();

    private String username;
    private List<String> dataRoles;
    private List<String> opRoles;
    private String token;

    @Override
    public void handle(final HttpExchange httpExchange) throws IOException {
        LOGGER.info("Connection made to HTTP server from: {} at {}", httpExchange.getRemoteAddress(), new Date());

        BufferedReader br = new BufferedReader(new InputStreamReader(httpExchange.getRequestBody()));

        String line;
        String[] manipulator = null;

        while ((line = br.readLine()) != null) {
            if (line.equalsIgnoreCase("quit")) {
                break;
            }
            manipulator = line.split("&");
        }

        JsonObject object = new JsonObject();

        for (final String split : manipulator) {
            String[] lines = split.split("=");
            switch (lines[0]) {
                case "user":
                    setUser(lines[1]);
                    object.addProperty("user", getUser());
                    break;
                case "opAuths":
                    setOpRoles(toArray(lines[1]));
                    object.addProperty("opAuths", getOpRoles().toString());
                    break;
                case "dataAuths":
                    setDataRoles(toArray(lines[1]));
                    object.addProperty("dataAuths", getDataRoles().toString());
                    break;
                case "token":
                    setToken(lines[1]);
                    object.addProperty("token", getToken());
                    break;
                default:
                    LOGGER.debug("WARNING: Additional parameters found {} with values: {}", lines[0], lines[1]);
            }
        }

        try {
            User user;
            GafferSession session;

            if (PROPERTIES_SERVICE.isSsl().equalsIgnoreCase("true")) {
                user = new SecureUser(this.getUser(), this.getOpRoles(), this.getDataRoles(), this.getToken());
                session = SessionManager.getInstance().sessionFactory(InetAddress.getLocalHost(), ((SecureUser) user).getToken(), user);
            } else {
                user = new User.Builder()
                        .dataAuths(this.getDataRoles())
                        .userId(this.getUser())
                        .opAuths(this.getOpRoles())
                        .build();

                session = SessionManager.getInstance().sessionFactory(InetAddress.getLocalHost(), user);
            }

            session.run();
            if (session.getStatusCode() == 1) {
                object.addProperty("address", session.getAddress().toString());
                object.addProperty("portNumber", session.getPortNumber());
            }
        } catch (final NoPortsAvailableException e) {
            LOGGER.error(e.getMessage());
        }


        String payload = object.toString();

        httpExchange.sendResponseHeaders(200, payload.getBytes().length);
        OutputStream output = httpExchange.getResponseBody();
        output.write(payload.getBytes());
        output.flush();
        httpExchange.close();
        LOGGER.info("POST sent to: {} at {}", httpExchange.getRemoteAddress(), new Date());
    }

    private String getUser() {
        return username;
    }

    private void setUser(final String user) {
        this.username = user;
    }

    private List<String> getOpRoles() {
        return opRoles;
    }

    private void setOpRoles(final List<String> roles) {
        this.opRoles = roles;
    }

    private String getToken() {
        return token;
    }

    private void setToken(final String token) {
        this.token = token;
    }

    private List<String> getDataRoles() {
        return dataRoles;
    }

    private void setDataRoles(final List<String> dataRoles) {
        this.dataRoles = dataRoles;
    }


    private List<String> toArray(final String list) {
        String[] roles  = list.split(",");
        List<String> temp = new ArrayList<>();
        Collections.addAll(temp, roles);
        return temp;
    }
}
