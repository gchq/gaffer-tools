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

import org.junit.Before;
import org.junit.Test;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.traffic.ElementGroup;
import uk.gov.gchq.gaffer.user.User;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

public class ContextBuilderTest {
    private User user;
    private Graph graph;

    @Before
    public void before() {
        // Setup User
        user = new User.Builder()
                .userId("user02")
                .build();

        // Setup graph
        graph = new Graph.Builder()
                .graphId("graph1")
                .storeProperties(StreamUtil.openStream(getClass(), "map-store.properties"))
                .addSchemas(StreamUtil.openStreams(ElementGroup.class, "schema"))
                .build();
    }

    @Test
    public void testValid() throws GrafferQLException {
        final GrafferQLContext context = new GrafferQLContext.Builder()
                .graph(graph)
                .user(user)
                .build();

        assertEquals(context.getGraph(), graph);
        assertEquals(context.getUser(), user);
    }

    @Test
    public void testNoGraph() {
        try {
            new GrafferQLContext.Builder()
                    .user(user)
                    .build();
            fail("Should have thrown exception with missing graph");
        } catch (final GrafferQLException e) {
            assertNotNull(e.getMessage());
        }
    }

    @Test
    public void testNoUser() {
        try {
            new GrafferQLContext.Builder()
                    .graph(graph)
                    .build();
            fail("Should have thrown exception with missing user");
        } catch (final GrafferQLException e) {
            assertNotNull(e.getMessage());
        }
    }
}
