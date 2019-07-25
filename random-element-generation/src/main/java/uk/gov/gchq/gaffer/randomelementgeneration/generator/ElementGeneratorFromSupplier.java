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
package uk.gov.gchq.gaffer.randomelementgeneration.generator;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;

import java.util.function.Supplier;
import java.util.stream.Stream;

/**
 * Given a {@link Supplier} of {@link Element}s, this class generates an {@link Iterable} of {@link Element}s, limited
 * in size to the specified maximum number.
 */
public class ElementGeneratorFromSupplier implements OneToManyElementGenerator<String> {
    protected long maximumNumberOfElements;
    protected Supplier<Element> elementSupplier;

    public ElementGeneratorFromSupplier(final long maximumNumberOfElements,
                                        final Supplier<Element> elementSupplier) {
        this.maximumNumberOfElements = maximumNumberOfElements;
        this.elementSupplier = elementSupplier;
    }

    @Override
    public Iterable<Element> _apply(final String domainObject) {
        return Stream.generate(elementSupplier)
                .limit(maximumNumberOfElements)
                ::iterator;
    }
}
