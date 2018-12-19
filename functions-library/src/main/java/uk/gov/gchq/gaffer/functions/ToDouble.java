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

package uk.gov.gchq.gaffer.functions;

import uk.gov.gchq.koryphe.function.KorypheFunction;

public class ToDouble extends KorypheFunction<Object, Double> {

    @Override
    public Double apply(Object o) {

        if (null == o) {
            return null;
        }

        if (o instanceof Number) {
            return ((Number) o).doubleValue();
        }

        if (o instanceof String) {
            return Double.valueOf(((String) o));
        }

        throw new IllegalArgumentException("Could not convert value to Double: " + o);
    }
}
