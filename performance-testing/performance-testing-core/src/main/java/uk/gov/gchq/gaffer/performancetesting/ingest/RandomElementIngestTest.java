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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.randomelementgeneration.generator.ElementGeneratorFromSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.IterableOfElementsSupplier;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.util.Collections;
import java.util.function.Supplier;

/**
 * This class measures the time taken to add some elements to the provided {@link Graph}.
 *
 * <p>The test is configured using a {@link RandomElementIngestTestProperties}. This specifies the class to be
 * used to generate the random elements and the number of random elements.
 */
public class RandomElementIngestTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(RandomElementIngestTest.class);

    private Graph graph;
    private RandomElementIngestTestProperties testProperties;

    public RandomElementIngestTest(final Graph graph,
                                   final RandomElementIngestTestProperties testProperties) {
        this.graph = graph;
        this.testProperties = testProperties;
    }

    public boolean run() {
        // Create generator
        final long numElements = testProperties.getNumElements();
        final Supplier<Element> elementSupplier = new ElementSupplierFactory(testProperties).get();
        final ElementGeneratorFromSupplier generator = new ElementGeneratorFromSupplier(numElements, elementSupplier);

        // Add elements
        final AddElements addElements = new AddElements.Builder()
                .input(generator.apply(Collections.singletonList("DUMMY")))
                .validate(false)
                .build();
        final long startTime = System.currentTimeMillis();
        try {
            graph.execute(addElements, new User());
        } catch (final OperationException e) {
            LOGGER.error("OperationException thrown after " + (System.currentTimeMillis() - startTime) / 1000.0
                    + " seconds");
            return false;
        }
        final long endTime = System.currentTimeMillis();
        final double durationInSeconds = (endTime - startTime) / 1000.0;
        final double rate = numElements / durationInSeconds;
        LOGGER.info(numElements + " elements added in " + durationInSeconds + " seconds (rate was " + rate + " per second)");
        return true;
    }


    public static class ElementSupplierFactory {
        private RandomElementIngestTestProperties testProperties;

        public ElementSupplierFactory(final RandomElementIngestTestProperties testProperties) {
            this.testProperties = testProperties;
        }

        public Supplier<Element> get() {
            final String elementSupplierClass = testProperties.getElementSupplierClass();
            if (elementSupplierClass.equals(RmatElementSupplier.class.getName())) {
                final double[] rmatProbabilities = testProperties.getRmatProbabilities();
                final long maxNodeId = testProperties.getRmatMaxNodeId();
                final boolean includeEntities = testProperties.getRmatIncludeEntities();
                return new IterableOfElementsSupplier(new RmatElementSupplier(rmatProbabilities, maxNodeId, includeEntities));
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
        final RandomElementIngestTestProperties testProperties = new RandomElementIngestTestProperties();
        testProperties.loadTestProperties(args[2]);
        final Graph graph = new Graph.Builder()
                .storeProperties(storeProperties)
                .addSchema(schema)
                .build();
        final RandomElementIngestTest test = new RandomElementIngestTest(graph, testProperties);
        final boolean result = test.run();
        LOGGER.info("Test " + (result ? "ran successfully" : "failed"));
    }
}
