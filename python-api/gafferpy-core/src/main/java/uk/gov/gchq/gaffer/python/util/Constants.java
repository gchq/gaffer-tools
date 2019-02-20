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

package uk.gov.gchq.gaffer.python.util;

public enum  Constants {

    JSON("json"),

    VERTEX("vertex"),
    SOURCE("source"),
    DESTINATION("destination"),
    DIRECTED ("directed"),
    GROUP ("group"),
    PROPERTIES ("properties"),
    IDENTIFIER ("identifier"),
    MATCHED_VERTEX ("matched_vertex"),
    TYPE ("type"),
    EDGE ("edge"),
    ENTITY ("entity"),
    EDGE_SEED("edge_seed"),
    ENTITY_SEED("entity_seed"),

    SERIALISATION_DECLARATIONS_PROPERTY_NAME("pythonserialiser.declarations"),

    TIMEBUCKET_KEY_NAME("timebucket"),
    TIMESTAMPS_KEY_NAME ("timestamps");

    private final String constantValue;

    public String getValue() {
        return constantValue;
    }

    Constants(final String constantValue) {
        this.constantValue = constantValue;
    }
}
