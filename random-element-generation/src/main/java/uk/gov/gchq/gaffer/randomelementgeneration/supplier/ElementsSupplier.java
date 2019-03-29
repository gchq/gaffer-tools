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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.function.Supplier;

/**
 * This class is a {@link Supplier} of {@link Element}s. It is formed from a {@link Supplier} of {@link Set}s of
 * {@link Element}s by repeatedly calling that {@link Supplier}'s <code>get()</code> method.
 */
public class ElementsSupplier implements Supplier<Element> {
    private Iterator<Element> elementIterator;

    public ElementsSupplier(final Supplier<Set<Element>> elementSupplier) {
        this.elementIterator = new ElementIterator(elementSupplier);
    }

    @Override
    public Element get() {
        if (elementIterator.hasNext()) {
            return elementIterator.next();
        }
        return null;
    }

    protected static class ElementIterator implements Iterator<Element> {
        private Supplier<Set<Element>> elementSupplier;
        private List<Element> cache;

        ElementIterator(final Supplier<Set<Element>> elementSupplier) {
            this.elementSupplier = elementSupplier;
            this.cache = new ArrayList<>();
        }

        @Override
        public boolean hasNext() {
            if (cache.isEmpty()) {
                final Set<Element> fromSupplier = elementSupplier.get();
                if (null == fromSupplier || 0 == fromSupplier.size()) {
                    return false;
                }
                cache.addAll(fromSupplier);
            }
            return true;
        }

        @Override
        public Element next() {
            if (!hasNext()) {
                throw new NoSuchElementException("Supplier is exhausted");
            }
            final Element elementToReturn = cache.get(0);
            cache.remove(0);
            return elementToReturn;
        }
    }
}
