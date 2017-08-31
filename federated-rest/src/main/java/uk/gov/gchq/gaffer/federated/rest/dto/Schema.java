/*
 * Copyright 2016-2017 Crown Copyright
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

package uk.gov.gchq.gaffer.federated.rest.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import uk.gov.gchq.gaffer.federated.rest.util.CloneUtil;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * Based on {@link uk.gov.gchq.gaffer.store.schema.Schema} but without the need
 * to deserialise all function classes. This means the jvm does not need all
 * classes from all delegate Gaffer graphs on the class path.
 */
public class Schema implements Cloneable {
    private Map<String, Map> entities = new LinkedHashMap<>();
    private Map<String, Map> edges = new LinkedHashMap<>();
    private Map<String, Map> types = new LinkedHashMap<>();

    private Map<String, String> other = new LinkedHashMap<>();

    @JsonAnyGetter
    public Map<String, String> any() {
        return other;
    }

    @JsonAnySetter
    public void set(final String name, final String value) {
        other.put(name, value);
    }

    public Map<String, Map> getEntities() {
        return entities;
    }

    public void setEntities(final Map<String, Map> entities) {
        this.entities = entities;
    }

    public Map<String, Map> getEdges() {
        return edges;
    }

    public void setEdges(final Map<String, Map> edges) {
        this.edges = edges;
    }

    public Map<String, Map> getTypes() {
        return types;
    }

    public void setTypes(final Map<String, Map> types) {
        this.types = types;
    }

    @SuppressWarnings("CloneDoesntCallSuperClone")
    @SuppressFBWarnings(value = "CN_IDIOM_NO_SUPER_CALL", justification = "All fields are cloned")
    public Schema clone() {
        final Schema schema = new Schema();
        schema.entities = CloneUtil.clone(entities);
        schema.edges = CloneUtil.clone(edges);
        schema.types = CloneUtil.clone(types);
        schema.other = CloneUtil.clone(other);

        return schema;
    }

    /**
     * Performs a rough merge - this may differ slightly to how Gaffer actually
     * merges schemas.
     *
     * @param schema the schema to merge into this schema
     */
    public void merge(final Schema schema) {
        if (null != schema) {
            mergeMaps(entities, schema.entities);
            mergeMaps(edges, schema.edges);
            mergeMaps(types, schema.types);
            mergeMaps(other, schema.other);
        }
    }

    private void mergeMaps(final Map map1, final Map map2) {
        mergeMapObjects(map1, map2);
    }

    private void mergeMapObjects(final Map<Object, Object> map1, final Map<Object, Object> map2) {
        for (final Map.Entry<Object, Object> entry : map2.entrySet()) {
            final Object map1Value = map1.get(entry.getKey());
            final Object map2Value = entry.getValue();
            if (null == map1Value) {
                map1.put(entry.getKey(), map2Value);
            } else if (null != map2Value) {
                if (map1Value instanceof Map && map2Value instanceof Map) {
                    mergeMaps((Map) map1Value, (Map) map2Value);
                } else if (map1Value instanceof Object[] && map2Value instanceof Object[]) {
                    final Set<Object> mergedValue = new LinkedHashSet<>();
                    Collections.addAll(mergedValue, ((Object[]) map1Value));
                    Collections.addAll(mergedValue, ((Object[]) map2Value));
                    map1.put(entry.getKey(), mergedValue.toArray(new Object[mergedValue.size()]));
                } else {
                    // Override value
                    map1.put(entry.getKey(), map2Value);
                }
            }
        }
    }
}

