/*
 * Copyright 2016-2017 Crown Copyright
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

import uk.gov.gchq.gaffer.federated.rest.FederatedExecutor;
import uk.gov.gchq.gaffer.federated.rest.dto.SystemStatus;

import javax.ws.rs.core.Response;

public class SystemStatusService implements ISystemStatusService {

    private final FederatedExecutor executor = new FederatedExecutor();

    @Override
    public Response status() {
        return Response.ok(new SystemStatus("The system is working normally."))
                       .build();
    }

    @Override
    public Response statuses() {
        return Response.status(207)
                       .entity(executor.fetchSystemStatuses())
                       .build();
    }

}
