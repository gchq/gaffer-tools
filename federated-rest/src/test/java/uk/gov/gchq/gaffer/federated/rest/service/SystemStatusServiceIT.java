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
import uk.gov.gchq.gaffer.federated.rest.TypeReferenceFederatedImpl.ListFederatedSystemStatus;
import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import uk.gov.gchq.gaffer.federated.rest.util.FederatedStatusUtil;

import javax.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

import static javax.ws.rs.core.Response.Status.OK;
import static org.junit.Assert.assertEquals;

public class SystemStatusServiceIT extends AbstractFederatedSystemIT {

    public SystemStatusServiceIT(final Map<String, String> services) {
        super(services);
    }

    @Test
    public void shouldReturnFederatedSystemStatus() {
        // When
        final Response response = FederatedStatusUtil.getStatus();

        // Then
        assertEquals(OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnChildStatuses() {
        // When
        final Response response = FederatedStatusUtil.getStatuses();

        // Then
        final List<FederatedSystemStatus> statusList = response.readEntity(new ListFederatedSystemStatus());

        // Then
        assertEquals(207, response.getStatus());
        assertEquals(services.size(), statusList.size());

        statusList.forEach(s -> assertEquals(OK.getStatusCode(), s.getStatus()));
    }

}
