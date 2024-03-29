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
import uk.gov.gchq.gaffer.performancetesting.FileWriterMetricsListener;
import uk.gov.gchq.gaffer.randomelementgeneration.Constants;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestElementIngestTest {

    @TempDir
    public File folder;

    @Test
    public void testElementIngestTestRuns() {
        // Given
        final ElementIngestTestProperties testProperties = new ElementIngestTestProperties();
        testProperties.setNumElements(100L);
        testProperties.setBatchSize(10);
        testProperties.setElementSupplierClass(RmatElementSupplier.class.getName());
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

        // When
        final ElementIngestTest test = new ElementIngestTest(graph, testProperties);
        final double result = test.run();

        // Then
        assertThat(result > 0.0D).isTrue();
    }

    @Test
    public void testElementIngestTestOutputsToListener() throws IOException {
        // Given
        final ElementIngestTestProperties testProperties = new ElementIngestTestProperties();
        testProperties.setNumElements(100L);
        testProperties.setBatchSize(10);
        testProperties.setElementSupplierClass(RmatElementSupplier.class.getName());
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

        // When
        final ElementIngestTest test = new ElementIngestTest(graph, testProperties);
        test.run();
        final List<String> lines = FileUtils.readLines(new File(metricsResultsFilename));

        // Then
        assertThat(lines.size() > 0).isTrue();
        final int offsetBatch = IngestMetrics.ELEMENTS_PER_SECOND_BATCH.length() + 1;
        final int offsetOverall = IngestMetrics.ELEMENTS_PER_SECOND_OVERALL.length() + 1;
        for (int i = 0; i < lines.size() - 2; i++) {
            final String[] tokens = lines.get(i).split(",");
            assertThat(tokens[0].replaceAll(" ", "").startsWith(IngestMetrics.ELEMENTS_PER_SECOND_BATCH + ":")).isTrue();
            assertThat(nullOrPositive(tokens[0].substring(offsetBatch))).isTrue();
            assertThat(tokens[1].replaceAll(" ", "").startsWith(IngestMetrics.ELEMENTS_PER_SECOND_OVERALL + ":")).isTrue();
            assertThat(nullOrPositive(tokens[1].substring(offsetOverall))).isTrue();
        }
    }

    private boolean nullOrPositive(final String string) {
        if (string.equals(": null")) {
            return true;
        }
        return Double.parseDouble(string) > 0.0D;
    }
}
