/*
 * Copyright 2019-2020 Crown Copyright
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

package uk.gov.gchq.gaffer.analytic.operation.handler;

import uk.gov.gchq.gaffer.analytic.operation.AddAnalytic;
import uk.gov.gchq.gaffer.analytic.operation.AnalyticDetail;
import uk.gov.gchq.gaffer.analytic.operation.UIMappingDetail;
import uk.gov.gchq.gaffer.analytic.operation.handler.cache.AnalyticCache;
import uk.gov.gchq.gaffer.named.operation.NamedOperationDetail;
import uk.gov.gchq.gaffer.named.operation.cache.exception.CacheOperationFailedException;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.operation.handler.OperationHandler;
import uk.gov.gchq.gaffer.store.operation.handler.named.cache.NamedOperationCache;

import java.util.Map;

public class AddAnalyticHandler implements OperationHandler<AddAnalytic> {
    private final AnalyticCache cache;

    public AddAnalyticHandler() {
        this(new AnalyticCache());
    }

    public AddAnalyticHandler(final AnalyticCache cache) {
        this.cache = cache;
    }

    /**
     * Adds an Analytic to a cache which must be specified in the operation
     * declarations file. An AnalyticDetail is built using the fields on the
     * AddAnalytic. The operation name and operation chain fields must be set and
     * cannot be left empty, or the build() method will fail and a runtime exception
     * will be thrown. The handler then adds/overwrites the Analytic according toa
     * an overwrite flag.
     *
     * @param operation the {@link uk.gov.gchq.gaffer.operation.Operation} to be
     *                  executed
     * @param context   the operation chain context, containing the user who
     *                  executed the operation
     * @param store     the {@link Store} the operation should be run on
     * @return null (since the output is void)
     * @throws OperationException if the operation on the cache fails
     */
    @Override
    public Void doOperation(final AddAnalytic operation, final Context context, final Store store)
            throws OperationException {
        try {
            final AnalyticDetail analyticOperationDetail = new AnalyticDetail.Builder()
                    .analyticName(operation.getAnalyticName()).operationName(operation.getOperationName())
                    .creatorId(context.getUser().getUserId()).readers(operation.getReadAccessRoles())
                    .writers(operation.getWriteAccessRoles()).description(operation.getDescription())
                    .uiMapping(operation.getUiMapping()).metaData(operation.getMetaData())
                    .outputVisualisation(operation.getOutputVisualisation())
                    .score(operation.getScore()).options(operation.getOptions())
                    .build();

            validate(analyticOperationDetail);
            cache.addAnalyticOperation(analyticOperationDetail, operation.isOverwriteFlag(), context.getUser(),
                    store.getProperties().getAdminAuth());

        } catch (final CacheOperationFailedException e) {
            throw new OperationException(e.getMessage(), e);
        }
        return null;
    }

    private void validate(final AnalyticDetail analyticOperationDetail) throws OperationException {

        if (null != analyticOperationDetail.getUiMapping()) {
            Map<String, UIMappingDetail> uiMap = analyticOperationDetail.getUiMapping();
            for (final String current : analyticOperationDetail.getUiMapping().keySet()) {
                if (uiMap.get(current).getLabel() == null) {
                    throw new OperationException("UIMapping: label not specified.");
                } else if (uiMap.get(current).getParameterName() == null) {
                    throw new OperationException("UIMapping: parameterName not specified.");
                } else if (uiMap.get(current).getUserInputType() == null) {
                    throw new OperationException("UIMapping: userInputType not specified.");
                } else {
                    NamedOperationCache noc = new NamedOperationCache();
                    try {
                        NamedOperationDetail nod = noc.getFromCache(analyticOperationDetail.getOperationName());
                        if (nod.getParameters() == null) {
                            throw new OperationException("UIMapping exists, parameters should not be null");
                        }
                        if (nod.getParameters().get(uiMap.get(current).getParameterName()) == null) {
                            throw new OperationException("UIMapping: parameter '"
                                    + uiMap.get(current).getParameterName() + "' does not exist in Named Operation");
                        }
                    } catch (final CacheOperationFailedException e) {
                        throw new OperationException(e.getMessage());
                    }
                }
            }
        }

        if (null == analyticOperationDetail.getMetaData()) {
            throw new OperationException("Missing metaData field in AddAnalyticOperation");
        }
    }
}
