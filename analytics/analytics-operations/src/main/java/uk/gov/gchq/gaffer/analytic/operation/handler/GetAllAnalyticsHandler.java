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

package uk.gov.gchq.gaffer.store.operation.handler.analytic;


import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.commonutil.iterable.WrappedCloseableIterable;
import uk.gov.gchq.gaffer.named.operation.NamedOperationDetail;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.analytic.AnalyticDetail;
import uk.gov.gchq.gaffer.operation.analytic.GetAllAnalytics;
import uk.gov.gchq.gaffer.operation.analytic.UIMappingDetail;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.operation.handler.OutputOperationHandler;
import uk.gov.gchq.gaffer.store.operation.handler.analytic.cache.AnalyticCache;
import uk.gov.gchq.gaffer.store.operation.handler.named.cache.NamedOperationCache;
import uk.gov.gchq.koryphe.util.IterableUtil;

import java.util.function.Function;

/**
 * Operation Handler for GetAllAnalyticOperations
 */
public class GetAllAnalyticsHandler implements OutputOperationHandler<GetAllAnalytics, CloseableIterable<AnalyticDetail>> {
    private final AnalyticCache cache;
    private static Context context;

    public GetAllAnalyticsHandler() {
        this(new AnalyticCache());
    }

    public GetAllAnalyticsHandler(final AnalyticCache cache) {
        this.cache = cache;
    }

    /**
     * Retrieves all the Analytic Operations that a user is allowed to see. As the expected behaviour is to bring back a
     * summary of each operation, the simple flag is set to true. This means all the details regarding access roles and
     * operation chain details are not included in the output.
     *
     * @param operation the {@link uk.gov.gchq.gaffer.operation.Operation} to be executed
     * @param context   the operation chain context, containing the user who executed the operation
     * @param store     the {@link Store} the operation should be run on
     * @return an iterable of AnalyticOperations
     * @throws OperationException thrown if the cache has not been initialized in the operation declarations file
     */
    @Override
    public CloseableIterable<AnalyticDetail> doOperation(final GetAllAnalytics operation, final Context context, final Store store) throws OperationException {
        GetAllAnalyticsHandler.context = context;
        final CloseableIterable<AnalyticDetail> ops = cache.getAllAnalyticOperations(context.getUser(), store.getProperties().getAdminAuth());
        return new WrappedCloseableIterable<>(IterableUtil.map(ops, new AddInputType()));
    }

    private static class AddInputType implements Function<AnalyticDetail, AnalyticDetail> {

        @Override
        public AnalyticDetail apply(final AnalyticDetail analyticOp) {
            return resolveParameters(analyticOp);
        }

        private AnalyticDetail resolveParameters(final AnalyticDetail analyticOp) {
            if (null != analyticOp) {
                try {
                    NamedOperationDetail nod = new NamedOperationCache().getNamedOperation(analyticOp.getOperationName(), GetAllAnalyticsHandler.context.getUser());
                    for (final String currentParam : nod.getParameters().keySet()) {
                        for (final String uiKey : analyticOp.getUiMapping().keySet()) {
                            UIMappingDetail uiParam = analyticOp.getUiMapping().get(uiKey);
                            if (uiParam.getParameterName().equals(currentParam)) {
                                uiParam.setInputClass(nod.getParameters().get(currentParam).getValueClass());
                                analyticOp.getUiMapping().put(uiKey, uiParam);
                            }
                        }
                    }

                } catch (final Exception e) {
                    // Can't find the parameter.
                }
            }
            return analyticOp;
        }
    }
}
