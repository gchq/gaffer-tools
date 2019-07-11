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

package uk.gov.gchq.gaffer.python.controllers.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class PropertiesService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PropertiesService.class);

    private static final String FALSE = "false";
    private static final String TRUE = "true";

    private String singleService = "";
    private String insecure = "";
    private String ssl = "";

    private String authServiceUrl = "";

    private String sslPassword = "";
    private String keystoreLocation = "";
    private String protocol = "";

    private String schemaPath = "";
    private String graphConfig = "";
    private String storeProperties = "";

    public PropertiesService() {
        init(new File("application.properties"));
    }

    public PropertiesService(final File fileName) {
        init(fileName);
    }

    private void init(final File fileName) {
        LOGGER.info("Using Custom Configuration");
        try {

            Properties prop = new Properties();
            prop.load(new FileInputStream(fileName));

            setSingleService(prop.getProperty("single-service"));

            setInsecure(prop.getProperty("insecure"));

            setSsl(prop.getProperty("use-ssl"));

            if (getSingleService() == null) {
                setSingleService(TRUE);
            }

            if (getInsecure() == null) {
                setInsecure(TRUE);
            }

            if (isSsl() == null) {
                setSsl(FALSE);
            }

            if (getSingleService().equalsIgnoreCase(FALSE) && getInsecure().equalsIgnoreCase(FALSE)) {
                LOGGER.info("Using Secure Gaffer Sessions: Adding configuration settings");
                setAuthServiceUrl(prop.getProperty("auth-service-url"));
            }

            if (isSsl().equalsIgnoreCase(TRUE)) {
                LOGGER.info("Using SSL: Adding configuration settings");
                setSslPassword(prop.getProperty("ssl-password"));
                setKeystoreLocation(prop.getProperty("keystore-location"));
                setProtocol(prop.getProperty("protocol"));
            }

            setStoreProperties(prop.getProperty("store-properties-path"));
            setSchemaPath(prop.getProperty("schema-path"));
            setGraphConfig(prop.getProperty("graph-config-path"));

        } catch (final FileNotFoundException e) {
            LOGGER.error(e.getLocalizedMessage());
        } catch (final IOException e) {
            LOGGER.error(e.getLocalizedMessage());
        }
    }

    public String isSsl() {
        return ssl;
    }

    private void setSsl(final String ssl) {
        this.ssl = ssl;
    }

    public String getSingleService() {
        return singleService;
    }

    private void setSingleService(final String singleService) {
        this.singleService = singleService;
    }

    public String getInsecure() {
        return insecure;
    }

    private void setInsecure(final String insecure) {
        this.insecure = insecure;
    }

    public String getSslPassword() {
        return sslPassword;
    }

    private void setSslPassword(final String sslPassword) {
        this.sslPassword = sslPassword;
    }

    public String getKeystoreLocation() {
        return keystoreLocation;
    }

    private void setKeystoreLocation(final String keystoreLocation) {
        this.keystoreLocation = keystoreLocation;
    }

    public String getAuthServiceUrl() {
        return authServiceUrl;
    }

    private void setAuthServiceUrl(final String authServiceUrl) {
        this.authServiceUrl = authServiceUrl;
    }

    public String getProtocol() {
        return protocol;
    }

    private void setProtocol(final String protocol) {
        this.protocol = protocol;
    }

    public String getSchemaPath() {
        return schemaPath;
    }

    private void setSchemaPath(final String schemaPath) {
        this.schemaPath = schemaPath;
    }

    public String getGraphConfig() {
        return graphConfig;
    }

    private void setGraphConfig(final String graphConfig) {
        this.graphConfig = graphConfig;
    }

    public String getStoreProperties() {
        return storeProperties;
    }

    private void setStoreProperties(final String storeProperties) {
        this.storeProperties = storeProperties;
    }

    @Override
    public String toString() {
        return "AllProps=[single-service=" + this.getSingleService() + ",insecure=" + this.getInsecure()
                + ",use-ssl=" + this.isSsl() + ",optional=[auth-service-url=" + this.getAuthServiceUrl()
                + ",ssl-password=" + this.getSslPassword() + ",keystore-location="
                + this.getKeystoreLocation() + ",protocol=" + this.getProtocol()
                + "]]";
    }
}
