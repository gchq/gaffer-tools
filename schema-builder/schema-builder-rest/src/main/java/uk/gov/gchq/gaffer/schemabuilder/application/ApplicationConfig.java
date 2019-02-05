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
package uk.gov.gchq.gaffer.schemabuilder.application;

import org.glassfish.jersey.server.ResourceConfig;

import uk.gov.gchq.gaffer.schemabuilder.serialisation.RestJsonProvider;
import uk.gov.gchq.gaffer.schemabuilder.service.SchemaBuilderService;

import java.util.HashSet;
import java.util.Set;

public class ApplicationConfig extends ResourceConfig {
    protected final Set<Class<?>> resources = new HashSet<>();

    public ApplicationConfig() {
        addSystemResources();
        addServices();
        registerClasses(resources);
    }

    protected void addServices() {
        resources.add(SchemaBuilderService.class);
    }

    protected void addSystemResources() {
        resources.add(RestJsonProvider.class);
    }
}
