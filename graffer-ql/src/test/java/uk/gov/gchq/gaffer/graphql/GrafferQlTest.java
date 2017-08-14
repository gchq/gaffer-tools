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
package uk.gov.gchq.gaffer.graphql;

import graphql.ExecutionResult;
import graphql.GraphQL;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.junit.Test;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements;
import uk.gov.gchq.gaffer.traffic.DemoData;
import uk.gov.gchq.gaffer.traffic.ElementGroup;
import uk.gov.gchq.gaffer.traffic.generator.RoadTrafficElementGenerator;
import uk.gov.gchq.gaffer.user.User;

import static org.junit.Assert.fail;

/**
 * This is an integration test for the entire library.
 */
public class GrafferQlTest {
    private static final Logger LOGGER = Logger.getLogger(GrafferQlTest.class);

    @Test
    public void test() throws Exception {
        // Setup User
        final User user = new User.Builder()
                .userId("user02")
                .build();

        // Setup graph
        final Graph graph = new Graph.Builder()
                .graphId("graph1")
                .storeProperties(StreamUtil.openStream(DemoData.class, "map-store.properties"))
                .addSchemas(StreamUtil.openStreams(ElementGroup.class, "schema"))
                .build();

        // Populate graph with some films data
        final OperationChain<Void> populateChain = new OperationChain.Builder()
                .first(new GenerateElements.Builder<String>()
                        .input(IOUtils.readLines(StreamUtil.openStream(DemoData.class, "roadTrafficSampleData.csv")))
                        .generator(new RoadTrafficElementGenerator())
                        .build())
                .then(new AddElements.Builder()
                        .skipInvalidElements(false)
                        .build())
                .build();
        graph.execute(populateChain, user); // Execute the populate operation chain on the graph

        // Build GraphQL based on Gaffer Graph
        final GraphQL graphQL = new GafferQLSchemaBuilder()
                .gafferSchema(graph.getSchema())
                .build();

        // Build a context for GrafferQL
        final GrafferQLContext context = new GrafferQLContext.Builder()
                .graph(graph)
                .user(user)
                .build();

        // Viewing Schema
        runGraphQL(graphQL, context, "{__schema{types{name}}}");

        // Look for a junction use of M32:1
        runGraphQL(graphQL, context, "{JunctionUse(vertex:\"M32:1\"){vertex{value} count{value}}}");

        // Look for junction use for all junctions on M32 shows multiple queries
        runGraphQL(graphQL, context, "{RoadHasJunction(source:\"M32\"){destination{JunctionUse{vertex{value} count{value}}}}}");

        // Look for junction use for all junctions in Bristol. Multi hop query.
        runGraphQL(graphQL, context, "{LocationContainsRoad(source:\"Bristol, City of\"){destination{RoadHasJunction{destination{JunctionUse{vertex{value} count{value}}}}}}}");
    }

    private void runGraphQL(final GraphQL graphQL,
                            final GrafferQLContext context,
                            final String query) {
        LOGGER.info("Running Query");
        context.reset();
        final ExecutionResult result = graphQL
                .execute(query, context);
        LOGGER.info("Result: " + result.getData());
        LOGGER.info(String.format("Operations Run (%d, cache used %d) %s",
                context.getOperations().size(),
                context.getCacheUsed(),
                context.getOperations()));
        if (result.getErrors().size() > 0) {
            LOGGER.info("Errors: " + result.getErrors());
            fail("GraphQL Reported Errors " + result.getErrors());
        }

    }
}
