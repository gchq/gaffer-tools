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

package uk.gov.gchq.gaffer.rest.service;

import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.rest.FederatedExecutor;
import uk.gov.gchq.gaffer.rest.dto.Schema;
import uk.gov.gchq.gaffer.store.StoreTrait;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class FederatedGraphConfigurationService implements IFederatedGraphConfigurationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedOperationService.class);

    private final FederatedExecutor executor = new FederatedExecutor(true);

    @Override
    public void addUrl(final String url) {
        LOGGER.info("Adding URL: " + url);
        executor.getProperties().getUrls().add(url);
        refresh();
    }

    @Override
    public void refresh() {
        executor.initialiseProperties();
    }

    @Override
    public Set<String> urls() {
        return executor.getProperties().getUrls();
    }

    @Override
    public Map<String, Schema> getSchema() {
        return executor.getProperties().getSchemas();
    }

    @Override
    public Set<String> getFilterFunctions() {
        return executor.getProperties().getFilterFunctions();
    }

    @Override
    public Set<String> getFilterFunctions(final String inputClass) {
        return executor.getFunctions(inputClass);
    }

    @Override
    public Set<String> getTransformFunctions() {
        return executor.getProperties().getFilterFunctions();
    }

    @Override
    public Set<String> getGenerators() {
        return executor.getProperties().getGenerators();
    }

    @Override
    public Set<String> getOperations() {
        return executor.getProperties().getOperations();
    }

    @Override
    public Set<StoreTrait> getStoreTraits() {
        return executor.getProperties().getTraits();
    }

    @Override
    public Boolean isOperationSupported(final String className) {
        return executor.getProperties().getOperations().contains(className);
    }

    @SuppressFBWarnings(value = "REC_CATCH_EXCEPTION", justification = "Need to wrap all runtime exceptions before they are given to the user")
    @Override
    public Set<String> getSerialisedFields(final String className) {
        final Class<?> clazz;
        try {
            clazz = Class.forName(className);
        } catch (Exception e) {
            throw new IllegalArgumentException("Class name was not recognised: " + className, e);
        }

        final ObjectMapper mapper = new ObjectMapper();
        final JavaType type = mapper.getTypeFactory().constructType(clazz);
        final BeanDescription introspection = mapper.getSerializationConfig().introspect(type);
        final List<BeanPropertyDefinition> properties = introspection.findProperties();

        final Set<String> fields = new HashSet<>();
        for (final BeanPropertyDefinition property : properties) {
            fields.add(property.getName());
        }

        return fields;
    }
}
