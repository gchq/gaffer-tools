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

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang3.StringUtils;
import org.reflections.Reflections;
import org.reflections.util.ClasspathHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.commonutil.StreamUtil;
import uk.gov.gchq.gaffer.schemabuilder.constant.SystemProperty;
import uk.gov.gchq.gaffer.serialisation.Serialiser;
import uk.gov.gchq.gaffer.serialisation.ToBytesSerialiser;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.koryphe.ValidationResult;
import uk.gov.gchq.koryphe.signature.Signature;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import java.lang.reflect.Modifier;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.function.BinaryOperator;
import java.util.function.Predicate;


@Path("")
@Produces(MediaType.APPLICATION_JSON)
public class SchemaBuilderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SchemaBuilderService.class);

    private static final List<Predicate> VALIDATION_FUNCTIONS = getSubClassInstances(Predicate.class);
    private static final List<BinaryOperator> AGGREGATE_FUNCTIONS = getSubClassInstances(BinaryOperator.class);
    private static final List<ToBytesSerialiser> SERIALISERS = getSubClassInstances(ToBytesSerialiser.class);
    private static final Schema COMMON_SCHEMA = loadCommonSchema();

    private static Schema loadCommonSchema() {
        return Schema.fromJson(StreamUtil.schemas(SchemaBuilderService.class));
    }

    @SuppressFBWarnings("REC_CATCH_EXCEPTION")
    @POST
    @Path("/functions")
    public FunctionsResponse getFunctions(final TypeNameClass type) {
        if (StringUtils.isNotEmpty(type.getTypeClass())) {
            final Class<?> clazz;
            try {
                clazz = Class.forName(type.getTypeClass());
            } catch (final Exception e) {
                return new FunctionsResponse(type.getTypeName() + ": type class " + type.getTypeClass() + " was not recognised.");
            }

            final List<Class> serialiserClasses = new ArrayList<>();
            for (final Serialiser serialise : SERIALISERS) {
                if (serialise.canHandle(clazz)) {
                    serialiserClasses.add(serialise.getClass());
                }
            }

            final List<Class> validateClasses = new ArrayList<>();
            for (final Predicate function : VALIDATION_FUNCTIONS) {
                try {
                    final Signature signature = Signature.getInputSignature(function);
                    if (signature.assignable(clazz).isValid()) {
                        validateClasses.add(function.getClass());
                    }
                } catch (final Exception e) {
                    // just add the function.
                    validateClasses.add(function.getClass());
                }
            }

            final List<Class> aggregateClasses = new ArrayList<>();
            for (final BinaryOperator function : AGGREGATE_FUNCTIONS) {
                final Signature signature = Signature.getInputSignature(function);
                if (signature.assignable(clazz).isValid()) {
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
    public ValidationResult validate(final Schema[] schemas) {
        final ValidationResult response;
        if (schemas == null || schemas.length == 0) {
            response = new ValidationResult();
            response.addError("Schema couldn't be validated - at least 1 schema is required");
        } else {
            final Schema.Builder schemaBuilder = new Schema.Builder();
            for (final Schema schema : schemas) {
                schemaBuilder.merge(schema);
            }

            response = schemaBuilder.build().validate();
        }

        return response;
    }

    private static <T> List<T> getSubClassInstances(final Class<T> clazz) {
        final List<T> instances = new ArrayList<>();
        for (final Class aClass : getSubClasses(clazz)) {
            try {
                instances.add(((Class<T>) aClass).newInstance());
            } catch (final InstantiationException | IllegalAccessException e) {
                LOGGER.debug("unable to find class: " + aClass, e);
            }
        }

        return instances;
    }

    private static List<Class> getSubClasses(final Class<?> clazz) {
        final Set<URL> urls = new HashSet<>();
        for (final String packagePrefix : System.getProperty(SystemProperty.PACKAGE_PREFIXES, SystemProperty.PACKAGE_PREFIXES_DEFAULT).split(",")) {
            urls.addAll(ClasspathHelper.forPackage(packagePrefix));
        }

        final List<Class> classes = new ArrayList<Class>(new Reflections(urls).getSubTypesOf(clazz));
        keepPublicConcreteClasses(classes);
        classes.sort(Comparator.comparing(Class::getName));

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
