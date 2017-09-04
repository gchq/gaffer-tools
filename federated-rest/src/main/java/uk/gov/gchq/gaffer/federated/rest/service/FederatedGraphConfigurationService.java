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

package uk.gov.gchq.gaffer.federated.rest.service;

import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.BeanPropertyDefinition;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.commonutil.exception.UnauthorisedException;
import uk.gov.gchq.gaffer.federated.rest.FederatedConfig;
import uk.gov.gchq.gaffer.federated.rest.FederatedExecutor;
import uk.gov.gchq.gaffer.federated.rest.auth.FederatedConfigAuthoriser;
import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import uk.gov.gchq.gaffer.federated.rest.dto.GafferUrl;
import uk.gov.gchq.gaffer.federated.rest.dto.Schema;
import uk.gov.gchq.gaffer.rest.factory.UserFactory;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.user.User;
import uk.gov.gchq.koryphe.signature.Signature;

import javax.inject.Inject;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.function.Predicate;

public class FederatedGraphConfigurationService implements IFederatedGraphConfigurationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedOperationService.class);
    private final FederatedConfigAuthoriser authoriser = createAuthoriser();
    private final FederatedExecutor executor = createExecutor();

    @Inject
    private UserFactory userFactory;

    @Override
    public GafferUrl addUrl(final GafferUrl url) {
        if (null == url.getUrl() || url.getUrl().isEmpty()) {
            throw new IllegalArgumentException("URL is required");
        }
        if (null == url.getName() || url.getName().isEmpty()) {
            throw new IllegalArgumentException("URL name is required");
        }

        if (authoriser.authorise(createUser())) {
            final FederatedConfig config = executor.getConfig();
            if (config.getUrlMap().containsKey(url.getName())) {
                throw new IllegalArgumentException("URL name is already in use: " + url
                        .getName());
            }

            if (config.getUrlMap().containsValue(url.getUrl())) {
                throw new IllegalArgumentException("URL has already been registered: " + url);
            }

            LOGGER.info("Adding URL: " + url.getName() + ",  " + url.getUrl());
            config.getUrlMap().put(url.getName(), url.getUrl());
            refresh();
        }
        return url;
    }

    @Override
    public List<FederatedSystemStatus> refresh() {
        executor.reinitialiseConfig();
        return executor.fetchSystemStatuses();
    }

    @Override
    public boolean deleteUrl(final String name) {
        boolean success;
        if (authoriser.authorise(createUser())) {

            final String url = executor.getConfig()
                    .getUrlMap()
                    .remove(name);
            success = null != url;
            if (success) {
                executor.reinitialiseConfig();
            }
        } else {
            throw new UnauthorisedException("");
        }

        return success;
    }

    @Override
    public Set<GafferUrl> getUrls() {
        final Map<String, String> urlMap = executor.getConfig()
                .getUrlMap();
        final Set<GafferUrl> gafferUrls = new HashSet<>(urlMap.size());

        for (final Entry<String, String> entry : urlMap.entrySet()) {
            gafferUrls.add(new GafferUrl(entry.getKey(), entry.getValue()));
        }

        return gafferUrls;
    }

    @Override
    public Schema getSchema() {
        return executor.getConfig().getMergedSchema();
    }

    @Override
    public Set<String> getFilterFunctions() {
        return executor.getConfig().getFilterFunctions();
    }

    @SuppressFBWarnings(value = "REC_CATCH_EXCEPTION", justification = "Need to wrap all runtime exceptions before they are given to the user")
    @Override
    public Set<String> getFilterFunctions(final String inputClass) {
        if (StringUtils.isEmpty(inputClass)) {
            return executor.getConfig().getFilterFunctions();
        }

        final Class<?> clazz;
        try {
            clazz = Class.forName(inputClass);
        } catch (final Exception e) {
            throw new IllegalArgumentException("Input class was not recognised: " + inputClass, e);
        }

        final Set<String> classes = new HashSet<>();
        for (final String functionClass : executor.getConfig()
                .getFilterFunctions()) {
            try {
                final Class<?> classInstance = Class.forName(functionClass);
                final Predicate function = (Predicate) classInstance.newInstance();
                final Signature signature = Signature.getInputSignature(function);
                if (signature.assignable(clazz).isValid()) {
                    classes.add(functionClass);
                }
            } catch (final Exception e) {
                // just add the function.
                classes.add(functionClass);
            }
        }

        return classes;
    }

    @Override
    public Set<String> getTransformFunctions() {
        return executor.getConfig().getFilterFunctions();
    }

    @Override
    public Set<String> getGenerators() {
        return executor.getConfig().getGenerators();
    }

    @Override
    public Set<String> getOperations() {
        return executor.getConfig().getOperations();
    }

    @Override
    public Set<StoreTrait> getStoreTraits() {
        return executor.getConfig().getTraits();
    }

    @Override
    public Boolean isOperationSupported(final String className) {
        return executor.getConfig()
                .getOperations()
                .contains(className);
    }

    @SuppressFBWarnings(value = "REC_CATCH_EXCEPTION", justification = "Need to wrap all runtime exceptions before they are given to the user")
    @Override
    public Set<String> getSerialisedFields(final String className) {
        final Class<?> clazz;
        try {
            clazz = Class.forName(className);
        } catch (final Exception e) {
            throw new IllegalArgumentException("Class name was not recognised: " + className, e);
        }

        final ObjectMapper mapper = new ObjectMapper();
        final JavaType type = mapper.getTypeFactory().constructType(clazz);
        final BeanDescription introspection = mapper.getSerializationConfig()
                .introspect(type);
        final List<BeanPropertyDefinition> properties = introspection.findProperties();

        final Set<String> fields = new HashSet<>();
        for (final BeanPropertyDefinition property : properties) {
            fields.add(property.getName());
        }

        return fields;
    }

    protected User createUser() {
        return userFactory.createUser();
    }

    protected FederatedExecutor createExecutor() {
        return new FederatedExecutor();
    }

    protected FederatedConfigAuthoriser createAuthoriser() {
        return new FederatedConfigAuthoriser();
    }
}
