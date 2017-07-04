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
package uk.gov.gchq.gaffer.performancetesting.query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.id.ElementId;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import uk.gov.gchq.gaffer.performancetesting.MetricsListener;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ElementIdRmatSupplier;
import uk.gov.gchq.gaffer.user.User;

import java.util.function.Supplier;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * This class measures the time taken to query for a given number of {@link ElementId}s.
 *
 * <p>The test is configured using a {@link QueryTestProperties}. This specifies the class to be
 * used to generate the random seeds and the number of seeds to be queried for.
 */
public class QueryTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(QueryTest.class);

    private Graph graph;
    private QueryTestProperties testProperties;
    private MetricsListener metricsListener;

    public QueryTest(final Graph graph,
                     final QueryTestProperties testProperties) {
        this.graph = graph;
        this.testProperties = testProperties;
        if (null != testProperties.getMetricsListenerClass()) {
            try {
                metricsListener = Class.forName(testProperties.getMetricsListenerClass())
                        .asSubclass(MetricsListener.class).newInstance();
                metricsListener.initialise(testProperties);
                LOGGER.info("Initialised MetricsListener of {}", metricsListener);
            } catch (final ClassNotFoundException | InstantiationException | IllegalAccessException e) {
                throw new IllegalArgumentException("MetricsListener could not be created: "
                        + testProperties.getMetricsListenerClass(), e);
            }
        }
    }

    /**
     * Runs a test of querying for the seeds in batches.
     *
     * @return The rate at which seeds were queried for (number of seeds per second).
     */
    public double run() {
        final long numSeeds = testProperties.getNumSeeds();
        final long batchSize = testProperties.getBatchSize();
        final Supplier<ElementId> elementIdSupplier = new ElementIdSupplierFactory(testProperties).get();
        long totalQueried = 0L;
        long batchNumber = 0L;
        final long startTime = System.currentTimeMillis();
        while (totalQueried < numSeeds) {
            batchNumber++;
            queryBatch(elementIdSupplier, batchSize, batchNumber);
            totalQueried += batchSize;
        }
        final long endTime = System.currentTimeMillis();
        final double durationInSeconds = (endTime - startTime) / 1000.0;
        final double rate = (double) totalQueried / durationInSeconds;
        LOGGER.info("Test result: " + totalQueried + " ids queried for in " + durationInSeconds + " seconds (rate was "
                + rate + " per second)");
        if (null != metricsListener) {
            metricsListener.close();
        }
        return rate;
    }

    private void queryBatch(final Supplier<ElementId> elementIdSupplier, final long batchSize, final long batchNumber) {
        final Iterable<ElementId> seeds = Stream.generate(elementIdSupplier).limit(batchSize)::iterator;
        final GetElements getElements = new GetElements.Builder()
                .input(seeds)
                .build();
        final long startTime = System.currentTimeMillis();
        final long numResults;
        try {
            final CloseableIterable<? extends Element> results = graph.execute(getElements, new User());
            numResults = StreamSupport.stream(results.spliterator(), false).count();
        } catch (final OperationException e) {
            LOGGER.error("OperationException thrown after " + (System.currentTimeMillis() - startTime) / 1000.0
                    + " seconds");
            throw new RuntimeException("Exception thrown getting elements");
        }
        final long endTime = System.currentTimeMillis();
        final double durationInSeconds = (endTime - startTime) / 1000.0;
        final double seedRate = batchSize / durationInSeconds;
        final double resultsRate = numResults / durationInSeconds;
        LOGGER.info("Batch number = " + batchNumber + ": " + batchSize + " ids queried for in " + durationInSeconds
                + " seconds (rate was " + seedRate + " per second), " + numResults + " results were returned "
                + "(rate was " + resultsRate + " per second)");
        log(seedRate, resultsRate);
    }

    private void log(final double seedsPerSecond, final double resultsPerSecond) {
        if (null != metricsListener) {
            final QueryMetrics metrics = new QueryMetrics(seedsPerSecond, resultsPerSecond);
            metricsListener.update(metrics);
        }
    }

    public static class ElementIdSupplierFactory {
        private QueryTestProperties testProperties;

        public ElementIdSupplierFactory(final QueryTestProperties testProperties) {
            this.testProperties = testProperties;
        }

        public Supplier<ElementId> get() {
            final String elementIdSupplierClass = testProperties.getElementIdSupplierClass();
            if (elementIdSupplierClass.equals(ElementIdRmatSupplier.class.getName())) {
                final double[] rmatProbabilities = testProperties.getRmatProbabilities();
                final long maxNodeId = testProperties.getRmatMaxNodeId();
                final boolean includeEntities = testProperties.getRmatIncludeEntities();
                return new ElementIdRmatSupplier(rmatProbabilities, maxNodeId, includeEntities);
            } else {
                throw new RuntimeException("Unknown ElementIdSupplier class of " + elementIdSupplierClass);
            }
        }
    }

//    public static void main(final String[] args) {
//        if (args.length != 3) {
//            throw new RuntimeException("Usage: <schema_directory> <store_properties_file> <test_properties_file>");
//        }
//        final Schema schema = Schema.fromJson(new File(args[0]).toPath());
//        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(args[1]);
//        final ElementIngestTestProperties testProperties = new ElementIngestTestProperties();
//        testProperties.loadTestProperties(args[2]);
//        final Graph graph = new Graph.Builder()
//                .storeProperties(storeProperties)
//                .addSchema(schema)
//                .build();
//        final QueryTest test = new QueryTest(graph, testProperties);
//        final double result = test.run();
//        LOGGER.info("Test result: elements were added at a rate of " + result + " per second");
//    }
}
