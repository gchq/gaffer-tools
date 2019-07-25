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
package uk.gov.gchq.gaffer.randomelementgeneration.supplier;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.randomelementgeneration.cache.Cache;

import java.util.Iterator;
import java.util.Random;
import java.util.Set;
import java.util.function.Supplier;

/**
 * This class extends {@link ElementsSupplier} by maintaining a cache of some of the {@link Element}s
 * that have previously been output, and with a certain probability, reoutputting an {@link Element} that has
 * previously been output.
 */
public class ElementsSupplierWithRepeats extends ElementsSupplier {
    private Iterator<Element> elementIterator;

    public ElementsSupplierWithRepeats(final Supplier<Set<Element>> elementSupplier,
                                       final double repeatProb,
                                       final Cache<Element> cache) {
        super(elementSupplier);
        this.elementIterator = new ElementIteratorWithRepeats(new ElementIterator(elementSupplier), repeatProb, cache);
    }

    @Override
    public Element get() {
        if (elementIterator.hasNext()) {
            return elementIterator.next();
        }
        return null;
    }

    protected static class ElementIteratorWithRepeats implements Iterator<Element> {
        private final Random random = new Random();
        private Iterator<Element> elementIterator;
        private double repeatProb;
        private Cache<Element> cache;

        ElementIteratorWithRepeats(final Iterator<Element> elementIterator,
                                   final double repeatProb,
                                   final Cache<Element> cache) {
            this.elementIterator = elementIterator;
            this.repeatProb = repeatProb;
            this.cache = cache;
        }

        @Override
        public boolean hasNext() {
            return elementIterator.hasNext();
        }

        @Override
        public Element next() {
            final double prob = random.nextDouble();
            if (prob < repeatProb) {
                final Element element = cache.get();
                return element == null ? elementIterator.next() : element;
            }
            final Element element = elementIterator.next();
            final Element clonedElement = element.emptyClone();
            clonedElement.copyProperties(element.getProperties());
            cache.add(clonedElement);
            return element;
        }
    }
}
