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

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.randomelementgeneration.cache.PreferentialAttachmentCache;

import java.util.Collections;
import java.util.Random;
import java.util.Set;

/**
 *
 */
public class ElementSupplierWithRepeats implements ElementSupplier {
    protected final Random random = new Random();
    private double repeatProb;
    private ElementSupplier elementSupplier;
    private PreferentialAttachmentCache<Element> cache = new PreferentialAttachmentCache<>(10000);

    public ElementSupplierWithRepeats(final long numNodes,
                               final ElementSupplier elementSupplier,
                               final double repeatProb) {
        this.elementSupplier = elementSupplier;
        this.repeatProb = repeatProb;
    }

    @Override
    public Set<Element> get() {
        double prob = random.nextDouble();
        if (prob < repeatProb) {
            final Element element = cache.get();
            return element == null ? Collections.emptySet() : Collections.singleton(element);
        } else {
            final Set<Element> results = elementSupplier.get();
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
