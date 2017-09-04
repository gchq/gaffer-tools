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
package uk.gov.gchq.gaffer.federated.rest.util;

import uk.gov.gchq.gaffer.federated.rest.dto.SystemStatus;

import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.FED_URI;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.client;

public class FederatedStatusUtil {

    public static Response getStatuses() {
        return client.target(FED_URI)
                     .path("/statuses")
                     .request()
                     .get();
    }

    public static Response getStatus() {
        return client.target(FED_URI)
                     .path("/status")
                     .request()
                     .get();
    }

    public static void checkServerStatus(final String url) {
        // Given
        final Response response = client.target(url)
                                        .path("status")
                                        .request()
                                        .get();

        // When
        final String statusMsg = response.readEntity(SystemStatus.class)
                                         .getDescription();

        // Then
        assertEquals("The system is working normally.", statusMsg);
    }

}
