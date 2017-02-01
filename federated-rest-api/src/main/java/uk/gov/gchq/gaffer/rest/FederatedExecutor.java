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

package uk.gov.gchq.gaffer.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.commons.lang.StringUtils;
import org.glassfish.jersey.client.ClientProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.gov.gchq.gaffer.commonutil.CommonConstants;
import uk.gov.gchq.gaffer.commonutil.iterable.ChainedIterable;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.Validatable;
import uk.gov.gchq.gaffer.operation.impl.Validate;
import uk.gov.gchq.gaffer.operation.serialisation.TypeReferenceImpl;
import uk.gov.gchq.gaffer.rest.dto.Operation;
import uk.gov.gchq.gaffer.rest.dto.OperationChain;
import uk.gov.gchq.gaffer.rest.dto.Schema;
import uk.gov.gchq.gaffer.rest.dto.View;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.StoreException;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.store.TypeReferenceStoreImpl;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class FederatedExecutor {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedExecutor.class);
    private static final int SLEEP_TIME_IN_MS = 200;

    private static FederatedProperties sharedProperties;
    private FederatedProperties properties;

    /**
     * Set to true by default - so the same instance of {@link Graph} will be
     * returned.
     */
    private boolean singleton;

    public FederatedExecutor() {
        this(true);
    }

    public FederatedExecutor(final boolean singleton) {
        this.singleton = singleton;
        properties = getProperties();

        if (null == properties.getUrls() || properties.getUrls().isEmpty()) {
            properties.setUrls(fetchUrls());
            initialiseProperties();
        }
    }

    public FederatedProperties getProperties() {
        if (singleton) {
            if (null == sharedProperties) {
                sharedProperties = new FederatedProperties();
            }
            return sharedProperties;
        }

        return new FederatedProperties();
    }

    public FederatedProperties initialiseProperties() {
        try {
            properties.setJsonSerialiser(fetchJsonSerialiser());
            properties.setClients(createClients());
            properties.setConnectTimeout(System.getProperty(SystemProperty.CONNECT_TIMEOUT, SystemProperty.CONNECT_TIMEOUT_DEFAULT));
            properties.setReadTimeout(System.getProperty(SystemProperty.READ_TIMEOUT, SystemProperty.READ_TIMEOUT_DEFAULT));
            checkProxyStores();

            properties.setTraits(fetchTraits());
            properties.setOperations(fetchClasses("operations"));
            properties.setFilterFunctions(fetchClasses("filterFunctions"));
            properties.setTransformFunctions(fetchClasses("transformFunctions"));
            properties.setGenerators(fetchClasses("generators"));
            properties.setSchemas(fetchSchemaMaps());
        } catch (final StoreException e) {
            throw new RuntimeException(e);
        }

        return properties;
    }

    public Object executeOperation(final Operation operation, final Class opClass, final Context context, final boolean skipErrors) {
        final OperationChain opChain = new OperationChain();
        operation.setClazz(opClass.getName());
        opChain.setOperations(Collections.singletonList(operation));
        return executeOperationChain(opChain, context, skipErrors, false);
    }

    public Object executeOperationChain(final OperationChain operationChain, final Context context, final boolean skipErrors, final boolean runIndividually) {
        try {
            return executeOpChainViaAllUrls(operationChain, context, skipErrors, runIndividually);
        } catch (final OperationException e) {
            throw new RuntimeException("Error executing opChain", e);
        }
    }

    protected Object executeOpChainViaAllUrls(
            final OperationChain operationChain, final Context context, final boolean skipErrors, final boolean runIndividually)
            throws OperationException {
        if (properties.getUrls().isEmpty()) {
            throw new OperationException("No URLs specified to delegate operation chain to");
        }

        Object mergedResult = null;
        // If there is just 1 url then this simplifies things - no view manipulation or result merging require.
        if (1 == properties.getUrls().size()) {
            try {
                mergedResult = doPost(properties.getUrls().iterator().next(), "graph/doOperation", toJson(operationChain), new TypeReferenceImpl.Object(), context, skipErrors);
            } catch (StoreException e) {
                throw new OperationException(e.getMessage(), e);
            }
        } else if (runIndividually) {
            final List<Operation> operations = operationChain.getOperations();
            Object previousResult = null;
            for (final Operation operation : operations) {
                if (null != previousResult) {
                    if (null == operation.getInput()) {
                        operation.setInput(previousResult);
                    }
                }

                final OperationChain individualOpChain = new OperationChain();
                individualOpChain.setOperations(Collections.singletonList(operation));
                previousResult = executeOpChainViaAllUrls(individualOpChain, context, skipErrors, false);
            }
            mergedResult = previousResult;
        } else {
            updateAddElementsOperations(operationChain);

            final List<Object> results = Collections.synchronizedList(new ArrayList<>(properties.getUrls().size()));
            for (final String url : properties.getUrls()) {
                new Thread() {
                    public void run() {
                        try {
                            results.add(executeOpChainViaUrl(operationChain.clone(), context, url, skipErrors));
                        } catch (final Exception e) {
                            LOGGER.error("Failed to execute operations via URL: " + url, e);
                            results.add(null);
                        }
                    }
                }.start();
            }

            final long startTime = System.currentTimeMillis();
            final long timeout = properties.getConnectTimeout();
            while (results.size() < properties.getUrls().size() && (System.currentTimeMillis() - startTime < timeout)) {
                if (!results.isEmpty() && null != results.get(0)) {
                    if (results.get(0) instanceof List || results.get(0) instanceof Object[]) {
                        LOGGER.info("Using blocked closeable iterable - " + (results.get(0) instanceof List));
                        mergedResult = new BlockedCloseableChainedIterable<>((List) results, properties.getUrls().size(), properties.getConnectTimeout());
                        break;
                    }
                }

                // block until all results have been returned.
                try {
                    Thread.sleep(SLEEP_TIME_IN_MS);
                } catch (InterruptedException e) {
                    throw new OperationException(e.getMessage(), e);
                }
            }

            if (null == mergedResult) {
                if (results.size() < properties.getUrls().size()) {
                    throw new RuntimeException("Results failed to be returned after " + (0.001 * timeout) + " seconds.");
                }

                boolean allIterables = true;
                for (final Object result : results) {
                    if (!(result instanceof Iterable)) {
                        allIterables = false;
                        break;
                    }
                }

                if (allIterables) {
                    mergedResult = new ChainedIterable(results.toArray(new Iterable[results.size()]));
                } else {
                    mergedResult = results;
                }
            }
        }

        return mergedResult;
    }

    protected Object executeOpChainViaUrl(final OperationChain operationChain, final Context context, final String url, final boolean skipErrors) throws OperationException {
        boolean viewHasGroups = updateOperationViews(operationChain, url);

        Object result = null;
        if (viewHasGroups) {
            try {
                result = doPost(url, "graph/doOperation", toJson(operationChain), new TypeReferenceImpl.Object(), context, skipErrors);
            } catch (final StoreException e) {
                throw new OperationException(e.getMessage(), e);
            }
        }
        return result;
    }

    protected JSONSerialiser fetchJsonSerialiser() {
        return new JSONSerialiser();
    }

    protected Set<String> fetchUrls() {
        final Set<String> urls = new LinkedHashSet<>();
        final String urlCsv = System.getProperty("gaffer.federated-rest-api.urls", null);
        if (null != urlCsv) {
            Collections.addAll(urls, urlCsv.split(","));
        }
        return urls;
    }

    protected Map<String, Client> createClients() {
        final Map<String, Client> clients = new HashMap<>(properties.getUrls().size());
        for (final String url : properties.getUrls()) {
            final Client client = ClientBuilder.newClient();
            client.property(ClientProperties.CONNECT_TIMEOUT, properties.getConnectTimeout());
            client.property(ClientProperties.READ_TIMEOUT, properties.getReadTimeout());
            clients.put(url, client);
        }

        return clients;
    }

    protected void checkProxyStores() throws StoreException {
        for (final String url : properties.getUrls()) {
            final LinkedHashMap status = doGet(url, "status", new TypeReferenceImpl.Map(), true);
            if (null == status) {
                LOGGER.error("REST API status from url: " + url + " was null");
            } else {
                LOGGER.info("REST API status from url: " + url + " was " + status.get("description"));
            }
        }
    }

    protected Set<StoreTrait> fetchTraits() throws StoreException {
        final Set<StoreTrait> proxyTraits = new HashSet<>();
        for (final String url : properties.getUrls()) {
            final Set<StoreTrait> traits = doGet(url, "graph/storeTraits", new TypeReferenceStoreImpl.StoreTraits(), true);
            if (null != traits) {
                proxyTraits.addAll(traits);
            }
        }

        // This proxy store cannot handle visibility due to the simple rest api using a default user.
        proxyTraits.remove(StoreTrait.VISIBILITY);
        return Collections.unmodifiableSet(proxyTraits);
    }

    protected Set<String> fetchClasses(final String classType) throws StoreException {
        final Set<String> ops = new HashSet<>();
        for (final String url : properties.getUrls()) {
            final Set<String> classes = doGet(url, "graph/" + classType, new TypeReferenceFederatedImpl.SetString(), true);
            if (null != classes) {
                ops.addAll(classes);
            }
        }

        return Collections.unmodifiableSet(ops);
    }

    protected Map<String, Schema> fetchSchemaMaps() throws StoreException {
        final Map<String, Schema> schemaMap = new HashMap<>();

        for (final String url : properties.getUrls()) {
            final Schema schemaPart = doGet(url, "graph/schema", new TypeReferenceFederatedImpl.Schema(), true);
            schemaMap.put(url, schemaPart);
        }

        return schemaMap;
    }

    protected String toJson(final Object obj) {
        final String json;
        try {
            json = new String(properties.getJsonSerialiser().serialise(obj), CommonConstants.UTF_8);
        } catch (final UnsupportedEncodingException | SerialisationException e) {
            throw new IllegalArgumentException("Unable to serialise object into JSON: " + obj.toString(), e);
        }
        return json;
    }

    protected <T> T doPost(final String url, final String urlSuffix, final String jsonBody,
                           final TypeReference<T> outputTypeReference,
                           final Context context,
                           final boolean skipErrors) throws StoreException {
        try {
            return handleResponse(executePost(url, urlSuffix, jsonBody, context), outputTypeReference);
        } catch (final Exception e) {
            if (!skipErrors) {
                throw new StoreException("Failed to execute post via " +
                        "the Gaffer URL " + url, e);
            }
        }

        return null;
    }

    protected <T> T doGet(final String url, final String urlSuffix,
                          final TypeReference<T> outputTypeReference,
                          final boolean skipErrors) throws StoreException {
        try {
            return handleResponse(executeGet(url, urlSuffix), outputTypeReference);
        } catch (final Exception e) {
            if (!skipErrors) {
                throw new StoreException("Request failed to execute via url " + url, e);
            }
        }

        return null;
    }

    protected Response executePost(final String url, final String urlSuffix, final String jsonBody, final Context context) throws StoreException {
        final Invocation.Builder request = createRequest(jsonBody, url, urlSuffix, context);
        return request.post(Entity.json(jsonBody));
    }

    protected Response executeGet(final String url, final String urlSuffix) throws StoreException {
        final Invocation.Builder request = createRequest(null, url, urlSuffix, null);
        return request.get();
    }

    protected Invocation.Builder createRequest(final String body, final String url, final String urlSuffix, final Context context) {
        final Invocation.Builder request = properties.getClients().get(url)
                .target(getFullUrl(url, urlSuffix))
                .request();
        if (null != body) {
            request.header("Content", MediaType.APPLICATION_JSON_TYPE);
            request.build(body);
        }
        return request;
    }

    protected <T> T handleResponse(final Response response,
                                   final TypeReference<T> outputTypeReference)
            throws StoreException {
        final String outputJson = response.hasEntity() ? response.readEntity(String.class) : null;
        if (200 != response.getStatus() && 204 != response.getStatus()) {
            LOGGER.warn("Gaffer bad status " + response.getStatus());
            LOGGER.warn("Detail: " + outputJson);
            throw new StoreException("Delegate Gaffer store returned status: " + response.getStatus() + ". Response content was: " + outputJson);
        }

        return handleSuccessfulResponse(outputJson, outputTypeReference);
    }

    protected <T> T handleSuccessfulResponse(final String outputJson,
                                             final TypeReference<T> outputTypeReference)
            throws StoreException {
        T output = null;
        if (null != outputJson) {
            try {
                output = deserialise(outputJson, outputTypeReference);
            } catch (final SerialisationException e) {
                throw new StoreException(e.getMessage(), e);
            }
        }

        return output;
    }

    protected String getFullUrl(final String url, final String suffix) {
        final String urlSuffix;
        if (StringUtils.isNotEmpty(suffix)) {
            urlSuffix = prepend("/", suffix);
        } else {
            urlSuffix = "";
        }

        return url + urlSuffix;
    }

    protected <T> T deserialise(final String jsonString,
                                final TypeReference<T> outputTypeReference)
            throws SerialisationException {
        final byte[] jsonBytes;
        try {
            jsonBytes = jsonString.getBytes(CommonConstants.UTF_8);
        } catch (final UnsupportedEncodingException e) {
            throw new SerialisationException(
                    "Unable to deserialise JSON: " + jsonString, e);
        }

        try {
            return properties.getJsonSerialiser().deserialise(jsonBytes, outputTypeReference);
        } catch (final SerialisationException e) {
            LOGGER.debug("Unable to deserialise json - using a LinkedHashMap instead", e);
            return (T) properties.getJsonSerialiser().deserialise(jsonBytes, new TypeReferenceImpl.Map());
        }
    }

    protected void updateAddElementsOperations(final OperationChain operationChain) {
        LOGGER.info("op chain: " + operationChain);
        LOGGER.info("operations: " + operationChain.getOperations());
        for (final Operation operation : operationChain.getOperations()) {
            final String opClass = operation.getClazz();
            if (Validatable.class.getName().equals(opClass)
                    || Validate.class.getName().equals(opClass)) {
                operation.set("skipInvalidElements", "true");
            }
        }
    }

    protected boolean updateOperationViews(final OperationChain operationChain, final String url) {
        boolean viewHasGroups = true;
        for (final Operation operation : operationChain.getOperations()) {
            final View view = operation.getView();
            if (null != view && (view.getEdges().isEmpty() || !view.getEntities().isEmpty())) {
                final Set<String> knownEntities = new HashSet<>(view.getEntities().keySet());
                final Set<String> knownEdges = new HashSet<>(view.getEdges().keySet());

                final Set entities = properties.getSchemas().get(url).getEntities().keySet();
                knownEntities.retainAll((Collection<?>) entities);

                final Set edges = properties.getSchemas().get(url).getEdges().keySet();
                knownEdges.retainAll((Collection<?>) edges);

                if (knownEdges.isEmpty() && knownEntities.isEmpty()) {
                    viewHasGroups = false;
                    break;
                }

                final Set<String> unknownEntities = new HashSet<>(view.getEntities().keySet());
                unknownEntities.removeAll(knownEntities);

                final Set<String> unknownEdges = new HashSet<>(view.getEdges().keySet());
                unknownEdges.removeAll(knownEdges);

                for (final String unknownEntity : unknownEntities) {
                    view.getEntities().remove(unknownEntity);
                }

                for (final String unknownEdge : unknownEdges) {
                    view.getEdges().remove(unknownEdge);
                }
            }
        }
        return viewHasGroups;
    }

    protected String prepend(final String prefix, final String string) {
        if (!string.startsWith(prefix)) {
            return prefix + string;
        }

        return string;
    }

    public Set<String> getFunctions(final String inputClass) {
        return null;
    }
}
