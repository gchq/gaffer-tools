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
package uk.gov.gchq.gaffer.randomelementgeneration.generator;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.randomelementgeneration.PreferentialAttachmentCache;

import java.util.Collections;
import java.util.Set;

/**
 *
 */
public class RandomElementGeneratorWithRepeats extends RandomElementGenerator {
    private double repeatProb;

    public RandomElementGeneratorWithRepeats(final long numNodes,
                                             final long numEdges,
                                             final double[] probabilities,
                                             final double repeatProb) {
        super(numNodes, numEdges, probabilities);
        if (repeatProb < 0.0 || repeatProb > 1.0) {
            throw new IllegalArgumentException("Repeat probability must be between 0 and 1");
        }
        this.repeatProb = repeatProb;
        this.elementSupplier = new ElementSupplierWithRepeats(probabilities, this.numNodes, this.repeatProb);
    }

    private static class ElementSupplierWithRepeats extends ElementSupplier {
        private double repeatProb;
        private PreferentialAttachmentCache<Element> cache = new PreferentialAttachmentCache<>(10000);

        ElementSupplierWithRepeats(final double[] cumulativeProbs, final long numNodes, final double repeatProb) {
            super(cumulativeProbs, numNodes);
            this.repeatProb = repeatProb;
        }

        @Override
        public Set<Element> get() {
            double prob = random.nextDouble();
            if (prob < repeatProb) {
                final Element element = cache.get();
                return element == null ? Collections.emptySet() : Collections.singleton(element);
            } else {
                final Set<Element> results = super.get();
                for (final Element element : results) {
                    if (element instanceof Edge) {
                        Edge clone = ((Edge) element).emptyClone();
                        clone.copyProperties(element.getProperties());
                        cache.add(clone);
                    }
                }
                return results;
            }
        }
    }
}
