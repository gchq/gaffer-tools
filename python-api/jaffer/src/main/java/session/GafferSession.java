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

package session;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryonet.Client;

import com.google.gson.JsonObject;

import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.user.User;

import javax.net.ssl.HttpsURLConnection;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

import static com.google.common.net.HttpHeaders.USER_AGENT;

public final class GafferSession {

    private String address;
    private int port;
    private String queryContext;
    private String username;
    private String password;
    private String key;

    private User user;

    private Client client;

    private GafferSession(
            final String address,
            final int port,
            final String queryContext,
            final String username,
            final String password,
            final String key
    ) {
        this.setPassword(password);
        this.setUsername(username);
        this.setKey(key);
        this.setAddress(address);
        this.setQueryContext(queryContext);
        this.setPort(port);
        this.client = new Client();
        this.client.start();

        this.register();
        this.user = this.authenticateUser();
        this.connect();
    }

    public Object execute(final Operation operation, final String queryContext) {
        int successful = this.client.sendTCP(queryContext);

        if (successful == 1) {
            return this.client.sendTCP(operation);
        } else {
            return "Couldn't preform this action";
        }
    }

    private void connect() {
        try {
            client.connect(5000, getAddress(), getPort(), 54777);
            client.sendTCP(this.user);
        } catch (final IOException e) {
            e.getLocalizedMessage();
        }
    }

    private User authenticateUser() {
        // Post to IdAM
        try {
            Properties prop = new Properties();
            prop.load(new FileInputStream(getClass().getClassLoader().getResource("application.properties").getFile()));

            JsonObject loginObject = new JsonObject();
            loginObject.addProperty("username", this.getUsername());
            loginObject.addProperty("password", this.getPassword());

            String loginResponse = this.sendPost(prop.getProperty("Auth-URL"), loginObject);
            System.out.println("Response : " + loginResponse);

            JsonObject validateObject = new JsonObject();
            validateObject.addProperty("grant_type", "authorization_code");
            validateObject.addProperty("client_id", prop.getProperty("Client-Id"));
            validateObject.addProperty("client_secret", prop.getProperty("Client-Secret"));
            validateObject.addProperty("code", loginResponse);

            String validateResponse = this.sendPost(prop.getProperty("Validate"), validateObject);
            System.out.println("Response : " + validateResponse);

        } catch (final FileNotFoundException e) {
            e.getMessage();
        } catch (final IOException e) {
            e.getMessage();
        }

        return new User.Builder().userId(getUsername()).dataAuths().opAuths().build();
    }

    private void register() {
        Kryo kryo = client.getKryo();
        kryo.register(Operation.class);
    }

    private String sendPost(final String url, final JsonObject jsonObject) throws IOException {
        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        //add request header
        con.setRequestMethod("POST");
        con.setRequestProperty("User-Agent", USER_AGENT);
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");


        con.setRequestMethod("POST");
        con.setDoOutput(true);
        OutputStream os = con.getOutputStream();
        OutputStreamWriter osw = new OutputStreamWriter(os, StandardCharsets.UTF_8);
        osw.write(jsonObject.toString());
        osw.flush();
        osw.close();
        os.close();
        con.connect();

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + jsonObject.toString());
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return response.toString();
    }

    private String getAddress() {
        return address;
    }

    private void setAddress(final String address) {
        this.address = address;
    }

    private String getQueryContext() {
        return queryContext;
    }

    private void setQueryContext(final String queryContext) {
        this.queryContext = queryContext;
    }

    private String getUsername() {
        return username;
    }

    private void setUsername(final String username) {
        this.username = username;
    }

    private String getPassword() {
        return password;
    }

    private void setPassword(final String password) {
        this.password = password;
    }

    private String getKey() {
        return key;
    }

    private void setKey(final String key) {
        this.key = key;
    }

    private int getPort() {
        return port;
    }

    private void setPort(final int port) {
        this.port = port;
    }

    public static class Builder {

        private String address;
        private String querycontext;
        private String username;
        private String password;
        private String key;
        private int port;

        public GafferSession build() {
            return new GafferSession(
                    this.address,
                    this.port,
                    this.querycontext,
                    this.username,
                    this.password,
                    this.key
            );
        }

        public Builder address(final String address) {
            this.address = address;
            return this;
        }

        public Builder querycontext(final String querycontext) {
            this.querycontext = querycontext;
            return this;
        }

        public Builder username(final String username) {
            this.username = username;
            return this;
        }

        public Builder password(final String password) {
            this.password = password;
            return this;
        }

        public Builder key(final String key) {
            this.key = key;
            return this;
        }

        public Builder port(final int port) {
            this.port = port;
            return this;
        }
    }
}
