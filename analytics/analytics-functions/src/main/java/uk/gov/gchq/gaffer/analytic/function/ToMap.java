/*
 * Copyright 2019-2020 Crown Copyright
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
package uk.gov.gchq.gaffer.analytic.function;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import uk.gov.gchq.koryphe.function.KorypheFunction;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Function which generates a Map from an object. It uses keys provided by the
 * user and applies functions to the input object to extract the appropriate
 * value
 */
public class ToMap extends KorypheFunction<Object, Map<String, Object>> {

    private Map<String, ? extends Function> keyFunctions;

    public ToMap() {
        // Required for serialisation
    }

    public ToMap(final Map<String, ? extends Function> keyFunctions) {
        this.keyFunctions = keyFunctions;
    }

    @Override
    public Map<String, Object> apply(final Object o) {
        if (o == null || keyFunctions == null) {
            return null;
        }

        Map<String, Object> generatedMap = new HashMap<>();

        for (final Map.Entry<String, ? extends Function> keyFunction : keyFunctions.entrySet()) {
            generatedMap.put(keyFunction.getKey(), keyFunction.getValue().apply(o));
        }

        return generatedMap;
    }

    public Map<String, ? extends Function> getKeyFunctions() {
        return keyFunctions;
    }


    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "class")
    public void setKeyFunctions(final Map<String, ? extends Function> keyFunctions) {
        this.keyFunctions = keyFunctions;
    }
}
