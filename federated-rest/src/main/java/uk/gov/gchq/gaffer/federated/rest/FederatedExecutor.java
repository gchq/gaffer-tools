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

import org.glassfish.jersey.client.ClientProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import uk.gov.gchq.gaffer.federated.rest.dto.Operation;
import uk.gov.gchq.gaffer.federated.rest.dto.OperationChain;
import uk.gov.gchq.gaffer.federated.rest.dto.Schema;
import uk.gov.gchq.gaffer.federated.rest.service.IFederatedGraphConfigurationService;
import uk.gov.gchq.gaffer.federated.rest.service.IFederatedOperationService;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.Validate;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.operation.serialisation.TypeReferenceImpl;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.store.TypeReferenceStoreImpl;
import uk.gov.gchq.gaffer.user.User;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class FederatedExecutor {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedExecutor.class);

    private final FederatedConfig config;
    private final FederatedRequestor requestor;

    public FederatedExecutor() {
        this(FederatedConfig.getSharedConfig(), new FederatedRequestor());
    }

    protected FederatedExecutor(final FederatedConfig config, final FederatedRequestor requestor) {
        this.config = config;
        this.requestor = requestor;
        requestor.initialise(config);
        if (null == config.getUrls() || !config.hasUrls()) {
            config.setUrlMap(loadUrls());
            config.setJsonSerialiser(createJsonSerialiser());
            config.setConnectTimeout(System.getProperty(SystemProperty.CONNECT_TIMEOUT, SystemProperty.CONNECT_TIMEOUT_DEFAULT));
            config.setReadTimeout(System.getProperty(SystemProperty.READ_TIMEOUT, SystemProperty.READ_TIMEOUT_DEFAULT));
            config.setClients(createClients());
        }
    }

    public FederatedConfig getConfig() {
        if (!config.isInitialised()) {
            reinitialiseConfig();
        }

        return config;
    }

    public FederatedConfig reinitialiseConfig() {
        config.setClients(createClients());
        config.setTraits(fetchTraits());
        config.setOperations(fetchClasses(IFederatedGraphConfigurationService.OPERATIONS_PATH));
        config.setFilterFunctions(fetchClasses(IFederatedGraphConfigurationService.FILTER_FUNCTIONS_PATH));
        config.setTransformFunctions(fetchClasses(IFederatedGraphConfigurationService.TRANSFORM_FUNCTIONS_PATH));
        config.setGenerators(fetchClasses(IFederatedGraphConfigurationService.GENERATORS_PATH));
        config.setSchemas(fetchSchemaMaps());

        return config;
    }

    public Iterable<Object> executeOperation(final Operation operation, final Class opClass, final User user, final boolean skipErrors, final boolean firstResult) {
        final OperationChain opChain = new OperationChain();
        if (null != opClass) {
            operation.setClazz(opClass.getName());
        }
        opChain.setOperations(Collections.singletonList(operation));
        return executeOperationChain(opChain, user, skipErrors, false, firstResult);
    }

    public Iterable<Object> executeOperationChain(final OperationChain operationChain, final User user, final boolean skipErrors, final boolean runIndividually, final boolean firstResult) {
        if (!config.hasUrls()) {
            throw new RuntimeException("No URLs specified to delegate operation chain to");
        }

        if (!config.isInitialised()) {
            reinitialiseConfig();
        }

        if (runIndividually && config.getNumUrls() > 1 && operationChain.getOperations().size() > 1) {
            Iterable<Object> previousResult = null;
            for (final Operation operation : operationChain.getOperations()) {
                if (null != previousResult && null == operation.getInput()) {
                    operation.setInput(previousResult);
                }

                previousResult = executeOperationChain(new OperationChain(operation), user, skipErrors, false, firstResult);
            }
            return previousResult;
        }

        updateAddElementsOperations(operationChain);
        final List<Object> results = Collections.synchronizedList(new ArrayList<>(config.getNumUrls()));
        for (final Map.Entry<String, String> entry : config.getUrlMap().entrySet()) {
            final String name = entry.getKey();
            final String url = entry.getValue();
            new Thread(() -> {
                try {
                    results.add(executeOperationChainViaUrl(operationChain.clone(), user, url, skipErrors));
                } catch (final Exception e) {
                    final String msg = "Failed to execute operations via: " + name + ". " + e.getMessage();
                    results.add(new OperationException(msg, e));
                    LOGGER.error(msg, e);
                }
            }).start();
        }

        return new BlockingResultIterable(results, config.getNumUrls(), config.getConnectTimeout(), skipErrors, firstResult);
    }

    protected Iterable<Object> executeOperationChainViaUrl(final OperationChain operationChain, final User user, final String url, final boolean skipErrors) {
        final boolean viewHasGroups = updateOperationViews(operationChain, url);

        Object resultObj = null;
        if (viewHasGroups) {
            resultObj = requestor.doPost(url, "graph/" + IFederatedOperationService.DO_OPERATION_PATH, operationChain, new TypeReferenceImpl.Object(), user, skipErrors);
        }

        final Iterable<Object> result;
        if (null == resultObj) {
            result = Collections.emptyList();
        } else if (resultObj instanceof Iterable) {
            result = (Iterable<Object>) resultObj;
        } else {
            result = Collections.singletonList(resultObj);
        }
        return result;
    }

    protected JSONSerialiser createJsonSerialiser() {
        return new JSONSerialiser();
    }

    protected Map<String, String> loadUrls() {
        final Map<String, String> urls = new LinkedHashMap<>();
        final String urlCsv = System.getProperty("gaffer.federated-rest.urls", null);
        if (null != urlCsv) {
            final String[] urlParts = urlCsv.split(",");
            for (int i = 0; (i + 1) < urlParts.length; i += 2) {
                urls.put(urlParts[i], urlParts[i + 1]);
            }
        }
        return urls;
    }

    protected Map<String, Client> createClients() {
        final Map<String, Client> clients = new HashMap<>(config.getNumUrls());
        for (final String url : config.getUrls()) {
            final Client client = ClientBuilder.newClient();
            client.property(ClientProperties.CONNECT_TIMEOUT, config.getConnectTimeout());
            client.property(ClientProperties.READ_TIMEOUT, config.getReadTimeout());
            clients.put(url, client);
        }

        return clients;
    }

    public List<FederatedSystemStatus> fetchSystemStatuses() {
        final List<FederatedSystemStatus> results = new ArrayList<>();
        for (final Map.Entry<String, String> entry : config.getUrlMap().entrySet()) {
            final String name = entry.getKey();
            final String url = entry.getValue();

            FederatedSystemStatus status = requestor.doGet(url, "status", new TypeReferenceFederatedImpl.SystemStatus(), null, true);
            if (null == status) {
                status = new FederatedSystemStatus();
                status.setDescription("No response");
                status.setStatus(404);
            }

            status.setUrl(url);
            status.setName(name);

            if (status.getDescription().contains("The system is working normally.")) {
                status.setStatus(200);
            } else if (status.getStatus() != 0) {
                status.setStatus(500);
            }

            LOGGER.info(status.toString());
            results.add(status);
        }

        return results;
    }

    protected Set<StoreTrait> fetchTraits() {
        final Set<StoreTrait> proxyTraits = new HashSet<>();
        for (final String url : config.getUrls()) {
            final Set<StoreTrait> traits = requestor.doGet(url, "graph/" + IFederatedGraphConfigurationService.STORE_TRAITS_PATH, new TypeReferenceStoreImpl.StoreTraits(), null, true);
            if (null != traits) {
                proxyTraits.addAll(traits);
            }
        }

        // This proxy store cannot handle visibility due to the simple rest api using a default user.
        proxyTraits.remove(StoreTrait.VISIBILITY);
        return Collections.unmodifiableSet(proxyTraits);
    }

    protected Set<String> fetchClasses(final String classType) {
        final Set<String> ops = new HashSet<>();
        for (final String url : config.getUrls()) {
            final Set<String> classes = requestor.doGet(url, "graph/" + classType, new TypeReferenceFederatedImpl.SetString(), null, true);
            if (null != classes) {
                ops.addAll(classes);
            }
        }

        return Collections.unmodifiableSet(ops);
    }

    protected Map<String, Schema> fetchSchemaMaps() {
        final Map<String, Schema> schemaMap = new HashMap<>();

        for (final String url : config.getUrls()) {
            final Schema schemaPart = requestor.doGet(url, "graph/" + IFederatedGraphConfigurationService.SCHEMA_PATH, new TypeReferenceFederatedImpl.Schema(), null, true);
            schemaMap.put(url, schemaPart);
        }

        return schemaMap;
    }

    protected void updateAddElementsOperations(final OperationChain operationChain) {
        for (final Operation operation : operationChain.getOperations()) {
            final String opClass = operation.getClazz();
            if (AddElements.class.getName().equals(opClass)
                    || Validate.class.getName().equals(opClass)) {
                operation.set("skipInvalidElements", "true");
            }
        }
    }

    protected boolean updateOperationViews(final OperationChain operationChain, final String url) {
        boolean validView = true;
        for (final Operation operation : operationChain.getOperations()) {
            if (null != operation.getView() && operation.getView().hasGroups()) {
                operation.getView().removeInvalidGroups(config.getSchemas().get(url));
                validView = operation.getView().hasGroups();
            }
        }

        return validView;
    }
}
