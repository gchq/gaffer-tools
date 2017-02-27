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

package uk.gov.gchq.gaffer.federated.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import java.util.Set;

public class TypeReferenceFederatedImpl {
    private TypeReferenceFederatedImpl() {
    }

    public static class SetString extends TypeReference<Set<String>> {
    }

    public static class Schema extends TypeReference<uk.gov.gchq.gaffer.federated.rest.dto.Schema> {
    }

    public static class SystemStatus extends TypeReference<FederatedSystemStatus> {
    }
}
