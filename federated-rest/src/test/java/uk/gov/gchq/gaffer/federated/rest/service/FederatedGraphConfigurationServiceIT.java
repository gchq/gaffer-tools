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
import uk.gov.gchq.gaffer.federated.rest.util.FederatedSystemTestGraphConfigurationUtil;
import javax.ws.rs.core.GenericType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static org.junit.Assert.assertEquals;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedSystemTestUtil.startServer;

public class FederatedGraphConfigurationServiceIT extends AbstractFederatedSystemIT {

    public FederatedGraphConfigurationServiceIT(final Map<String, String> services) {
        super(services);
    }

    @Test
    public void shouldAddUrls() {
        final List<GafferUrl> gafferUrls = new ArrayList<>(services.size());

        // Given
        for (final Entry<String, String> entry : services.entrySet()) {
            final String name = entry.getKey();
            final String url = entry.getValue();

            startServer(name, url);
            final GafferUrl gafferUrl = new GafferUrl(entry.getKey(), entry.getValue());
            gafferUrls.add(gafferUrl);
            FederatedSystemTestGraphConfigurationUtil.addGafferUrl(gafferUrl);
        }

        // When
        final List<GafferUrl> urls = FederatedSystemTestGraphConfigurationUtil.getUrls()
                                                                              .readEntity(new GenericType<List<GafferUrl>>() {
                                                                              });

        // Then
        assertEquals(urls, gafferUrls);
    }

}
