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

package uk.gov.gchq.gaffer.federated.rest;

import uk.gov.gchq.gaffer.rest.factory.UnknownUserFactory;

/**
 * System property keys and default values.
 */
public abstract class SystemProperty {
    // KEYS
    public static final String SCHEMA_PATHS = "gaffer.schemas";
    public static final String STORE_PROPERTIES_PATH = "gaffer.storeProperties";
    public static final String BASE_URL = "gaffer.federated-rest.basePath";
    public static final String VERSION = "gaffer.federated-rest.version";
    public static final String GAFFER_URLS = "gaffer.federated-rest.urls";
    public static final String SERVICES_PACKAGE_PREFIX = "gaffer.federated-rest.resourcePackage";
    public static final String CONNECT_TIMEOUT = "gaffer.federated-rest.connect-timeout";
    public static final String READ_TIMEOUT = "gaffer.federated-rest.read-timeout";
    public static final String USER_FACTORY_CLASS = "gaffer.user.factory.class";

    // DEFAULTS
    public static final String SERVICES_PACKAGE_PREFIX_DEFAULT = "uk.gov.gchq.gaffer.federated.rest";
    public static final String BASE_URL_DEFAULT = "rest/v1";
    public static final String CORE_VERSION = "1.0.0";
    public static final String CONNECT_TIMEOUT_DEFAULT = "60000";
    public static final String READ_TIMEOUT_DEFAULT = "60000";
    public static final String USER_FACTORY_CLASS_DEFAULT = UnknownUserFactory.class.getName();

    // Auth roles
    public static final String FEDERATED_ADMIN_AUTH = "gaffer.federated-rest.admin-auth";

}
