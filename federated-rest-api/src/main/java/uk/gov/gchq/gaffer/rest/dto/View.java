/*
 * Copyright 2016 Crown Copyright
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

package uk.gov.gchq.gaffer.rest.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import java.util.LinkedHashMap;
import java.util.Map;

public class View {
    private Map<String, Map> entities = new LinkedHashMap<>();
    private Map<String, Map> edges = new LinkedHashMap<>();

    private Map<String, String> other = new LinkedHashMap<>();

    @JsonAnyGetter
    public Map<String, String> any() {
        return other;
    }

    @JsonAnySetter
    public void set(String name, String value) {
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

    public View clone() {
        final View op = new View();
        op.entities = new LinkedHashMap<>(entities);
        op.edges = new LinkedHashMap<>(edges);
        op.other.putAll(other);

        return op;
    }
}

