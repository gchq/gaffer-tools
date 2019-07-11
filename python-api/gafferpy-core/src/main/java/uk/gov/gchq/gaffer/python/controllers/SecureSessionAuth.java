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
import com.sun.net.httpserver.HttpsServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.handlers.GetHandler;
import uk.gov.gchq.gaffer.python.controllers.handlers.MetricsHandler;
import uk.gov.gchq.gaffer.python.controllers.handlers.PostHandler;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import java.io.FileInputStream;
import java.io.IOException;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;

import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.Date;

public final class SecureSessionAuth implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    private static final String INDEX_HTML = "index.html";

    private static SecureSessionAuth sessionAuth = null;

    private static HttpServer httpServer;
    private static HttpsServer httpsServer;

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

    private void start() throws UnknownHostException {
        String hostname = InetAddress.getLocalHost().getHostAddress();
        InetSocketAddress address = new InetSocketAddress(hostname, 8080);
        try {
            if (propertiesService.isSsl().equalsIgnoreCase("true")) {
                HttpsServer server = HttpsServer.create(address, 10);

                SSLContext sslContext = getSSLContext();

                server.setHttpsConfigurator(new HttpsConfigurator(sslContext));
                server.createContext("/api/1.0", new GetHandler(INDEX_HTML));
                server.createContext("/api/1.0/create", new PostHandler());
                server.createContext("/api/1.0/metrics", new MetricsHandler());

                server.setExecutor(null);
                server.start();

                LOGGER.info("Gaffer Session HTTPS Server started: {} at {}", server.getAddress(), new Date());

                setHttpsServer(server);

            } else {
                setHttpServer(HttpServer.create(address, 10));

                getHttpServer().createContext("/api/1.0", new GetHandler(INDEX_HTML));
                getHttpServer().createContext("/api/1.0/create", new PostHandler());
                getHttpServer().createContext("/api/1.0/metrics", new MetricsHandler());

                getHttpServer().setExecutor(null);
                getHttpServer().start();

                LOGGER.info("Gaffer Session HTTP Server started: {} at {}", getHttpServer().getAddress(), new Date());
            }

            LOGGER.info("GET requests running on: /api/1.0");
            LOGGER.info("GET requests running on: /api/1.0/metrics");
            LOGGER.info("POST requests running on: /api/1.0/create");
        } catch (final IOException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        } catch (final CertificateException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        } catch (final NoSuchAlgorithmException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        } catch (final KeyManagementException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        } catch (final UnrecoverableKeyException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        } catch (final KeyStoreException e) {
            LOGGER.error(e.getMessage());
            e.printStackTrace();
        }
    }

    public void setPropertiesService(final PropertiesService propertiesService) {
        this.propertiesService = propertiesService;
    }

    @Override
    public void run() {
        Runtime.getRuntime().addShutdownHook(new ServerShutDownHook());
        try {
            this.start();
        } catch (final UnknownHostException e) {
            LOGGER.error(e.getMessage());
        }
    }

    public void stop() {
        if (this.propertiesService.isSsl().equalsIgnoreCase("true")) {
            LOGGER.info("Gaffer Session HTTPS Server stopping: {}", new Date());
            getHttpsServer().stop(1);
        } else {
            LOGGER.info("Gaffer Session HTTP Server stopping: {}", new Date());
            getHttpServer().stop(1);
        }
    }

    private static HttpServer getHttpServer() {
        return httpServer;
    }

    private static void setHttpServer(final HttpServer httpServer) {
        SecureSessionAuth.httpServer = httpServer;
    }

    private static HttpsServer getHttpsServer() {
        return httpsServer;
    }

    private static void setHttpsServer(final HttpsServer httpsServer) {
        SecureSessionAuth.httpsServer = httpsServer;
    }

    private class ServerShutDownHook extends Thread { // killing the thread also handles shutdown
        @Override
        public void run() {
            SecureSessionAuth.getInstance().stop();
        }
    }

    private SSLContext getSSLContext()
            throws KeyStoreException, IOException, NoSuchAlgorithmException,
            KeyManagementException, CertificateException, UnrecoverableKeyException {

        LOGGER.info("Using certificate from: {} - {}", this.propertiesService.getKeystoreLocation(), new Date());

        InputStream store = this.getClass().getClassLoader().getResourceAsStream(this.propertiesService.getKeystoreLocation());


        if (store == null) {
            store = new FileInputStream(this.propertiesService.getKeystoreLocation());
        }

        char[] password =  this.propertiesService.getSslPassword().toCharArray();

        String keyStoreType = KeyStore.getDefaultType();
        KeyStore keyStore = KeyStore.getInstance(keyStoreType);
        keyStore.load(store, password);

        String kmfAlgorithm = KeyManagerFactory.getDefaultAlgorithm();
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(kmfAlgorithm);
        kmf.init(keyStore, password);

        String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
        TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
        tmf.init(keyStore);

        SSLContext context = SSLContext.getInstance("TLSv1.2");
        context.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
        return context;
    }
}
