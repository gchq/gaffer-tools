/*
 * Copyright 2017-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.slider.util;

import org.apache.accumulo.core.client.Connector;
import org.apache.accumulo.core.client.ZooKeeperInstance;
import org.apache.accumulo.core.client.security.tokens.PasswordToken;
import org.apache.hadoop.security.alias.CredentialProvider;
import org.apache.hadoop.security.alias.CredentialProviderFactory;
import org.apache.slider.accumulo.CustomAuthenticator;
import org.apache.slider.common.tools.Duration;
import org.apache.slider.core.conf.ConfTree;
import org.apache.slider.funtest.framework.CommandTestBase;
import org.junit.rules.TemporaryFolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

public final class AccumuloSliderUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(AccumuloSliderUtils.class);

    private AccumuloSliderUtils() {
        // private to prevent instantiation
    }

    /**
     * Retrieves the Accumulo root password from the credential keystores used by an Accumulo instance
     *
     * @param appConfig The Slider application configuration for an Accumulo instance
     * @return The root password
     * @throws IOException        if IOException
     * @throws URISyntaxException if URISyntaxException
     */
    public static String getRootPassword(final ConfTree appConfig) throws IOException, URISyntaxException {
        Map<String, List<String>> keystores = SliderKeystoreUtils.getCredentialKeyStores(appConfig);
        String passwordKeystore = null;

        // Identify the keystore that is being used to store the Accumulo root user's password
        for (final Map.Entry<String, List<String>> keystore : keystores.entrySet()) {
            if (keystore.getValue().contains(CustomAuthenticator.ROOT_INITIAL_PASSWORD_PROPERTY)) {
                passwordKeystore = keystore.getKey();
            }
        }

        if (passwordKeystore == null) {
            throw new IOException("Unable to identify a keystore that contains: " + CustomAuthenticator.ROOT_INITIAL_PASSWORD_PROPERTY);
        }

        // Load keystore
        CommandTestBase.SLIDER_CONFIG.set(CredentialProviderFactory.CREDENTIAL_PROVIDER_PATH, passwordKeystore);
        CredentialProvider provider = CredentialProviderFactory.getProviders(CommandTestBase.SLIDER_CONFIG).get(0);

        // Access root password
        CredentialProvider.CredentialEntry rootPasswordEntry = provider.getCredentialEntry(CustomAuthenticator.ROOT_INITIAL_PASSWORD_PROPERTY);
        return new String(rootPasswordEntry.getCredential());
    }

    /**
     * Creates a response file that can be used to provide all the sensitive configuration (i.e. initial passwords) that
     * Slider prompts for when the Accumulo application package is deployed.
     *
     * @param folder         The location to create the password file
     * @param rootPassword   Accumulo root user password
     * @param instanceSecret Instance secret
     * @param tracePassword  Accumulo trace user password
     * @return The password response file that has been created
     * @throws IOException if IOException thrown reading file
     */
    public static File generatePasswordFile(final TemporaryFolder folder, final String rootPassword, final String instanceSecret, final String tracePassword) throws IOException {
        File passwordFile = folder.newFile();

        BufferedWriter writer = new BufferedWriter(new FileWriter(passwordFile));
        // Root password prompt and confirmation:
        writer.write(rootPassword);
        writer.newLine();
        writer.write(rootPassword);
        writer.newLine();
        // Instance secret prompt and confirmation:
        writer.write(instanceSecret);
        writer.newLine();
        writer.write(instanceSecret);
        writer.newLine();
        // Trace user password prompt and confirmation:
        writer.write(tracePassword);
        writer.newLine();
        writer.write(tracePassword);
        writer.newLine();
        writer.close();

        return passwordFile;
    }

    /**
     * Wait until it is possible to connect to an Accumulo instance, up to a specified timeout
     *
     * @param zookeepers   ZooKeeper connection string
     * @param instanceName The name of the Accumulo instance
     * @param user         The name of the user to connect as
     * @param password     Password to authenticate with
     * @param timeout      How long to continue trying to connect (in millis)
     * @return Connection to the Accumulo instance
     * @throws Exception Reason why a connection was unable to be established
     */
    public static Connector waitForAccumuloConnection(final String zookeepers, final String instanceName, final String user, final String password, final long timeout) throws Exception {
        Duration duration = new Duration(timeout);
        duration.start();

        ZooKeeperInstance accumulo = null;
        while (accumulo == null) {
            LOGGER.info("Attempting to connect to Accumulo instance called {}, as {}, using zookeepers {}, timeout = {}",
                    instanceName, user, zookeepers, duration);

            try {
                accumulo = new ZooKeeperInstance(instanceName, zookeepers);

                // Wait for the Accumulo Master and Root Tablet server to come online
                if (accumulo.getMasterLocations().size() == 0 || accumulo.getRootTabletLocation() == null) {
                    accumulo = null;
                }
            } catch (final RuntimeException e) {
                // Suppress the RuntimeException that is thrown because ZooKeeper does not contain any information
                // yet about the Accumulo instance so that another attempt to connect can be made again later
                if (!e.getMessage().contains("Instance name " + instanceName + " does not exist in zookeeper")) {
                    throw e;
                }
            }

            if (accumulo == null) {
                if (duration.getLimitExceeded()) {
                    duration.finish();
                    throw new Exception("Timed out trying to connect to Accumulo, unable to find instance with name " + instanceName + " after " + duration);
                }

                Thread.sleep(5000);
            }
        }

        return accumulo.getConnector(user, new PasswordToken(password));
    }

    /**
     * Wait until a certain number of Tablet Servers have registered with the Accumulo instance.
     * Provides a good indication that an Accumulo instance is ready to use.
     *
     * @param accumulo          Connection to Accumulo instance
     * @param tabletServerCount The number of expected Tablet Servers
     * @param timeout           The maximum period of time (in millis) to wait for
     * @throws Exception if Exception
     */
    public static void waitForAccumuloTabletServers(final Connector accumulo, final int tabletServerCount, final long timeout) throws Exception {
        LOGGER.info("Waiting for {} Accumulo Tablet Servers to register with cluster, timeout = {} millis", tabletServerCount, timeout);

        Duration duration = new Duration(timeout);
        duration.start();

        int liveTabletServers = accumulo.instanceOperations().getTabletServers().size();

        while (liveTabletServers != tabletServerCount) {
            if (duration.getLimitExceeded()) {
                duration.finish();
                throw new Exception("Timed out waiting for Accumulo Tablet Servers, expected " + tabletServerCount + " but found " + liveTabletServers + " after " + duration);
            }

            Thread.sleep(1000);

            liveTabletServers = accumulo.instanceOperations().getTabletServers().size();
        }

        LOGGER.info("All {} Accumulo Tablet Servers are registered with the cluster after {}", liveTabletServers, duration);
    }

}
