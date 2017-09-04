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

import uk.gov.gchq.gaffer.federated.rest.dto.Schema;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.store.StoreTrait;

import javax.ws.rs.client.Client;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class FederatedConfig {
    /**
     * Map of name to URL
     */
    private Map<String, String> urlMap = new HashMap<>();

    private JSONSerialiser jsonSerialiser;
    private Map<String, Client> clients;
    private Set<StoreTrait> traits;
    private Set<String> filterFunctions;
    private Set<String> transformFunctions;
    private Set<String> generators;
    private Set<String> operations;
    private int connectTimeout = Integer.parseInt(SystemProperty.CONNECT_TIMEOUT_DEFAULT);
    private int readTimeout = Integer.parseInt(SystemProperty.READ_TIMEOUT_DEFAULT);

    private Map<String, Schema> schemas;
    private Schema mergedSchema;

    private static FederatedConfig sharedConfig = new FederatedConfig();

    public static FederatedConfig getSharedConfig() {
        return sharedConfig;
    }

    public boolean isInitialised() {
        return null != mergedSchema;
    }

    public boolean hasUrls() {
        return !urlMap.isEmpty();
    }

    public int getNumUrls() {
        return urlMap.size();
    }

    public JSONSerialiser getJsonSerialiser() {
        return jsonSerialiser;
    }

    public void setJsonSerialiser(final JSONSerialiser jsonSerialiser) {
        this.jsonSerialiser = jsonSerialiser;
    }

    public Map<String, String> getUrlMap() {
        return urlMap;
    }

    public Collection<String> getUrls() {
        return urlMap.values();
    }

    public void setUrlMap(final Map<String, String> urls) {
        this.urlMap = urls;
    }

    public Map<String, Client> getClients() {
        return clients;
    }

    public void setClients(final Map<String, Client> clients) {
        this.clients = clients;
    }

    public Map<String, Schema> getSchemas() {
        return schemas;
    }

    public void setSchemas(final Map<String, Schema> schemas) {
        this.schemas = schemas;
        mergedSchema = new Schema();
        for (final Schema schema : schemas.values()) {
            mergedSchema.merge(schema);
        }
    }

    public Schema getMergedSchema() {
        return mergedSchema;
    }

    public Set<StoreTrait> getTraits() {
        return traits;
    }

    public void setTraits(final Set<StoreTrait> traits) {
        this.traits = traits;
    }

    public Set<String> getOperations() {
        return operations;
    }

    public void setOperations(final Set<String> operations) {
        this.operations = operations;
    }

    public int getConnectTimeout() {
        return connectTimeout;
    }

    public void setConnectTimeout(final int connectTimeout) {
        this.connectTimeout = connectTimeout;
    }

    public void setConnectTimeout(final String connectTimeout) {
        this.connectTimeout = Integer.parseInt(connectTimeout);
    }

    public int getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(final int readTimeout) {
        this.readTimeout = readTimeout;
    }

    public void setReadTimeout(final String readTimeout) {
        this.readTimeout = Integer.parseInt(readTimeout);
    }

    public Set<String> getFilterFunctions() {
        return filterFunctions;
    }

    public void setFilterFunctions(final Set<String> filterFunctions) {
        this.filterFunctions = filterFunctions;
    }

    public Set<String> getGenerators() {
        return generators;
    }

    public void setGenerators(final Set<String> generators) {
        this.generators = generators;
    }

    public Set<String> getTransformFunctions() {
        return transformFunctions;
    }

    public void setTransformFunctions(final Set<String> transformFunctions) {
        this.transformFunctions = transformFunctions;
    }
}
