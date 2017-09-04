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

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.server.ChunkedOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.federated.rest.FederatedExecutor;
import uk.gov.gchq.gaffer.federated.rest.dto.Operation;
import uk.gov.gchq.gaffer.federated.rest.dto.OperationChain;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements;
import uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects;
import uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import uk.gov.gchq.gaffer.rest.factory.UserFactory;
import uk.gov.gchq.gaffer.user.User;

import javax.inject.Inject;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collections;

import static uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser.createDefaultMapper;

public class FederatedOperationService implements IFederatedOperationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedOperationService.class);
    private final ObjectMapper mapper = createDefaultMapper();
    private final FederatedExecutor executor = createExecutor();

    @Inject
    private UserFactory userFactory;

    @Override
    public Iterable<Object> execute(final OperationChain operationChain, final boolean skipErrors, final boolean runIndividually, final boolean firstResult) {
        return executor.executeOperationChain(operationChain, createUser(), skipErrors, runIndividually, firstResult);
    }

    @Override
    public Object execute(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, Operation.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public ChunkedOutput<String> executeChunked(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        final OperationChain opChain = new OperationChain();
        opChain.setOperations(Collections.singletonList(operation));
        return executeChunked(opChain, skipErrors, false, firstResult);
    }

    @Override
    public ChunkedOutput<String> executeChunked(final OperationChain opChain, final boolean skipErrors, final boolean runIndividually, final boolean firstResult) {
        // Create chunked output instance
        final ChunkedOutput<String> output = new ChunkedOutput<>(String.class, "\r\n");

        // write chunks to the chunked output object
        new Thread(() -> {
            try {
                final Object result = execute(opChain, skipErrors, runIndividually, firstResult);
                chunkResult(result, output);
            } finally {
                IOUtils.closeQuietly(output);
            }
        }).start();

        return output;
    }

    @Override
    public Iterable<Object> generateObjects(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GenerateObjects.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> generateElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GenerateElements.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAdjacentIds(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAdjacentIds.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAllElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAllElements.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetElements.class, createUser(), skipErrors, firstResult);
    }

    @Override
    public void addElements(final Operation operation) {
        executor.executeOperation(operation, AddElements.class, createUser(), false, false);
    }

    protected void chunkResult(final Object result, final ChunkedOutput<String> output) {
        if (result instanceof Iterable) {
            final Iterable itr = (Iterable) result;
            try {
                for (final Object item : itr) {
                    output.write(mapper.writeValueAsString(item));
                }
            } catch (final IOException ioe) {
                LOGGER.warn("IOException (chunks)", ioe);
            } finally {
                if (itr instanceof Closeable) {
                    IOUtils.closeQuietly(((Closeable) itr));
                }
            }
        } else {
            try {
                output.write(mapper.writeValueAsString(result));
            } catch (final IOException ioe) {
                LOGGER.warn("IOException (chunks)", ioe);
            }
        }
    }

    protected FederatedExecutor createExecutor() {
        return new FederatedExecutor();
    }

    protected User createUser() {
        return userFactory.createUser();
    }
}
