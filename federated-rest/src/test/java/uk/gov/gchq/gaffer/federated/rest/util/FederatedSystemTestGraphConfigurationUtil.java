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

import uk.gov.gchq.gaffer.federated.rest.dto.GafferUrl;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import static uk.gov.gchq.gaffer.federated.rest.util.FederatedSystemTestUtil.FED_URI;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedSystemTestUtil.client;

public class FederatedSystemTestGraphConfigurationUtil {

    public static Response addUrl(final String name, final String url) {
        final GafferUrl gafferUrl = new GafferUrl(name, url);

        return client.target(FED_URI)
                     .path("/graph/urls")
                     .request()
                     .post(Entity.json(gafferUrl));
    }

    public static Response addGafferUrl(final GafferUrl gafferUrl) {
        return client.target(FED_URI)
                     .path("/graph/urls")
                     .request()
                     .post(Entity.json(gafferUrl));
    }

    public static Response deleteUrl(final String name) {
        return client.target(FED_URI)
                     .path("/graph/urls/" + name)
                     .request()
                     .delete();
    }

    public static Response getUrls() {
        return client.target(FED_URI)
                     .path("/graph/urls/")
                     .request()
                     .get();
    }
}
