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

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
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
import uk.gov.gchq.gaffer.python.util.exceptions.NullUserException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.util.Date;
import java.util.List;

public class PostHandler implements HttpHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    private SecureUser username;
    private String token;
    private String refreshToken;
    private int timeout;
    private String tokenType;

    @Override
    public void handle(final HttpExchange httpExchange) throws IOException {
        LOGGER.info("Connection made from: {} at {}", httpExchange.getRemoteAddress(), new Date());
        try (InputStreamReader inputStreamReader = new InputStreamReader(httpExchange.getRequestBody())) {
            JsonObject object = this.buildPayload(inputStreamReader);

            GafferSession session;

            if (new PropertiesService().isSsl().equalsIgnoreCase("true")) {
                session = SessionManager.getInstance().sessionFactory(InetAddress.getLocalHost(), this.getToken(), this.getUser());
            } else {
                session = SessionManager.getInstance().sessionFactory(InetAddress.getLocalHost(), this.getUser());
            }

            session.run();
            if (session.getStatusCode() == 1) {
                object.addProperty("address", session.getAddress().toString());
                object.addProperty("portNumber", session.getPortNumber());
            }

            String payload = object.toString();

            httpExchange.sendResponseHeaders(200, payload.getBytes().length);
            httpExchange.getResponseBody().write(payload.getBytes());

            LOGGER.info("POST sent to: {} at {}", httpExchange.getRemoteAddress(), new Date());

        } catch (final NoPortsAvailableException e) {
            LOGGER.error(e.getMessage());
        } catch (final NullUserException e) {
            LOGGER.error(e.getMessage());
        }

        httpExchange.close();
    }

    private JsonObject buildPayload(final InputStreamReader requestBody) throws NullUserException, IOException {
        BufferedReader br = new BufferedReader(requestBody);

        String line;
        String[] manipulator = null;

        while ((line = br.readLine()) != null) {
            if (line.equalsIgnoreCase("quit")) {
                break;
            }
            manipulator = line.split("&");
        }

        JsonObject object = new JsonObject();

        String idToken = null;

        for (final String split : manipulator) {
            String[] lines = split.split("=");
            switch (lines[0]) {
                case "id_token":
                    idToken = lines[1];
                    break;
                case "refresh_token":
                    setRefreshToken(lines[1]);
                    break;
                case "token_type":
                    setTokenType(lines[1]);
                    break;
                case "access_token":
                    setToken(lines[1]);
                    break;
                case "expires_in":
                    setTimeout(new Integer(lines[1]));
                    break;
                default:
                    LOGGER.debug("WARNING: Additional parameters found {} with values: {}", lines[0], lines[1]);
            }
        }

        SecureUser user = getUserFromToken(idToken);

        if (user != null) {
            setUser(user);
        } else {
            throw new NullUserException("Couldn't build user object");
        }

        br.close();
        return object;
    }

    private SecureUser getUserFromToken(final String token) {
        SecureUser secureUser = null;
        DecodedJWT jwt = null;

        if (getTokenType().equalsIgnoreCase("bearer")) {
            try {
                jwt = JWT.decode(token);
            } catch (final JWTDecodeException exception) {
                LOGGER.error(exception.getMessage());
            }

            if (jwt != null) {
                LOGGER.info("Decoded {} -  {}", jwt.getIssuer(), new Date());

                String user = jwt.getClaim("user").asString();

                List<String> dataAuth = null;
                List<String> opAuth = null;

                try {
                    dataAuth = (List<String>) jwt.getClaim("data_auth").asList(Class.forName("java.lang.String"));
                    opAuth = (List<String>) jwt.getClaim("op_auth").asList(Class.forName("java.lang.String"));
                } catch (final ClassNotFoundException e) {
                    LOGGER.error(e.getMessage());
                }

                LOGGER.info("Access token is {} - {}", this.getToken(), new Date());

                secureUser = new SecureUser(user, dataAuth, opAuth, this.getToken());
                LOGGER.info("User {} authenticated and authorised with roles of {} and {} - {}",
                        secureUser.getUserId(), dataAuth, opAuth, new Date());
            }
        }
        return secureUser;
    }

    private SecureUser getUser() {
        return username;
    }

    private void setUser(final SecureUser user) {
        this.username = user;
    }

    private String getToken() {
        return token;
    }

    private void setToken(final String token) {
        this.token = token;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(final int timeout) {
        this.timeout = timeout;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(final String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(final String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
