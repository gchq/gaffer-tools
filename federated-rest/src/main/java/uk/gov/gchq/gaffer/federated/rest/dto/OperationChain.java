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

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Based on {@link uk.gov.gchq.gaffer.operation.OperationChain} but without the need
 * to deserialise all operation classes. This means the jvm does not need all
 * classes from all delegate Gaffer graphs on the class path.
 */
public class OperationChain implements Cloneable {
    private List<Operation> operations = new ArrayList<>();
    private Map<String, String> other = new LinkedHashMap<>();

    public OperationChain() {
    }

    public OperationChain(final Operation operation) {
        operations.add(operation);
    }

    @JsonAnyGetter
    public Map<String, String> any() {
        return other;
    }

    @JsonAnySetter
    public void set(final String name, final String value) {
        other.put(name, value);
    }

    public List<Operation> getOperations() {
        return operations;
    }

    public void setOperations(final List<Operation> operations) {
        this.operations = operations;
    }

    @SuppressWarnings("CloneDoesntCallSuperClone")
    @SuppressFBWarnings(value = "CN_IDIOM_NO_SUPER_CALL", justification = "All fields are cloned")
    public OperationChain clone() {
        final OperationChain opChain = new OperationChain();
        for (final Operation operation : operations) {
            opChain.operations.add(operation.clone());
        }

        opChain.other = CloneUtil.clone(other);
        return opChain;
    }
}

