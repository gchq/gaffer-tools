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

package uk.gov.gchq.gaffer.python.controllers;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.handlers.GetHandler;
import uk.gov.gchq.gaffer.python.controllers.handlers.MetricsHandler;
import uk.gov.gchq.gaffer.python.controllers.handlers.PostHandler;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.TrustManagerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Date;
import java.util.concurrent.Executors;

public final class SecureSessionAuth implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    private static final int DEFAULT_PORT = 8080;

    private static final String INDEX_HTML = "index.html";

    private static SecureSessionAuth sessionAuth = null;

    private HttpServer server;
    private PropertiesService propertiesService;

    private SecureSessionAuth() {
        // Private Constructor to make singleton
    }

    public static SecureSessionAuth getInstance() {
        if (sessionAuth == null) {
            sessionAuth = new SecureSessionAuth();
        }
        return sessionAuth;
    }

    private void start() {
        try {

            if (propertiesService.isSsl().equalsIgnoreCase("true")) {

                HttpsServer httpsServer = HttpsServer.create(new InetSocketAddress(DEFAULT_PORT), 0);
                SSLContext sslContext = SSLContext.getInstance(this.propertiesService.getProtocol());
                char[] password = this.propertiesService.getSslPassword().toCharArray();
                KeyStore store = KeyStore.getInstance(this.propertiesService.getKeystoreType());

                InputStream inputStream = new FileInputStream(this.propertiesService.getKeystoreLocation());
                store.load(inputStream, password);

                KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance("SunX509");
                keyManagerFactory.init(store, password);

                TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance("SunX509");
                trustManagerFactory.init(store);

                sslContext.init(keyManagerFactory.getKeyManagers(), trustManagerFactory.getTrustManagers(), new SecureRandom());


                HttpsConfigurator configurator = new HttpsConfigurator(sslContext) {
                    @Override
                    public void configure(final HttpsParameters params) {
                        SSLContext sslContext = getSSLContext();
                        SSLParameters defaultSSLParameters = sslContext.getDefaultSSLParameters();
                        params.setSSLParameters(defaultSSLParameters);
                    }
                };

                httpsServer.createContext("/api/1.0", new GetHandler(INDEX_HTML, true));
                httpsServer.createContext("/api/1.0/create", new PostHandler());
                httpsServer.createContext("/api/1.0/metrics", new MetricsHandler());
                httpsServer.setHttpsConfigurator(configurator);
                httpsServer.setExecutor(Executors.newCachedThreadPool());

                this.setServer(httpsServer);

                httpsServer.start();

                LOGGER.info("Gaffer Session HTTPS Server started: Listening for connections on port : {} at {}", DEFAULT_PORT, new Date());
            } else {
                this.setServer(createServer());
                this.getServer().createContext("/api/1.0", new GetHandler(INDEX_HTML, false));
                this.getServer().createContext("/api/1.0/create", new PostHandler());
                this.getServer().createContext("/api/1.0/metrics", new MetricsHandler());

                this.getServer().setExecutor(null);
                this.getServer().start();

                LOGGER.info("Gaffer Session HTTP Server started: Listening for connections on port : {} at {}", DEFAULT_PORT, new Date());
            }

            LOGGER.info("GET requests running on: /api/1.0");
            LOGGER.info("POST requests running on: /api/1.0/create");
            LOGGER.info("GET requests running on: /api/1.0/metrics");
        } catch (final CertificateException e) {
            LOGGER.error(e.getMessage());
        } catch (final UnrecoverableKeyException e) {
            LOGGER.error(e.getMessage());
        } catch (final KeyStoreException e) {
            LOGGER.error(e.getMessage());
        } catch (final KeyManagementException e) {
            LOGGER.error(e.getMessage());
        } catch (final IOException e) {
            LOGGER.error(e.getLocalizedMessage());
        } catch (final NoSuchAlgorithmException e) {
            LOGGER.error(e.getLocalizedMessage());
        }
    }

    private HttpServer createServer() throws IOException {
        return HttpServer.create(new InetSocketAddress(DEFAULT_PORT), 0);
    }

    public void setPropertiesService(final PropertiesService propertiesService) {
        this.propertiesService = propertiesService;
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
        this.start();
    }

    public void stop() {
        if (this.propertiesService.isSsl().equalsIgnoreCase("true")) {
            LOGGER.info("Gaffer Session HTTPS Server stopping: {}", new Date());
        } else {
            LOGGER.info("Gaffer Session HTTP Server stopping: {}", new Date());
        }
        this.getServer().stop(1);

    }

    private HttpServer getServer() {
        return server;
    }

    private void setServer(final HttpServer server) {
        this.server = server;
    }

    private class ServerShutDownHook extends Thread { // killing the thread also handles shutdown
        @Override
        public void run() {
            SecureSessionAuth.getInstance().stop();
        }
    }
}
