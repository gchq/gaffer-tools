/*
 * Copyright 2016 Crown Copyright
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
package uk.gov.gchq.gaffer.graphql.fetch;

import graphql.schema.DataFetchingEnvironment;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.elementdefinition.view.GlobalViewElementDefinition;
import uk.gov.gchq.gaffer.data.elementdefinition.view.View;
import uk.gov.gchq.gaffer.graphql.definitions.Constants;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import java.util.Map;

/**
 * A Data Fetcher that uses a Gaffer Graph to look for Entities give a specific seed.
 */
public abstract class EntityDataFetcher extends ElementDataFetcher<Entity> {

    public EntityDataFetcher(final String group) {
        super(group, Entity.class);
    }

    protected abstract String getVertex(final DataFetchingEnvironment environment);

    protected OperationChain<CloseableIterable<? extends Element>> getOperationChain(final DataFetchingEnvironment environment,
                                                                                     final StringBuilder keyBuilder) {
        final String vertexArg = getVertex(environment);
        keyBuilder.append(vertexArg);

        return new OperationChain.Builder()
                .first(new GetElements.Builder()
                        .input(new EntitySeed(vertexArg))
                        .view(new View.Builder()
                                .globalElements(new GlobalViewElementDefinition.Builder()
                                        .groupBy()
                                        .build())
                                .entity(getGroup())
                                .build())
                        .build())
                .build();
    }

    protected void addFixedValues(final Entity element, final Map<String, Object> result) {
        result.put(Constants.VERTEX_VALUE, element.getVertex().toString());
    }
}
