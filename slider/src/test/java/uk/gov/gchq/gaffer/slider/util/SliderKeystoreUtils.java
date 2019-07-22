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

import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.security.ProviderUtils;
import org.apache.slider.core.conf.ConfTree;
import org.apache.slider.funtest.framework.CommandTestBase;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class SliderKeystoreUtils {

    private SliderKeystoreUtils() {
        // private to prevent instantiation
    }

    public static Map<String, List<String>> getCredentialKeyStores(final ConfTree appConfig) throws IOException, URISyntaxException {
        return appConfig.credentials;
    }

    public static Set<String> getCredentialKeyStoreLocations(final ConfTree appConfig) throws IOException, URISyntaxException {
        return getCredentialKeyStores(appConfig).keySet();
    }

    public static void ensureCredentialKeyStoresAbsent(final ConfTree appConfig) throws IOException, URISyntaxException {
        Set<String> keystores = getCredentialKeyStoreLocations(appConfig);
        FileSystem fs = CommandTestBase.getClusterFS();

        for (final String keystore : keystores) {
            // Convert from jceks URL
            Path keystorePath = ProviderUtils.unnestUri(new URI(keystore));

            if (fs.exists(keystorePath)) {
                throw new IOException("Credential keystore already exists: " + keystorePath);
            }
        }
    }

    public static void deleteCredentialKeyStores(final ConfTree appConfig) throws IOException, URISyntaxException {
        Set<String> keystores = getCredentialKeyStoreLocations(appConfig);
        FileSystem fs = CommandTestBase.getClusterFS();

        for (final String keystore : keystores) {
            // Convert from jceks URL
            Path keystorePath = ProviderUtils.unnestUri(new URI(keystore));

            if (fs.exists(keystorePath)) {
                if (!fs.delete(keystorePath, false)) {
                    throw new IOException("Unable to delete credential keystore: " + keystorePath);
                }
            }
        }
    }

}
