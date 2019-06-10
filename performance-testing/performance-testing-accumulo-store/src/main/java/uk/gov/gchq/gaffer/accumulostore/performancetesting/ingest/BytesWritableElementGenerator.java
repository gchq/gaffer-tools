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
package uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest;

import org.apache.hadoop.io.BytesWritable;

import uk.gov.gchq.gaffer.commonutil.iterable.WrappedCloseableIterable;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.generator.ElementGenerator;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.serialisation.ToBytesSerialiser;

import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class BytesWritableElementGenerator implements ElementGenerator<BytesWritable> {

    private ToBytesSerialiser<Element> elementSerialisation;

    public BytesWritableElementGenerator(final ToBytesSerialiser<Element> elementSerialisation) {
        this.elementSerialisation = elementSerialisation;
    }

    @Override
    public Iterable<? extends Element> apply(final Iterable<? extends BytesWritable> domainObjects) {
        final Stream<Element> elementStream = StreamSupport
                .stream(domainObjects.spliterator(), false)
                .map(bw -> {
                    try {
                        return elementSerialisation.deserialise(bw.getBytes());
                    } catch (final SerialisationException e) {
                        throw new RuntimeException("SerialisationException getting elements from BytesWritable", e);
                    }
                });
        final Iterable<Element> elementIterable = elementStream::iterator;
        return new WrappedCloseableIterable<>(elementIterable::iterator);
    }
}
