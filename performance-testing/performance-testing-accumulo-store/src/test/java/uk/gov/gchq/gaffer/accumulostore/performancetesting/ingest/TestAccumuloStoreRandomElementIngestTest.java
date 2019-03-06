/*
 * Copyright 2017-2019 Crown Copyright
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

import org.apache.hadoop.conf.Configuration;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.AccumuloStore;
import uk.gov.gchq.gaffer.accumulostore.MockAccumuloStore;
import uk.gov.gchq.gaffer.commonutil.CommonTestConstants;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.randomelementgeneration.Constants;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.schema.Schema;

import java.io.IOException;

public class TestAccumuloStoreRandomElementIngestTest {

    @Rule
    public TemporaryFolder tempFolder = new TemporaryFolder(CommonTestConstants.TMP_DIRECTORY);

    @Test
    public void testAccumuloStoreRandomElementIngestTestRuns() throws StoreException, OperationException, IOException {
        // Given
        final AccumuloElementIngestTestProperties testProperties = new AccumuloElementIngestTestProperties();
        testProperties.setNumElements(100L);
        testProperties.setBatchSize(10);
        testProperties.setElementSupplierClass(RmatElementSupplier.class.getName());
        testProperties.setRmatProbabilities(Constants.RMAT_PROBABILITIES);
        testProperties.setRmatMaxNodeId(100L);
        testProperties.setTempDirectory(tempFolder.newFolder().getCanonicalPath());

        final Schema schema = Schema.fromJson(StreamUtil.schemas(Constants.class));
        final AccumuloProperties storeProperties = AccumuloProperties.loadStoreProperties(
                StreamUtil.openStream(Constants.class, "mockaccumulostore.properties")
        );
        final AccumuloStore accumuloStore = new MockAccumuloStore();
        accumuloStore.initialise("1", schema, storeProperties);
        final Graph graph = new Graph.Builder()
                .graphId("1")
                .store(accumuloStore)
                .build();

        Configuration conf = new Configuration();
        conf.set("io.seqfile.compression.type", "NONE");

        // When, then should run successfully
        AccumuloElementIngestTest test = new AccumuloElementIngestTest(graph, accumuloStore, testProperties);
        test.setConf(conf);
        test.run();
    }
}
