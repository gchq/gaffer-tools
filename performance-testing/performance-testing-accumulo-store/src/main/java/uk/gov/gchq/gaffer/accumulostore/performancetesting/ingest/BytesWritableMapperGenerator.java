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

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.BytesWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.MapContext;

import uk.gov.gchq.gaffer.commonutil.CommonConstants;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.elementdefinition.exception.SchemaException;
import uk.gov.gchq.gaffer.data.generator.ElementGenerator;
import uk.gov.gchq.gaffer.hdfs.operation.handler.job.factory.SampleDataForSplitPointsJobFactory;
import uk.gov.gchq.gaffer.hdfs.operation.mapper.generator.MapperGenerator;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.serialiser.ElementSerialiser;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class BytesWritableMapperGenerator implements MapperGenerator<NullWritable, BytesWritable> {

    private final List<BytesWritable> singleItemList = new ArrayList<>(1);
    private ElementGenerator<BytesWritable> elementGenerator;

    public BytesWritableMapperGenerator() {
    }

    public BytesWritableMapperGenerator(final BytesWritableElementGenerator elementGenerator) {
        this.elementGenerator = elementGenerator;
    }

    private void createElementGenerator(final Configuration conf) {
        final Schema schema;
        try {
            schema = Schema.fromJson(conf
                    .get(SampleDataForSplitPointsJobFactory.SCHEMA)
                    .getBytes(CommonConstants.UTF_8));
        } catch (final UnsupportedEncodingException e) {
            throw new SchemaException("Unable to deserialise Store Schema from JSON", e);
        }
        this.elementGenerator = new BytesWritableElementGenerator(new ElementSerialiser(schema));
    }

    @Override
    public Iterable<? extends Element> getElements(final NullWritable nullWritable,
                                         final BytesWritable bytesWritable,
                                         final MapContext<NullWritable, BytesWritable, ?, ?> context) {
        if (null == elementGenerator) {
            createElementGenerator(context.getConfiguration());
        }
        singleItemList.clear();
        singleItemList.add(bytesWritable);

        elementGenerator.apply(singleItemList).forEach(System.out::println);
        return elementGenerator.apply(singleItemList);
    }

    public ElementGenerator<BytesWritable> getElementGenerator() {
        return elementGenerator;
    }

    public void setElementGenerator(final ElementGenerator<BytesWritable> elementGenerator) {
        this.elementGenerator = elementGenerator;
    }
}
