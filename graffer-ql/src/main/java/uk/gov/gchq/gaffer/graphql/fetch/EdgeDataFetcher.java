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

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import graphql.schema.DataFetchingEnvironment;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.elementdefinition.view.GlobalViewElementDefinition;
import uk.gov.gchq.gaffer.data.elementdefinition.view.View;
import uk.gov.gchq.gaffer.graphql.definitions.Constants;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.data.EdgeSeed;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import java.util.Map;

/**
 * A Data Fetcher that uses a Gaffer Graph to look for Entities give a specific seed.
 */
public abstract class EdgeDataFetcher extends ElementDataFetcher<Edge> {

    public EdgeDataFetcher(final String group) {
        super(group, Edge.class);
    }

    protected abstract String getVertex(final DataFetchingEnvironment environment);

    protected abstract String getSource(final DataFetchingEnvironment environment);

    protected abstract String getDestination(final DataFetchingEnvironment environment);

    @SuppressFBWarnings("NP_LOAD_OF_KNOWN_NULL_VALUE")
    protected OperationChain<CloseableIterable<? extends Element>> getOperationChain(final DataFetchingEnvironment environment,
                                                                                     final StringBuilder keyBuilder) {
        final String vertexArg = getVertex(environment);
        final String sourceArg = getSource(environment);
        final String destinationArg = getDestination(environment);
        keyBuilder.append(vertexArg);
        keyBuilder.append(KEY_DELIMITER);
        keyBuilder.append(sourceArg);
        keyBuilder.append(KEY_DELIMITER);
        keyBuilder.append(destinationArg);

        int nonNullCount = 0;
        nonNullCount += (vertexArg != null) ? 1 : 0;
        nonNullCount += (sourceArg != null) ? 1 : 0;
        nonNullCount += (destinationArg != null) ? 1 : 0;

        String lastArg = null;
        lastArg = (vertexArg != null) ? vertexArg : lastArg;
        lastArg = (sourceArg != null) ? sourceArg : lastArg;
        lastArg = (destinationArg != null) ? destinationArg : lastArg;

        OperationChain<CloseableIterable<? extends Element>> opChain = null;
        switch (nonNullCount) {
            case 1:
                opChain = new OperationChain.Builder()
                        .first(new GetElements.Builder()
                                .input(new EntitySeed(lastArg))
                                .view(new View.Builder()
                                        .globalElements(new GlobalViewElementDefinition.Builder()
                                                .groupBy()
                                                .build())
                                        .edge(getGroup())
                                        .build())
                                .build())
                        .build();
                break;
            case 2:
                opChain = new OperationChain.Builder()
                        .first(new GetElements.Builder()
                                .input(new EdgeSeed(sourceArg, destinationArg, true))
                                .view(new View.Builder()
                                        .globalElements(new GlobalViewElementDefinition.Builder()
                                                .groupBy()
                                                .build())
                                        .build())
                                .build())
                        .build();
                break;
            case 0:
                throw new IllegalArgumentException("No arguments set, not rated for GetAllEdges");
            case 3:
            default:
                throw new IllegalArgumentException("Bizarre combination of arguments set");
        }

        return opChain;
    }

    protected void addFixedValues(final Edge element, final Map<String, Object> result) {
        result.put(Constants.SOURCE_VALUE, element.getSource().toString());
        result.put(Constants.DESTINATION_VALUE, element.getDestination().toString());
    }
}
