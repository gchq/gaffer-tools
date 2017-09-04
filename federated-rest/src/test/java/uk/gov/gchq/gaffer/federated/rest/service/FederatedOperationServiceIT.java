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

import uk.gov.gchq.gaffer.commonutil.TestGroups;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.federated.rest.AbstractFederatedSystemIT;
import uk.gov.gchq.gaffer.federated.rest.TypeReferenceFederatedImpl.ListElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllElements;

import javax.ws.rs.core.Response;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import static javax.ws.rs.core.Response.Status.OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertEquals;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.addElements;
import static uk.gov.gchq.gaffer.federated.rest.util.FederatedTestUtil.executeServerOperation;

public class FederatedOperationServiceIT extends AbstractFederatedSystemIT {

    public FederatedOperationServiceIT(final Map<String, String> services) {
        super(services);
    }

    @Test
    public void shouldExecuteOperation() throws IOException {

        // Given
        final String vertex = "vertex1";

        // When
        final Entity entity = new Entity.Builder()
                .group(TestGroups.ENTITY)
                .vertex(vertex)
                .property("count", 1)
                .build();

        // add elements to Federated store
        addElements(entity);

        // Then
        final GetAllElements getAllElements = new GetAllElements.Builder()
                .build();

        for (final Entry<String, String> entry : services.entrySet()) {

            final Response response = executeServerOperation(entry.getValue(), getAllElements);
            final List<Element> elements = response.readEntity(new ListElements());

            assertEquals(OK.getStatusCode(), response.getStatus());
            assertThat(elements, hasSize(1));
        }
    }
}
