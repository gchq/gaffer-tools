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

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ElementSupplier;

import java.util.stream.Stream;

/**
 *
 */
public class RandomElementGenerator extends OneToManyElementGenerator<String> {
    protected long numElements;
    protected ElementSupplier elementSupplier;

    public RandomElementGenerator(final long numElements,
                                  final ElementSupplier elementSupplier) {
        this.numElements = numElements;
        this.elementSupplier = elementSupplier;
    }

    @Override
    public Iterable<Element> getElements(final String domainObject) {
        return Stream.generate(elementSupplier)
                .flatMap(x -> x.stream())
                .limit(numElements)
                ::iterator;
    }

    @Override
    public Iterable<String> getObjects(final Iterable<Element> elements) {
        throw new UnsupportedOperationException("Generation of domain objects from random data is not supported.");
    }
}
