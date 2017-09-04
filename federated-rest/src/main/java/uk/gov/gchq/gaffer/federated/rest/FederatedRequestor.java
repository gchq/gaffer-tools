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

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.commonutil.CommonConstants;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.user.User;

import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.io.UnsupportedEncodingException;

public class FederatedRequestor {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedRequestor.class);
    private FederatedConfig config;

    public void initialise(final FederatedConfig config) {
        this.config = config;
    }

    public <T> T doPost(final String url, final String urlSuffix, final Object body,
                        final TypeReference<T> outputTypeReference,
                        final User user,
                        final boolean skipErrors) {
        return doPost(url, urlSuffix, toJson(body), outputTypeReference, user, skipErrors);
    }

    public <T> T doPost(final String url, final String urlSuffix, final String jsonBody,
                        final TypeReference<T> outputTypeReference,
                        final User user,
                        final boolean skipErrors) {
        try {
            return handleResponse(executePost(url, urlSuffix, jsonBody, user), outputTypeReference, url);
        } catch (final Exception e) {
            if (!skipErrors) {
                throw new RuntimeException(getErrorMsg(url, urlSuffix, e), e);
            } else {
                LOGGER.warn(getErrorMsg(url, urlSuffix, e), e);
            }
        }

        return null;
    }

    public <T> T doGet(final String url, final String urlSuffix,
                       final TypeReference<T> outputTypeReference,
                       final User user,
                       final boolean skipErrors) {
        try {
            return handleResponse(executeGet(url, urlSuffix, user), outputTypeReference, url);
        } catch (final Exception e) {
            if (!skipErrors) {
                throw new RuntimeException(getErrorMsg(url, urlSuffix, e), e);
            } else {
                LOGGER.warn(getErrorMsg(url, urlSuffix, e), e);
            }
        }

        return null;
    }

    protected Response executePost(final String url, final String urlSuffix, final String jsonBody, final User user) {
        final Invocation.Builder request = createRequest(jsonBody, url, urlSuffix, user);
        return request.post(Entity.json(jsonBody));
    }

    protected Response executeGet(final String url, final String urlSuffix, final User user) {
        final Invocation.Builder request = createRequest(null, url, urlSuffix, user);
        return request.get();
    }

    protected Invocation.Builder createRequest(final String body, final String url, final String urlSuffix, final User user) {
        final Invocation.Builder request = getConfig().getClients().get(url)
                .target(getFullUrl(url, urlSuffix))
                .request();
        if (null != body) {
            request.header("Content", MediaType.APPLICATION_JSON_TYPE);
            request.build(body);
        }
        return request;
    }

    protected <T> T handleResponse(final Response response,
                                   final TypeReference<T> outputTypeReference,
                                   final String url) {
        final String outputJson = response.hasEntity() ? response.readEntity(String.class) : null;
        if (200 != response.getStatus() && 204 != response.getStatus()) {
            LOGGER.warn("Gaffer bad status " + response.getStatus());
            LOGGER.warn("Detail: " + outputJson);
            throw new RuntimeException("Error status from URL (" + url + "): " + response.getStatus() + ". Response content was: " + outputJson);
        }

        try {
            return handleSuccessfulResponse(outputJson, outputTypeReference);
        } catch (final SerialisationException e) {
            throw new RuntimeException("Unable to deserialise response from URL: " + url, e);
        }
    }

    protected <T> T handleSuccessfulResponse(final String outputJson,
                                             final TypeReference<T> outputTypeReference)
            throws SerialisationException {
        T output = null;
        if (null != outputJson) {
            output = deserialise(outputJson, outputTypeReference);
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

        return getConfig().getJsonSerialiser().deserialise(jsonBytes, outputTypeReference);
    }

    protected String prepend(final String prefix, final String string) {
        if (!string.startsWith(prefix)) {
            return prefix + string;
        }

        return string;
    }

    protected FederatedConfig getConfig() {
        if (null == config) {
            throw new IllegalStateException("Config must be initialised prior to using this requestor");
        }

        return config;
    }

    protected String toJson(final Object obj) {
        final String json;
        try {
            json = new String(getConfig().getJsonSerialiser().serialise(obj), CommonConstants.UTF_8);
        } catch (final UnsupportedEncodingException | SerialisationException e) {
            throw new IllegalArgumentException("Unable to serialise object into JSON: " + obj.toString(), e);
        }
        return json;
    }

    protected String getErrorMsg(final String url, final String urlSuffix, final Exception e) {
        return getErrorMsg(getFullUrl(url, urlSuffix), e);
    }

    protected String getErrorMsg(final String url, final Exception e) {
        return getErrorMsg(url, e.getMessage());
    }

    protected String getErrorMsg(final String url, final String msg) {
        if (null != msg) {
            return "Error connecting to URL (" + url + ") " + msg;
        }

        return "Error connecting to URL (" + url + ")";
    }
}
