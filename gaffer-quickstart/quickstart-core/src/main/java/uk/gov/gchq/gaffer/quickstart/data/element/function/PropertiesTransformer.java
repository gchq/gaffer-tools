/*
 * Copyright 2016-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.quickstart.data.element.function;

import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.data.element.function.PropertiesTuple;
import uk.gov.gchq.koryphe.impl.function.Identity;
import uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction;
import uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite;

import java.io.Serializable;
import java.util.function.Function;

/**
 * An {@code PropertiesTransformer} is a {@link Function} which applies a series of
 * transformations to an {@link Properties} object.
 */
public class PropertiesTransformer extends TupleAdaptedFunctionComposite<String> implements Serializable {


    public Properties apply(final Properties properties) {
        PropertiesTuple propsTuple = new PropertiesTuple();
        propsTuple.setProperties(properties);
        apply(propsTuple);
        return properties;
    }

    public static class Builder {
        private final PropertiesTransformer transformer;

        public Builder() {
            this(new PropertiesTransformer());
        }

        private Builder(final PropertiesTransformer transformer) {
            this.transformer = transformer;
        }

        public PropertiesTransformer.SelectedBuilder select(final String... selection) {
            final TupleAdaptedFunction<String, Object, Object> current = new TupleAdaptedFunction<>();
            current.setSelection(selection);
            return new PropertiesTransformer.SelectedBuilder(transformer, current);
        }

        public PropertiesTransformer.ExecutedBuilder execute(final Function function) {
            final TupleAdaptedFunction<String, Object, Object> current = new TupleAdaptedFunction<>();
            current.setSelection(new String[0]);
            current.setFunction(function);
            return new PropertiesTransformer.ExecutedBuilder(transformer, current);
        }

        public PropertiesTransformer build() {
            return transformer;
        }
    }

    public static final class SelectedBuilder {
        private final PropertiesTransformer transformer;
        private final TupleAdaptedFunction<String, Object, Object> current;

        private SelectedBuilder(final PropertiesTransformer transformer, final TupleAdaptedFunction<String, Object, Object> current) {
            this.transformer = transformer;
            this.current = current;
        }

        public PropertiesTransformer.ExecutedBuilder execute(final Function function) {
            current.setFunction(function);
            return new PropertiesTransformer.ExecutedBuilder(transformer, current);
        }

        public PropertiesTransformer.Builder project(final String... projection) {
            current.setFunction(new Identity());
            current.setProjection(projection);
            transformer.getComponents().add(current);
            return new PropertiesTransformer.Builder(transformer);
        }
    }

    public static final class ExecutedBuilder {
        private final PropertiesTransformer transformer;
        private final TupleAdaptedFunction<String, Object, Object> current;

        private ExecutedBuilder(final PropertiesTransformer transformer, final TupleAdaptedFunction<String, Object, Object> current) {
            this.transformer = transformer;
            this.current = current;
        }

        public PropertiesTransformer.SelectedBuilder select(final String... selection) {
            current.setProjection(current.getSelection().clone());
            transformer.getComponents().add(current);
            final TupleAdaptedFunction<String, Object, Object> newCurrent = new TupleAdaptedFunction<>();
            newCurrent.setSelection(selection);
            return new PropertiesTransformer.SelectedBuilder(transformer, newCurrent);
        }

        public PropertiesTransformer.Builder project(final String... projection) {
            current.setProjection(projection);
            transformer.getComponents().add(current);
            return new PropertiesTransformer.Builder(transformer);
        }

        public PropertiesTransformer build() {
            current.setProjection(current.getSelection().clone());
            return transformer;
        }
    }
}
