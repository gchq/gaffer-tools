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
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.store.StoreException;

import java.io.File;

/**
 *
 */
public class TestAccumuloStoreRandomElementIngestTest {

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder(new File("/tmp/"));

    /**
     * Currently commented out due to issue https://github.com/gchq/Gaffer/issues/866
     *
     * @throws StoreException
     * @throws OperationException
     */
    @Test
    public void testAccumuloStoreRandomElementIngestTestRuns() throws StoreException, OperationException {
        // Given
//        final AccumuloRandomElementIngestTestProperties testProperties = new AccumuloRandomElementIngestTestProperties();
//        testProperties.setNumElements(100L);
//        testProperties.setElementSupplierClass(RmatElementSupplier.class.getName());
//        testProperties.setRmatProbabilities(Constants.RMAT_PROBABILITIES);
//        testProperties.setRmatMaxNodeId(100L);
//        testProperties.setTempDirectory(tempFolder.toString());
//        final Schema schema = Schema.fromJson(
//                AccumuloRandomElementIngestTest.class.getResourceAsStream("/schema/DataSchema.json"),
//                AccumuloRandomElementIngestTest.class.getResourceAsStream("/schema/DataTypes.json"),
//                AccumuloRandomElementIngestTest.class.getResourceAsStream("/schema/StoreTypes.json"));
//        final AccumuloProperties storeProperties = AccumuloProperties.loadStoreProperties(
//                AccumuloRandomElementIngestTest.class.getResourceAsStream("/mockaccumulostore.properties"));
//
//        final AccumuloStore accumuloStore = new MockAccumuloStore();
//        accumuloStore.initialise(schema, storeProperties);
//        final Graph graph = new Graph.Builder()
//                .addSchema(schema)
//                .storeProperties(storeProperties)
//                .build();
//
//        Configuration conf = new Configuration();
//        conf.set("io.seqfile.compression.type", "NONE");
//
//        // When, then should run successfully
//        AccumuloRandomElementIngestTest test = new AccumuloRandomElementIngestTest(graph, testProperties);
//        test.setConf(conf);
//        test.run();
    }
}
