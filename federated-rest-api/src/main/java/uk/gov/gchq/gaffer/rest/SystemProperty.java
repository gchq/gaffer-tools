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

package uk.gov.gchq.gaffer.rest;

/**
 * System property keys and default values.
 */
public abstract class SystemProperty {
    // KEYS
    public static final String BASE_URL = "gaffer.rest-api.basePath";
    public static final String VERSION = "gaffer.rest-api.version";
    public static final String GAFFER_URLS = "gaffer.federated-rest-api.urls";
    public static final String CONNECT_TIMEOUT = "gaffer.federated-rest-api.connect-timeout";
    public static final String READ_TIMEOUT = "gaffer.federated-rest-api.read-timeout";

    // DEFAULTS
    /**
     * Comma separated list of package prefixes to search for {@link uk.gov.gchq.gaffer.function.Function}s and {@link uk.gov.gchq.gaffer.operation.Operation}s.
     */
    public static final String BASE_URL_DEFAULT = "rest/v1";
    public static final String CORE_VERSION = "1.0.0";
    public static final String CONNECT_TIMEOUT_DEFAULT = "60000";
    public static final String READ_TIMEOUT_DEFAULT = "60000";

}
