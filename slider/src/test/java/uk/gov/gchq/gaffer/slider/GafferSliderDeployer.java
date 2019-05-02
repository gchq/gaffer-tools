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

package uk.gov.gchq.gaffer.slider;

import org.apache.accumulo.core.client.AccumuloException;
import org.apache.accumulo.core.client.AccumuloSecurityException;
import org.apache.accumulo.core.client.Connector;
import org.apache.accumulo.core.client.security.tokens.PasswordToken;
import org.apache.accumulo.core.security.Authorizations;
import org.apache.accumulo.core.security.SystemPermission;
import org.apache.slider.api.ClusterDescription;
import org.apache.slider.client.SliderClient;
import org.apache.slider.core.conf.ConfTree;
import org.apache.slider.core.persist.ConfTreeSerDeser;
import org.apache.slider.funtest.framework.AgentCommandTestBase;
import org.apache.slider.funtest.framework.CommandTestBase;
import org.apache.slider.funtest.framework.SliderShell;
import org.apache.slider.test.SliderTestUtils;
import org.junit.After;
import org.junit.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.SingleUseAccumuloStore;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.slider.util.AccumuloSliderProperties;
import uk.gov.gchq.gaffer.slider.util.AccumuloSliderUtils;
import uk.gov.gchq.gaffer.slider.util.GafferSliderProperties;
import uk.gov.gchq.gaffer.slider.util.SliderKeystoreUtils;
import uk.gov.gchq.gaffer.slider.util.SliderUtils;
import uk.gov.gchq.gaffer.store.StoreProperties;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.net.URISyntaxException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Map;
import java.util.Properties;

/**
 * Deploys a gaffer-slider instance using the Slider functional testing library
 */
public class GafferSliderDeployer extends AgentCommandTestBase {

    private final Logger log = LoggerFactory.getLogger(GafferSliderDeployer.class);

    private static final String CLUSTER_NAME = "gaffer-slider-integration-tests";

    private StoreProperties gafferStoreProperties;
    private ConfTree appConfig;

    @Override
    protected String getAppResource() {
        return new File(GafferSliderProperties.TEST_APP_RESOURCES_DIR, "resources.json").getAbsolutePath();
    }

    @Override
    protected String getAppTemplate() {
        return new File(GafferSliderProperties.TEST_APP_RESOURCES_DIR, "appConfig-default.json").getAbsolutePath();
    }

    private ConfTree getAppConfig() throws IOException {
        if (this.appConfig == null) {
            ConfTreeSerDeser c = new ConfTreeSerDeser();
            this.appConfig = c.fromFile(new File(this.getAppTemplate()));
            SliderUtils.replaceTokens(this.appConfig, CLUSTER_NAME);
        }
        return this.appConfig;
    }

    private String generatePassword() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

    private String createGafferAccumuloUser(final Connector accumulo, final String user, final String password) throws AccumuloSecurityException, AccumuloException {
        accumulo.securityOperations().createLocalUser(user, new PasswordToken(password));
        accumulo.securityOperations().grantSystemPermission(user, SystemPermission.CREATE_TABLE);
        accumulo.securityOperations().changeUserAuthorizations(user, new Authorizations(
                // Required by: uk.gov.gchq.gaffer.integration.impl.VisibilityIT
                "vis1",
                "vis2",
                // Required by: uk.gov.gchq.gaffer.accumulostore.integration.AccumuloAggregationIT
                "publicVisibility",
                "privateVisibility"
        ));

        log.info("Created Accumulo user called {} with password {} and authorizations {}",
                user, password, accumulo.securityOperations().getUserAuthorizations(user).toString());

        return password;
    }

    private StoreProperties buildGafferStoreProperties(final String zookeepers, final String instanceName, final String user, final String password) throws IOException {
        Properties props = new Properties();

        // Load base store properties from file
        InputStream baseStorePropertiesFile = StreamUtil.storeProps(GafferSliderDeployer.class);
        if (baseStorePropertiesFile != null) {
            try {
                props.load(baseStorePropertiesFile);
            } finally {
                try {
                    baseStorePropertiesFile.close();
                } catch (final IOException e) {
                    // Ignore
                }
            }
        }

        // Add store properties based on deployed Gaffer instance
        props.setProperty(AccumuloProperties.STORE_CLASS, SingleUseAccumuloStore.class.getCanonicalName());
        props.setProperty(AccumuloProperties.INSTANCE_NAME, instanceName);
        props.setProperty(AccumuloProperties.ZOOKEEPERS, zookeepers);
        props.setProperty(AccumuloProperties.USER, user);
        props.setProperty(AccumuloProperties.PASSWORD, password);

        return StoreProperties.loadStoreProperties(props);
    }

    public StoreProperties getGafferStoreProperties() {
        return this.gafferStoreProperties;
    }

