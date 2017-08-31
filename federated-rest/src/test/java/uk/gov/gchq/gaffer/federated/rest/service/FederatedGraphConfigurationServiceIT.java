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
package uk.gov.gchq.gaffer.federated.rest.service;

import org.junit.Test;

import uk.gov.gchq.gaffer.federated.rest.AbstractFederatedSystemIT;
import uk.gov.gchq.gaffer.federated.rest.dto.GafferUrl;
import uk.gov.gchq.gaffer.federated.rest.util.FederatedGraphConfigurationUtil;

import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.startServer;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.stopServer;

public class FederatedGraphConfigurationServiceIT extends AbstractFederatedSystemIT {

    public FederatedGraphConfigurationServiceIT(final Map<String, String> services) {
        super(services);
    }

    @Test
    public void shouldAddUrls() {
        final Set<GafferUrl> gafferUrls = new HashSet<>(services.size());

        // Given
        for (final Entry<String, String> entry : services.entrySet()) {
            final GafferUrl gafferUrl = new GafferUrl(entry.getKey(), entry.getValue());
            gafferUrls.add(gafferUrl);
        }

        // Add additional service
        final String name = "test";
        final String url = "http://localhost:9000/test";
        startServer(name, url);
        gafferUrls.add(new GafferUrl(name, url));

        // When
        final Set<GafferUrl> urls = FederatedGraphConfigurationUtil.getUrls();
        stopServer(name);

        // Then
        assertEquals(gafferUrls, urls);
    }

    @Test
    public void shouldDeleteUrl() {
        // Given
        for (final Entry<String, String> entry : services.entrySet()) {
            FederatedGraphConfigurationUtil.deleteUrl(entry.getKey());
        }

        // When
        final Set<GafferUrl> urls = FederatedGraphConfigurationUtil.getUrls();

        // Then
        assertThat(urls, is(empty()));
    }

    @Test
    public void shouldGetUrls() {
        final Set<GafferUrl> gafferUrls = new HashSet<>(services.size());

        // Given
        for (final Entry<String, String> entry : services.entrySet()) {
            final GafferUrl gafferUrl = new GafferUrl(entry.getKey(), entry.getValue());
            gafferUrls.add(gafferUrl);
        }

        // When
        final Set<GafferUrl> urls = FederatedGraphConfigurationUtil.getUrls();

        // Then
        assertEquals(gafferUrls, urls);
    }

}
