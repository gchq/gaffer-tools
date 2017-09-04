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
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import uk.gov.gchq.gaffer.federated.rest.util.CloneUtil;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Based on {@link uk.gov.gchq.gaffer.operation.Operation} but without the need
 * to deserialise all operation classes. This means the jvm does not need all
 * classes from all delegate Gaffer graphs on the class path.
 */
public class Operation implements Cloneable {
    private View view;
    private Object input;
    private String clazz;

    private Map<String, String> other = new LinkedHashMap<>();

    @JsonAnyGetter
    public Map<String, String> any() {
        return other;
    }

    @JsonAnySetter
    public void set(final String name, final String value) {
        other.put(name, value);
    }

    public View getView() {
        return view;
    }

    public void setView(final View view) {
        this.view = view;
    }

    public Object getInput() {
        return input;
    }

    public void setInput(final Object input) {
        this.input = input;
    }

    public void setSeeds(final Object input) {
        this.input = input;
    }

    public void setElements(final Object input) {
        this.input = input;
    }

    @JsonGetter("class")
    public String getClazz() {
        return clazz;
    }

    @JsonSetter("class")
    public void setClazz(final String clazz) {
        this.clazz = clazz;
    }

    @SuppressWarnings("CloneDoesntCallSuperClone")
    @SuppressFBWarnings(value = "CN_IDIOM_NO_SUPER_CALL", justification = "All fields are cloned")
    public Operation clone() {
        final Operation op = new Operation();
        op.view = null != view ? view.clone() : null;
        op.input = CloneUtil.clone(input);
        op.clazz = clazz;
        op.other = CloneUtil.clone(other);

        return op;
    }

    @Override
    public String toString() {
        return "Operation{" +
                "view=" + view +
                ", input=" + input +
                ", class='" + clazz + '\'' +
                ", other=" + other +
                '}';
    }
}

