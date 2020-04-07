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
package uk.gov.gchq.gaffer.analytic.operation;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Test;

import uk.gov.gchq.gaffer.analytic.operation.handler.AddAnalyticHandler;
import uk.gov.gchq.gaffer.analytic.operation.handler.GetAnalyticHandler;
import uk.gov.gchq.gaffer.analytic.operation.handler.cache.AnalyticCache;
import uk.gov.gchq.gaffer.cache.CacheServiceLoader;
import uk.gov.gchq.gaffer.named.operation.AddNamedOperation;
import uk.gov.gchq.gaffer.named.operation.NamedOperationDetail;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.operation.handler.named.AddNamedOperationHandler;
import uk.gov.gchq.gaffer.store.operation.handler.named.cache.NamedOperationCache;
import uk.gov.gchq.gaffer.user.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class GetAnalyticHandlerTest {
    private final NamedOperationCache namedOperationCache = new NamedOperationCache();
    private final AddNamedOperationHandler addNamedOperationHandler = new AddNamedOperationHandler(namedOperationCache);

    private final AnalyticCache analyticCache = new AnalyticCache();
    private final AddAnalyticHandler addAnalyticHandler = new AddAnalyticHandler(analyticCache);
    private final GetAnalyticHandler getAnalyticHandler = new GetAnalyticHandler(analyticCache);

    private Store store = mock(Store.class);
    private Context context = new Context(new User.Builder()
            .userId(User.UNKNOWN_USER_ID)
            .build());

    private ArrayList<String> analyticWriters = new ArrayList<>(Arrays.asList("basicWriter", "advancedWriter"));
    private ArrayList<String> analyticReaders = new ArrayList<>(Arrays.asList("basicReader", "advancedReader"));
    private ArrayList<String> namedOpWriters = new ArrayList<>(Arrays.asList("superWriter", "adminWriter"));
    private ArrayList<String> namedOpReaders = new ArrayList<>(Arrays.asList("superReader", "adminReader"));

    private final NamedOperationDetail exampleNamedOp = new NamedOperationDetail.Builder()
            .operationName("exampleOp")
            .inputType("uk.gov.gchq.gaffer.data.element.Element[]")
            .creatorId(User.UNKNOWN_USER_ID)
            .operationChain("{\"operations\":[{\"class\":\"uk.gov.gchq.gaffer.operation.impl.add.AddElements\",\"skipInvalidElements\":false,\"validate\":true}]}")
            .readers(namedOpReaders)
            .writers(namedOpWriters)
            .build();

    @Test
    public void shouldReturnNamedOperationRoles() throws Exception {
        // Given
        Map<String, UIMappingDetail> uiMapping = new HashMap<>();
        MetaData metaData = new MetaData();
        metaData.setIcon("icon");

        AddAnalytic addAnalytic = new AddAnalytic.Builder()
                .analyticName("exampleAnalytic")
                .operationName(exampleNamedOp.getOperationName())
                .readAccessRoles(analyticReaders.toArray(new String[0]))
                .writeAccessRoles(analyticWriters.toArray(new String[0]))
                .uiMapping(uiMapping)
                .metaData(metaData)
                .outputVisualisation(new OutputVisualisation())
                .score(4)
                .build();

        GetAnalytic getAnalytic = new GetAnalytic.Builder().analyticName("exampleAnalytic").build();

        AddNamedOperation addNamedOperation = new AddNamedOperation.Builder()
                .name(exampleNamedOp.getOperationName())
                .operationChain("{\"operations\":[{\"class\":\"uk.gov.gchq.gaffer.store.operation.GetSchema\",\"compact\":false}]}")
                .readAccessRoles(namedOpReaders.toArray(new String[0]))
                .writeAccessRoles(namedOpWriters.toArray(new String[0]))
                .score(4)
                .build();

        addNamedOperationHandler.doOperation(addNamedOperation, context, store);
        addAnalyticHandler.doOperation(addAnalytic, context, store);

        // When
        AnalyticDetail retrievedAnalytic = getAnalyticHandler.doOperation(getAnalytic, context, store);

        // Then
        assertEquals(retrievedAnalytic.getReadAccessRoles(), exampleNamedOp.getReadAccessRoles());
    }

    @Test
    public void shouldReturnModifiedNamedOperationRoles() throws Exception {
        // Given
        Map<String, UIMappingDetail> uiMapping = new HashMap<>();
        MetaData metaData = new MetaData();
        metaData.setIcon("icon");
        Map<String, String> outputType = new HashMap<>();
        outputType.put("output", "table");

        AddAnalytic addAnalytic = new AddAnalytic.Builder()
                .analyticName("exampleAnalytic")
                .operationName(exampleNamedOp.getOperationName())
                .readAccessRoles(analyticReaders.toArray(new String[0]))
                .writeAccessRoles(analyticWriters.toArray(new String[0]))
                .uiMapping(uiMapping)
                .metaData(metaData)
                .outputVisualisation(new OutputVisualisation())
                .score(4)
                .build();

        GetAnalytic getAnalytic = new GetAnalytic.Builder().analyticName("exampleAnalytic").build();

        AddNamedOperation addNamedOperation = new AddNamedOperation.Builder()
                .name(exampleNamedOp.getOperationName())
                .operationChain("{\"operations\":[{\"class\":\"uk.gov.gchq.gaffer.store.operation.GetSchema\",\"compact\":false}]}")
                .readAccessRoles(namedOpReaders.toArray(new String[0]))
                .writeAccessRoles(namedOpWriters.toArray(new String[0]))
                .score(4)
                .build();

        addNamedOperationHandler.doOperation(addNamedOperation, context, store);
        addAnalyticHandler.doOperation(addAnalytic, context, store);

        // When
        AnalyticDetail retrievedAnalytic = getAnalyticHandler.doOperation(getAnalytic, context, store);

        // Then
        assertEquals(retrievedAnalytic.getReadAccessRoles(), exampleNamedOp.getReadAccessRoles());

        //Then
        addNamedOperation.setOverwriteFlag(true);
        addNamedOperation.setReadAccessRoles(Arrays.asList("modifiedReadRoles"));
        addNamedOperation.setWriteAccessRoles(Arrays.asList("modifiedWriteRoles"));
        addNamedOperationHandler.doOperation(addNamedOperation, context, store);

        AnalyticDetail modifiedRetrievedAnalytic = getAnalyticHandler.doOperation(getAnalytic, context, store);

        assertEquals(modifiedRetrievedAnalytic.getReadAccessRoles(), Arrays.asList("modifiedReadRoles"));
        assertEquals(modifiedRetrievedAnalytic.getWriteAccessRoles(), Arrays.asList("modifiedWriteRoles"));

    }

    @AfterClass
    public static void tearDown() {
        CacheServiceLoader.shutdown();
    }

    @Before
    public void before() {
        given(store.getProperties()).willReturn(new StoreProperties());
        StoreProperties properties = new StoreProperties();

        properties.set("gaffer.cache.service.class", "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService");
        CacheServiceLoader.initialise(properties.getProperties());
    }
}
