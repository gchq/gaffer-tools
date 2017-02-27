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
import uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentEntitySeeds;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllEdges;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllEntities;
import uk.gov.gchq.gaffer.operation.impl.get.GetEdges;
import uk.gov.gchq.gaffer.operation.impl.get.GetElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetEntities;
import uk.gov.gchq.gaffer.store.Context;
import java.io.Closeable;
import java.io.IOException;

import static uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser.createDefaultMapper;

public class FederatedOperationService implements IFederatedOperationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(FederatedOperationService.class);
    protected final ObjectMapper mapper = createDefaultMapper();
    protected final FederatedExecutor executor = createExecutor();

    protected FederatedExecutor createExecutor() {
        return new FederatedExecutor();
    }

    protected Context createContext() {
        return new Context();
    }

    @Override
    public Iterable<Object> execute(final OperationChain operationChain, final boolean skipErrors, final boolean runIndividually, final boolean firstResult) {
        return executor.executeOperationChain(operationChain, createContext(), skipErrors, runIndividually, firstResult);
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
        return executor.executeOperation(operation, GenerateObjects.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> generateElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GenerateElements.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAdjacentEntitySeeds(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAdjacentEntitySeeds.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAllElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAllElements.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAllEntities(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAllEntities.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getAllEdges(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetAllEdges.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getElements(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetElements.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getEntities(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetEntities.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public Iterable<Object> getEdges(final Operation operation, final boolean skipErrors, final boolean firstResult) {
        return executor.executeOperation(operation, GetEdges.class, createContext(), skipErrors, firstResult);
    }

    @Override
    public void addElements(final Operation operation) {
        executor.executeOperation(operation, AddElements.class, createContext(), false, false);
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
            } catch (IOException ioe) {
                LOGGER.warn("IOException (chunks)", ioe);
            }
        }
    }
}
