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
package uk.gov.gchq.gaffer.randomdatageneration.generator;

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 *
 */
public class RandomElementGenerator extends OneToManyElementGenerator<String> {
    protected long numNodes;
    protected long numEdges;
    protected double[] cumulativeProbs;
    protected ElementSupplier elementSupplier;

    public RandomElementGenerator(final long numNodes, final long numEdges, final double[] probabilities) {
        this.numNodes = numNodes;
        this.numEdges = numEdges;
        validateProbabilities(probabilities);
        elementSupplier = new ElementSupplier(cumulativeProbs, numNodes);
    }

    @Override
    public Iterable<Element> getElements(final String domainObject) {
        return Stream.generate(elementSupplier)
                .limit(numEdges)
                .flatMap(x -> x.stream())
                ::iterator;
    }

    @Override
    public Iterable<String> getObjects(final Iterable<Element> elements) {
        throw new UnsupportedOperationException("Generation of domain objects from random data is not supported.");
    }

    private void validateProbabilities(final double[] probabilities) {
        // There should be 4 probabilities, they should all be greater than 0 and they should sum to 1.
        if (probabilities == null || probabilities.length != 4) {
            throw new IllegalArgumentException("Probabilities should be non-null and of length 4.");
        }
        final double min = Arrays.stream(probabilities).min().getAsDouble();
        if (min <= 0.0) {
            throw new IllegalArgumentException("Every entry in probabilities must be strictly positive.");
        }
        final double sum = Arrays.stream(probabilities).sum();
        if (sum < 0.999999999 || sum > 1.00000001) {
            throw new IllegalArgumentException("The entries in probabilities must sum to 1.");
        }
        this.cumulativeProbs = new double[4];
        this.cumulativeProbs[0] = probabilities[0];
        this.cumulativeProbs[1] = probabilities[1] + this.cumulativeProbs[0];
        this.cumulativeProbs[2] = probabilities[2] + this.cumulativeProbs[1];
        this.cumulativeProbs[3] = probabilities[3] + this.cumulativeProbs[2];
    }

    protected static class ElementSupplier implements Supplier<Set<Element>> {
        protected final Random random = new Random();
        private double[] cumulativeProbs;
        private int numBits;

        ElementSupplier(final double[] cumulativeProbs, final long numNodes) {
            this.cumulativeProbs = cumulativeProbs;
            this.numBits = (int) (Math.log(numNodes) / Math.log(2));
        }

        /**
         *        destination
         *         +---+---+
         *         | 0 | 1 |
         * source  +---+---+
         *         | 2 | 3 |
         *         +---+---+
         */
        @Override
        public Set<Element> get() {
            // Generate random source and destination nodes
            long source = 0L;
            long destination = 0L;
            for (int i = 0; i < numBits; i++) {
                final int quadrant = generateRandomQuadrant();
                if (quadrant == 0) {
                    // Do nothing
                } else if (quadrant == 1) {
                    destination = destination ^ (1 << i);
                } else if (quadrant == 2) {
                    source = source ^ (1 << i);
                } else {
                    source = source ^ (1 << i);
                    destination = destination ^ (1 << i);
                }
            }
            // Create edge, and source and destination entities
            final Edge edge = new Edge("edgeGroup", source, destination, true);
            edge.putProperty("count", 1L);
            final Entity sourceEntity = new Entity("entityGroup", source);
            sourceEntity.putProperty("count", 1L);
            final HyperLogLogPlus sourceHLLPP = new HyperLogLogPlus(5, 5);
            sourceHLLPP.offer(destination);
            sourceEntity.putProperty("approxDegree", sourceHLLPP);
            final Entity destinationEntity = new Entity("entityGroup", destination);
            destinationEntity.putProperty("count", 1L);
            final HyperLogLogPlus destinationHLLPP = new HyperLogLogPlus(5, 5);
            destinationHLLPP.offer(destination);
            destinationEntity.putProperty("approxDegree", destinationHLLPP);
            // Create set of results and return
            final Set<Element> results = new HashSet<>();
            results.add(edge);
            results.add(sourceEntity);
            results.add(destinationEntity);
            return results;
        }

        private int generateRandomQuadrant() {
            final double d = random.nextDouble();
            if (d < cumulativeProbs[0]) {
                return 0;
            }
            if (d < cumulativeProbs[1]) {
                return 1;
            }
            if (d < cumulativeProbs[2]) {
                return 2;
            }
            return 3;
        }
    }
}
