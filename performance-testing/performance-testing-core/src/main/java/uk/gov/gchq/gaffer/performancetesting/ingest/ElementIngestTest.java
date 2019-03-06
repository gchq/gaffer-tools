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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.performancetesting.MetricsListener;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ElementsSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * This class measures the time taken to add some elements to the provided {@link Graph}.
 *
 * <p>The test is configured using a {@link ElementIngestTestProperties}. This specifies the class to be
 * used to generate the random elements and the number of random elements.
 */
public class ElementIngestTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(ElementIngestTest.class);

    private Graph graph;
    private ElementIngestTestProperties testProperties;
    private MetricsListener metricsListener;

    public ElementIngestTest(final Graph graph,
                             final ElementIngestTestProperties testProperties) {
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
     * Runs a test of adding elements in batches.
     *
     * @return The rate at which elements were added (number of elements per second).
     */
    public double run() {
        final long numElements = testProperties.getNumElements();
        final long batchSize = testProperties.getBatchSize();
        final Supplier<Element> elementSupplier = new ElementSupplierFactory(testProperties).get();
        long totalAdded = 0L;
        long batchNumber = 0L;
        final long startTime = System.currentTimeMillis();
        while (totalAdded < numElements) {
            batchNumber++;
            addBatch(elementSupplier, batchSize, batchNumber);
            totalAdded += batchSize;
        }
        final long endTime = System.currentTimeMillis();
        final double durationInSeconds = (endTime - startTime) / 1000.0;
        final double rate = (double) numElements / durationInSeconds;
        LOGGER.info("Test result: " + numElements + " elements added in " + durationInSeconds + " seconds (rate was "
                + rate + " per second)");
        log(numElements, true);
        if (null != metricsListener) {
            metricsListener.close();
        }
        return rate;
    }

    private void addBatch(final Supplier<Element> elementSupplier, final long batchSize, final long batchNumber) {
        final Iterable<Element> elements = Stream.generate(elementSupplier).limit(batchSize)::iterator;
        final AddElements addElements = new AddElements.Builder()
                .input(elements)
                .validate(false)
                .build();
        final long startTime = System.currentTimeMillis();
        try {
            graph.execute(addElements, new User());
        } catch (final OperationException e) {
            LOGGER.error("OperationException thrown after " + (System.currentTimeMillis() - startTime) / 1000.0
                    + " seconds");
            throw new RuntimeException("Exception thrown adding elements");
        }
        final long endTime = System.currentTimeMillis();
        final double durationInSeconds = (endTime - startTime) / 1000.0;
        final double rate = batchSize / durationInSeconds;
        LOGGER.info("Batch number = " + batchNumber + ": " + batchSize + " elements added in " + durationInSeconds
                + " seconds (rate was " + rate + " per second)");
        log(rate, false);
    }

    private void log(final double elementsPerSecond, final boolean finalResult) {
        if (null != metricsListener) {
            final IngestMetrics metrics = new IngestMetrics();
            if (finalResult) {
                metrics.putMetric(IngestMetrics.ELEMENTS_PER_SECOND_OVERALL, elementsPerSecond);
            } else {
                metrics.putMetric(IngestMetrics.ELEMENTS_PER_SECOND_BATCH, elementsPerSecond);
            }
            metricsListener.update(metrics);
        }
    }

    public static class ElementSupplierFactory {
        private ElementIngestTestProperties testProperties;

        public ElementSupplierFactory(final ElementIngestTestProperties testProperties) {
            this.testProperties = testProperties;
        }

        public Supplier<Element> get() {
            final String elementSupplierClass = testProperties.getElementSupplierClass();
            if (elementSupplierClass.equals(RmatElementSupplier.class.getName())) {
                final double[] rmatProbabilities = testProperties.getRmatProbabilities();
                final long maxNodeId = testProperties.getRmatMaxNodeId();
                final boolean includeEntities = testProperties.getRmatIncludeEntities();
                return new ElementsSupplier(new RmatElementSupplier(rmatProbabilities, maxNodeId, includeEntities));
            } else {
                throw new RuntimeException("Unknown ElementSupplier class of " + elementSupplierClass);
            }
        }
    }

    public static void main(final String[] args) {
        if (args.length != 3) {
            throw new RuntimeException("Usage: <schema_directory> <store_properties_file> <test_properties_file>");
        }
        final Schema schema = Schema.fromJson(new File(args[0]).toPath());
        final StoreProperties storeProperties = StoreProperties.loadStoreProperties(args[1]);
        final ElementIngestTestProperties testProperties = new ElementIngestTestProperties();
        testProperties.loadTestProperties(args[2]);
        final Graph graph = new Graph.Builder()
                .graphId(testProperties.getGraphId())
                .storeProperties(storeProperties)
                .addSchema(schema)
                .build();
        final ElementIngestTest test = new ElementIngestTest(graph, testProperties);
        final double result = test.run();
        LOGGER.info("Test result: elements were added at a rate of " + result + " per second");
    }
}
