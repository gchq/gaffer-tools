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
package uk.gov.gchq.gaffer.performancetesting.ingest;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import uk.gov.gchq.gaffer.accumulostore.AccumuloProperties;
import uk.gov.gchq.gaffer.accumulostore.MiniAccumuloStore;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.performancetesting.FileWriterMetricsListener;
import uk.gov.gchq.gaffer.performancetesting.query.QueryMetrics;
import uk.gov.gchq.gaffer.performancetesting.query.QueryTest;
import uk.gov.gchq.gaffer.performancetesting.query.QueryTestProperties;
import uk.gov.gchq.gaffer.randomelementgeneration.Constants;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ElementsSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.EntitySeedSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

public class TestQueryTest {

    @TempDir
    public File folder;

    @Test
    public void testQueryTestRuns() throws OperationException {
        // Given
        final QueryTestProperties testProperties = new QueryTestProperties();
        testProperties.setNumSeeds(100L);
        testProperties.setBatchSize(10);
        testProperties.setElementIdSupplierClass(EntitySeedSupplier.class.getName());
        testProperties.setRmatProbabilities(Constants.RMAT_PROBABILITIES);
        testProperties.setRmatMaxNodeId(100L);
        final AccumuloProperties storeProperties = AccumuloProperties.loadStoreProperties(
                StreamUtil.openStream(Constants.class, "accumuloStore.properties")
        );
        storeProperties.setStoreClass(MiniAccumuloStore.class.getName());
        final Graph graph = new Graph.Builder()
                .config(new GraphConfig.Builder().graphId("id").build())
                .storeProperties(storeProperties)
                .addSchemas(StreamUtil.schemas(Constants.class))
                .build();
        graph.execute(new AddElements.Builder()
                .input(Stream
                        .generate(new ElementsSupplier(new RmatElementSupplier(Constants.RMAT_PROBABILITIES, 100L, true)))
                        .limit(1000L)::iterator)
                .build(), new User());

        // When
        final QueryTest test = new QueryTest(graph, testProperties);
        final double result = test.run();

        // Then
        assertThat(result > 0.0D).isTrue();
    }

    @Test
    public void testQueryTestOutputsToListener() throws IOException, OperationException {
        // Given
        final QueryTestProperties testProperties = new QueryTestProperties();
        testProperties.setNumSeeds(100L);
        testProperties.setBatchSize(10);
        testProperties.setElementIdSupplierClass(EntitySeedSupplier.class.getName());
        testProperties.setRmatProbabilities(Constants.RMAT_PROBABILITIES);
        testProperties.setRmatMaxNodeId(100L);
        testProperties.setMetricsListenerClass(FileWriterMetricsListener.class.getName());
        final File metricsResults = new File(folder, "metricsResults.txt");
        final String metricsResultsFilename = metricsResults.getPath();
        testProperties.setProperty(FileWriterMetricsListener.FILENAME, metricsResultsFilename);
        final AccumuloProperties storeProperties = AccumuloProperties.loadStoreProperties(
                StreamUtil.openStream(Constants.class, "accumuloStore.properties")
        );
        storeProperties.setStoreClass(MiniAccumuloStore.class.getName());
        final Graph graph = new Graph.Builder()
                .config(new GraphConfig.Builder().graphId("id").build())
                .storeProperties(storeProperties)
                .addSchemas(StreamUtil.schemas(Constants.class))
                .build();
        graph.execute(new AddElements.Builder()
                .input(Stream
                        .generate(new ElementsSupplier(new RmatElementSupplier(Constants.RMAT_PROBABILITIES, 100L, true)))
                        .limit(1000L)::iterator)
                .build(), new User());

        // When
        final QueryTest test = new QueryTest(graph, testProperties);
        test.run();
        final List<String> lines = FileUtils.readLines(new File(metricsResultsFilename));

        // Then
        assertThat(lines.size() > 0).isTrue();
        lines.forEach(line -> {
            final String[] fields = line.split(", ");
            assertThat(fields[0].startsWith(QueryMetrics.RESULTS_PER_SECOND)).isTrue();
            assertThat(Double.parseDouble(fields[0].split(":")[1]) > 0.0D).isTrue();
            assertThat(fields[1].startsWith(QueryMetrics.SEEDS_PER_SECOND)).isTrue();
            assertThat(Double.parseDouble(fields[1].split(":")[1]) > 0.0D).isTrue();
        });
    }
}
