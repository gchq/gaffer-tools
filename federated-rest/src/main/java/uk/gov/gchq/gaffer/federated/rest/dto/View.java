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

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * Based on {@link uk.gov.gchq.gaffer.data.elementdefinition.view.View} but without the need
 * to deserialise all function classes. This means the jvm does not need all
 * classes from all delegate Gaffer graphs on the class path.
 */
public class View implements Cloneable {
    private Map<String, Map> entities = new LinkedHashMap<>();
    private Map<String, Map> edges = new LinkedHashMap<>();

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

    @SuppressWarnings("CloneDoesntCallSuperClone")
    @SuppressFBWarnings(value = "CN_IDIOM_NO_SUPER_CALL", justification = "All fields are cloned")
    public View clone() {
        final View view = new View();
        view.entities = CloneUtil.clone(entities);
        view.edges = CloneUtil.clone(edges);
        view.other = CloneUtil.clone(other);

        return view;
    }

    public void removeInvalidGroups(final Schema schema) {
        if (hasGroups()) {
            final Set<String> invalidEntities = new HashSet<>(entities.keySet());
            final Set<String> invalidEdges = new HashSet<>(edges.keySet());
            invalidEntities.removeAll(schema.getEntities().keySet());
            invalidEdges.removeAll(schema.getEdges().keySet());

            for (final String unknownEntity : invalidEntities) {
                entities.remove(unknownEntity);
            }

            for (final String unknownEdge : invalidEdges) {
                edges.remove(unknownEdge);
            }
        }
    }

    public boolean hasGroups() {
        return !edges.isEmpty() || !entities.isEmpty();
    }
}

