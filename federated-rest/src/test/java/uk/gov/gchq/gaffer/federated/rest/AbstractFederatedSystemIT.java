/*
 * Copyright 2017 Crown Copyright
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
package uk.gov.gchq.gaffer.federated.rest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExternalResource;
import org.junit.rules.TemporaryFolder;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import uk.gov.gchq.gaffer.commonutil.CommonTestConstants;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil;

import java.util.Collection;
import java.util.Map;
import java.util.stream.IntStream;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toMap;
import static org.junit.Assert.assertNotNull;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.reinitialiseGraph;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.startFederatedServer;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.stopFederatedServer;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.stopServer;

@RunWith(Parameterized.class)
public class AbstractFederatedSystemIT {

    @Rule
    public final TemporaryFolder testFolder = new TemporaryFolder(CommonTestConstants.TMP_DIRECTORY);
    protected final Map<String, String> services;
    private final String storePropertiesResourcePath = StreamUtil.STORE_PROPERTIES;
    private final String schemaResourcePath = StreamUtil.SCHEMA;
    @Rule
    public ExternalResource externalResource = new ExternalResource() {
        protected void before() throws Throwable {
            startFederatedServer();
            reinitialiseGraph(testFolder, schemaResourcePath, storePropertiesResourcePath);
            services.forEach(FederatedTestUtil::startServer);
        }

        protected void after() {
            services.forEach((name, url) -> stopServer(name));
            stopFederatedServer();
        }
    };
    public AbstractFederatedSystemIT(final Map<String, String> services) {
        this.services = services;
    }

    @Parameters
    public static Collection<Object[]> instancesToTest() {
        return asList(new Object[]{oneServer()},
                new Object[]{twoServers()},
                new Object[]{threeServers()});
    }

    public static Map<String, String> oneServer() {
        return getServers(1, 1);
    }

    public static Map<String, String> twoServers() {
        return getServers(2, 3);
    }

    public static Map<String, String> threeServers() {
        return getServers(4, 6);
    }

    private static Map<String, String> getServers(final int from, final int to) {
        return IntStream.rangeClosed(from, to)
                        .boxed()
                        .collect(toMap(AbstractFederatedSystemIT::intToServerName,
                                AbstractFederatedSystemIT::intToUrl));
    }

    private static String intToServerName(final int i) {
        return "example" + Integer.toString(i);
    }

    private static String intToUrl(final int i) {
        return "http://localhost:808" + i + "/example" + i + "/v1";
    }

    @Test
    public void shouldInitialise() {
        assertNotNull(services);
    }

}
