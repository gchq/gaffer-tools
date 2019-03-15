/*
 * Copyright 2016-2019 Crown Copyright
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
package uk.gov.gchq.gaffer.schemabuilder.service;

import java.util.Collections;
import java.util.List;

public class FunctionsResponse {
    private boolean valid = false;
    private String message;
    private List<Class> serialiserClasses = Collections.emptyList();
    private List<Class> validateClasses = Collections.emptyList();
    private List<Class> aggregateClasses = Collections.emptyList();

    public FunctionsResponse() {
    }

    public FunctionsResponse(final String message) {
        this.message = message;
    }

    public FunctionsResponse(final List<Class> serialiserClasses, final List<Class> validateClasses, final List<Class> aggregateClasses) {
        this.valid = true;
        this.serialiserClasses = serialiserClasses;
        this.validateClasses = validateClasses;
        this.aggregateClasses = aggregateClasses;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(final boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public List<Class> getSerialiserClasses() {
        return serialiserClasses;
    }

    public void setSerialiserClasses(final List<Class> serialiserClasses) {
        this.serialiserClasses = serialiserClasses;
    }

    public List<Class> getValidateClasses() {
        return validateClasses;
    }

    public void setValidateClasses(final List<Class> validateClasses) {
        this.validateClasses = validateClasses;
    }

    public List<Class> getAggregateClasses() {
        return aggregateClasses;
    }

    public void setAggregateClasses(final List<Class> aggregateClasses) {
        this.aggregateClasses = aggregateClasses;
    }
}
