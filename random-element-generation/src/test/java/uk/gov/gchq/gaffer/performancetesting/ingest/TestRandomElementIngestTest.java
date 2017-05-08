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
package uk.gov.gchq.gaffer.performancetesting.ingest;

import org.junit.Test;
import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.MockAccumuloStore;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.randomelementgeneration.Constants;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;

import static org.junit.Assert.assertTrue;

/**
 *
 */
public class TestRandomElementIngestTest {

    @Test
    public void testRandomElementIngestTestRuns() {
        // Given
        final RandomElementIngestTestProperties testProperties = new RandomElementIngestTestProperties();
        testProperties.setNumElements(100L);
        testProperties.setElementSupplierClass(RmatElementSupplier.class.getName());
        testProperties.setRmatProbabilities(Constants.RMAT_PROBABILITIES);
        testProperties.setRmatMaxNodeId(100L);
        final AccumuloProperties storeProperties = new AccumuloProperties();
        storeProperties.setStoreClass(MockAccumuloStore.class.getName());
        storeProperties.setTable("table");
        final Graph graph = new Graph.Builder()
                .storeProperties(storeProperties)
                .addSchema(TestRandomElementIngestTest.class.getResourceAsStream("/schema/DataSchema.json"))
                .addSchema(TestRandomElementIngestTest.class.getResourceAsStream("/schema/DataTypes.json"))
                .addSchema(TestRandomElementIngestTest.class.getResourceAsStream("/schema/StoreTypes.json"))
                .build();

        // When
        final RandomElementIngestTest test = new RandomElementIngestTest(graph, testProperties);
        final boolean result = test.run();

        // Then
        assertTrue(result);
    }

}
