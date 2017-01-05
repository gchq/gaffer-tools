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
package uk.gov.gchq.gaffer.schemabuilder.application;

import uk.gov.gchq.gaffer.schemabuilder.serialisation.RestJsonProvider;
import uk.gov.gchq.gaffer.schemabuilder.service.SchemaBuilderService;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("v1")
public class ApplicationConfig extends Application {
    protected final Set<Object> singletons = new HashSet<>();
    protected final Set<Class<?>> resources = new HashSet<>();

    public ApplicationConfig() {
        resources.add(SchemaBuilderService.class);
        resources.add(RestJsonProvider.class);
    }

    @Override
    public Set<Class<?>> getClasses() {
        return resources;
    }

    @Override
    public Set<Object> getSingletons() {
        return singletons;
    }
}