    @Before
    public void setup() throws Exception {
        SliderKeystoreUtils.ensureCredentialKeyStoresAbsent(this.getAppConfig());

        CommandTestBase.setupCluster(CLUSTER_NAME);

        // Use Slider to deploy an Accumulo app pkg with the Gaffer add-on package
        SliderTestUtils.describe("Deploying Gaffer instance");

        final String rootPassword = this.generatePassword();
        final String instanceSecret = this.generatePassword();
        String tracePassword = this.generatePassword();

        // If Accumulo is being deployed using the root user for tracing then make sure it is using the correct password
        if (this.getAppConfig().global.get(AccumuloSliderProperties.TRACE_USER_PROPERTY).equals("root")) {
            tracePassword = rootPassword;
        }

        log.info("Accumulo Root Password: {}", rootPassword);
        log.info("Accumulo Instance Secret: {}", instanceSecret);
        log.info("Accumulo Tracer Password: {}", tracePassword);

        File passwordFile = AccumuloSliderUtils.generatePasswordFile(this.folder, rootPassword, instanceSecret, tracePassword);

        SliderShell shell = this.createTemplatedSliderApplication(
                CLUSTER_NAME,
                this.getAppTemplate(),
                this.getAppResource(),
                Arrays.asList(
                        ARG_APPDEF,
                        new File(TEST_APP_PKG_DIR, TEST_APP_PKG_FILE).getAbsolutePath(),
                        ARG_ADDON,
                        GafferSliderProperties.TEST_ADDON_PKG_NAME,
                        new File(GafferSliderProperties.TEST_ADDON_PKG_DIR, GafferSliderProperties.TEST_ADDON_PKG_FILE).getAbsolutePath(),
                        "<",
                        passwordFile.getAbsolutePath()
                )
        );

        CommandTestBase.logShell(shell);

        // Make sure the credential keystore contains the correct root password
        assertTrue("The root password in the credential keystore contains the wrong password",
                AccumuloSliderUtils.getRootPassword(this.getAppConfig()).equals(rootPassword));

        // Check with YARN that the deployed application is running
        this.ensureApplicationIsUp(CLUSTER_NAME);

        // Obtain the deployed configuration for the instance
        SliderClient sliderClient = this.bondToCluster(CommandTestBase.SLIDER_CONFIG, CLUSTER_NAME);
        ClusterDescription clusterDescription = sliderClient.getClusterDescription();
        assert clusterDescription.name.equals(CLUSTER_NAME);

        // Wait for all the YARN containers to spin up and for each Slider Agent to report in
        SliderTestUtils.describe("Waiting for YARN containers to be allocated");
        Map<String, Integer> roleMap = SliderUtils.getRoleMap(clusterDescription);
        SliderTestUtils.waitForRoleCount(sliderClient, roleMap, AccumuloSliderProperties.ACCUMULO_LAUNCH_WAIT_TIME);

        String zookeepers = clusterDescription.getZkHosts();
        String instanceName = clusterDescription.getMandatoryOption(AccumuloSliderProperties.INSTANCE_PROPERTY);
        // Replace ${CLUSTER_NAME}
        instanceName = SliderUtils.replaceClusterTokens(instanceName, CLUSTER_NAME);

        SliderTestUtils.describe("Connecting to deployed Accumulo instance");
        Connector accumulo = AccumuloSliderUtils.waitForAccumuloConnection(
                zookeepers,
                instanceName,
                "root",
                rootPassword,
                AccumuloSliderProperties.ACCUMULO_GO_LIVE_TIME
        );

        // Wait for all the tablet servers to register with the Accumulo instance
        int tabletServerCount = roleMap.get(AccumuloSliderProperties.ACCUMULO_TABLET_SERVER_ROLE_NAME);
        AccumuloSliderUtils.waitForAccumuloTabletServers(accumulo, tabletServerCount, AccumuloSliderProperties.ACCUMULO_GO_LIVE_TIME);

        // Create an Accumulo user to run all the Gaffer integration tests with.
        // This makes sure the user is granted all the permissions and visibilities required by the tests.
        SliderTestUtils.describe("Creating Accumulo user");
        String userPassword = this.createGafferAccumuloUser(accumulo, GafferSliderProperties.GAFFER_ACCUMULO_USER, this.generatePassword());

        // Generate the configuration that Gaffer needs in order to connect to the Accumulo instance
        this.gafferStoreProperties = this.buildGafferStoreProperties(zookeepers, instanceName, GafferSliderProperties.GAFFER_ACCUMULO_USER, userPassword);

        SliderTestUtils.describe("Running Gaffer Integration Tests");
    }

    @After
    public void cleanup() throws IOException, URISyntaxException {
        SliderTestUtils.describe("Tearing down Gaffer instance");
        CommandTestBase.ensureClusterDestroyed(CLUSTER_NAME);
        SliderKeystoreUtils.deleteCredentialKeyStores(this.getAppConfig());
    }

}
