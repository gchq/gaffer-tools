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

package uk.gov.gchq.gaffer.schemabuilder.service;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang3.StringUtils;
import org.reflections.Reflections;
import org.reflections.util.ClasspathHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.function.AggregateFunction;
import uk.gov.gchq.gaffer.function.ConsumerFunction;
import uk.gov.gchq.gaffer.function.FilterFunction;
import uk.gov.gchq.gaffer.schemabuilder.constant.SystemProperty;
import uk.gov.gchq.gaffer.serialisation.Serialisation;
import uk.gov.gchq.gaffer.store.schema.Schema;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.lang.reflect.Modifier;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;


@Path("")
@Produces(MediaType.APPLICATION_JSON)
public class SchemaBuilderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SchemaBuilderService.class);

    private static final List<FilterFunction> VALIDATION_FUNCTIONS = getSubClassInstances(FilterFunction.class);
    private static final List<AggregateFunction> AGGREGATE_FUNCTIONS = getSubClassInstances(AggregateFunction.class);
    private static final List<Serialisation> SERIALISERS = getSubClassInstances(Serialisation.class);
    private static final Schema COMMON_SCHEMA = loadCommonSchema();

    private static Schema loadCommonSchema() {
        return Schema.fromJson(StreamUtil.dataTypes(SchemaBuilderService.class), StreamUtil.storeTypes(SchemaBuilderService.class));

    }

    @SuppressFBWarnings("REC_CATCH_EXCEPTION")
    @POST
    @Path("/functions")
    public FunctionsResponse getFunctions(final TypeNameClass type) {
        if (StringUtils.isNotEmpty(type.getTypeClass())) {
            final Class<?> clazz;
            try {
                clazz = Class.forName(type.getTypeClass());
            } catch (Exception e) {
                return new FunctionsResponse(type.getTypeName() + ": type class " + type.getTypeClass() + " was not recognised.");
            }

            final List<Class> serialiserClasses = new ArrayList<>();
            for (Serialisation serialisation : SERIALISERS) {
                if (serialisation.canHandle(clazz)) {
                    serialiserClasses.add(serialisation.getClass());
                }
            }

            final List<Class> validateClasses = new ArrayList<>();
            for (final ConsumerFunction function : VALIDATION_FUNCTIONS) {
                try {
                    final Class<?>[] inputs = function.getInputClasses();
                    if (inputs.length == 1 && inputs[0].isAssignableFrom(clazz)) {
                        validateClasses.add(function.getClass());
                    }
                } catch (final Exception e) {
                    // just add the function.
                    validateClasses.add(function.getClass());
                }
            }

            final List<Class> aggregateClasses = new ArrayList<>();
            for (final ConsumerFunction function : AGGREGATE_FUNCTIONS) {
                final Class<?>[] inputs = function.getInputClasses();

                if (inputs.length == 1 && inputs[0].isAssignableFrom(clazz)) {
                    aggregateClasses.add(function.getClass());
                }
            }
            return new FunctionsResponse(serialiserClasses, validateClasses, aggregateClasses);
        }
        return new FunctionsResponse(type.getTypeName() + ": type class is required.");
    }

    @GET
    @Path("/commonSchema")
    public Schema getCommonSchema() {
        return COMMON_SCHEMA;
    }

    @POST
    @Path("/validate")
    public ValidateResponse validate(final Schema[] schemas) {
        final ValidateResponse response;
        if (schemas == null || schemas.length == 0) {
            response = new ValidateResponse(false, "Schema couldn't be validated - at least 1 schema is required");
        } else {
            final Schema.Builder schemaBuilder = new Schema.Builder();
            for (Schema schema : schemas) {
                schemaBuilder.merge(schema);
            }

            if (schemaBuilder.build().validate()) {
                response = new ValidateResponse(true, "The schema is valid");
            } else {
                response = new ValidateResponse(false, "The schema is invalid");
            }
        }

        return response;
    }

    private static <T> List<T> getSubClassInstances(final Class<T> clazz) {
        final List<T> instances = new ArrayList<>();
        for (Class aClass : getSubClasses(clazz)) {
            try {
                instances.add(((Class<T>) aClass).newInstance());
            } catch (InstantiationException | IllegalAccessException e) {
                LOGGER.warn("unable to find class: " + aClass, e);
            }
        }

        return instances;
    }

    private static List<Class> getSubClasses(final Class<?> clazz) {
        final Set<URL> urls = new HashSet<>();
        for (String packagePrefix : System.getProperty(SystemProperty.PACKAGE_PREFIXES, SystemProperty.PACKAGE_PREFIXES_DEFAULT).split(",")) {
            urls.addAll(ClasspathHelper.forPackage(packagePrefix));
        }

        final List<Class> classes = new ArrayList<Class>(new Reflections(urls).getSubTypesOf(clazz));
        keepPublicConcreteClasses(classes);
        Collections.sort(classes, new Comparator<Class>() {
            @Override
            public int compare(final Class class1, final Class class2) {
                return class1.getName().compareTo(class2.getName());
            }
        });

        return classes;

    }

    private static void keepPublicConcreteClasses(final Collection<Class> classes) {
        if (null != classes) {
            final Iterator<Class> itr = classes.iterator();
            for (Class clazz = null; itr.hasNext(); clazz = itr.next()) {
                if (null != clazz) {
                    final int modifiers = clazz.getModifiers();
                    if (Modifier.isAbstract(modifiers) || Modifier.isInterface(modifiers) || Modifier.isPrivate(modifiers) || Modifier.isProtected(modifiers)) {
                        itr.remove();
                    }
                }
            }
        }
    }
}
