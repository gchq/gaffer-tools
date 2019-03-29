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

package uk.gov.gchq.gaffer.schemabuilder.constant;

/**
 * System property keys and default values.
 */
public abstract class SystemProperty {
    // KEYS
    public static final String PACKAGE_PREFIXES = "gaffer.package.prefixes";

    // DEFAULTS
    /**
     * Comma separated list of package prefixes to search for functions and serialisers.
     */
    public static final String PACKAGE_PREFIXES_DEFAULT = "uk.gov.gchq";
}
