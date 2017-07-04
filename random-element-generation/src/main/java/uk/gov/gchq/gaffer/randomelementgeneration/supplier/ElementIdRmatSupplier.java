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
package uk.gov.gchq.gaffer.randomelementgeneration.supplier;

import uk.gov.gchq.gaffer.data.element.id.ElementId;
import uk.gov.gchq.gaffer.operation.data.EdgeSeed;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.randomelementgeneration.Constants;

import java.util.Arrays;
import java.util.Random;
import java.util.function.Supplier;

/**
 *
 */
public class ElementIdRmatSupplier implements Supplier<ElementId> {

    protected final Random random = new Random();
    private double[] cumulativeProbs;
    private int numBits;
    private boolean includeEntities;

    public ElementIdRmatSupplier(final double[] probabilities, final long maxNodeId, final boolean includeEntities) {
        validateProbabilities(probabilities);
        setCumulativeProbs(probabilities);
        this.numBits = (int) (Math.log(maxNodeId) / Math.log(2));
        this.includeEntities = includeEntities;
    }

    public ElementIdRmatSupplier(final long maxNodeId, final boolean includeEntities) {
        this(Constants.RMAT_PROBABILITIES, maxNodeId, includeEntities);
    }

    @Override
    public ElementId get() {
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
        if (random.nextDouble() < 0.5) {
            return new EntitySeed(source);
        }
        return new EdgeSeed(source, destination, true);
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
    }

    private void setCumulativeProbs(final double[] probabilities) {
        this.cumulativeProbs = new double[4];
        this.cumulativeProbs[0] = probabilities[0];
        this.cumulativeProbs[1] = probabilities[1] + this.cumulativeProbs[0];
        this.cumulativeProbs[2] = probabilities[2] + this.cumulativeProbs[1];
        this.cumulativeProbs[3] = probabilities[3] + this.cumulativeProbs[2];
    }
}
