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

package uk.gov.gchq.gaffer.store.integration.analytic;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import uk.gov.gchq.gaffer.cache.CacheServiceLoader;
import uk.gov.gchq.gaffer.cache.exception.CacheOperationException;
import uk.gov.gchq.gaffer.cache.impl.HashMapCacheService;
import uk.gov.gchq.gaffer.cache.util.CacheProperties;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.analytic.AddAnalytic;
import uk.gov.gchq.gaffer.operation.analytic.AnalyticDetail;
import uk.gov.gchq.gaffer.operation.analytic.DeleteAnalytic;
import uk.gov.gchq.gaffer.operation.analytic.GetAllAnalytics;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.Store;
import uk.gov.gchq.gaffer.store.StoreProperties;
import uk.gov.gchq.gaffer.store.operation.handler.analytic.AddAnalyticHandler;
import uk.gov.gchq.gaffer.store.operation.handler.analytic.DeleteAnalyticHandler;
import uk.gov.gchq.gaffer.store.operation.handler.analytic.GetAllAnalyticsHandler;
import uk.gov.gchq.gaffer.user.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class AnalyticCacheIT {
    private static final String CACHE_NAME = "AnalyticOperation";
    private final Properties cacheProps = new Properties();
    private final Store store = mock(Store.class);
    private final String adminAuth = "admin auth";
    private final StoreProperties properties = new StoreProperties();

    private final HashMap<String, String> outputType = Maps.newHashMap();
    private final HashMap<String, String> metaData = Maps.newHashMap();

    private AddAnalytic add = new AddAnalytic.Builder()
            .analyticName("op")
            .operationName("op1")
            .description("test operation")
            .outputType(outputType)
            .metaData(metaData)
            .overwrite()
            .score(0)
            .build();

    private User user = new User();
    private User authorisedUser = new User.Builder().userId("authorisedUser").opAuth("authorised").build();
    private User adminAuthUser = new User.Builder().userId("adminAuthUser").opAuth(adminAuth).build();
    private Context context = new Context(user);
    private GetAllAnalyticsHandler getAllAnalyticOperationHandler = new GetAllAnalyticsHandler();
    private AddAnalyticHandler addAnalyticOperationHandler = new AddAnalyticHandler();
    private DeleteAnalyticHandler deleteAnalyticOperationHandler = new DeleteAnalyticHandler();
    private GetAllAnalytics get = new GetAllAnalytics();

    @Before
    public void before() throws CacheOperationException {
        cacheProps.clear();
        properties.setAdminAuth(adminAuth);
        given(store.getProperties()).willReturn(properties);
    }

    @After
    public void after() throws CacheOperationException {
        CacheServiceLoader.getService().clearCache(CACHE_NAME);
    }

    @Test
    public void shouldWorkUsingHashMapServiceClass() throws OperationException, CacheOperationException {
        outputType.put("output", "graph");
        metaData.put("iconURL", "example");
        reInitialiseCacheService(HashMapCacheService.class);
        runTests();
    }

    private void reInitialiseCacheService(final Class clazz) throws CacheOperationException {
        cacheProps.setProperty(CacheProperties.CACHE_SERVICE_CLASS, clazz.getCanonicalName());
        CacheServiceLoader.initialise(cacheProps);
        CacheServiceLoader.getService().clearCache(CACHE_NAME);
    }

    private void runTests() throws OperationException, CacheOperationException {
        shouldAllowUpdatingOfAnalyticOperations();
        after();
        shouldAllowUpdatingOfAnalyticOperationsWithAllowedUsers();
        after();
        shouldAllowReadingOfAnalyticOperationsUsingAdminAuth();
        after();
        shouldAllowUpdatingOfAnalyticOperationsUsingAdminAuth();
        after();
        shouldBeAbleToAddAnalyticOperationToCache();
        after();
        shouldBeAbleToDeleteAnalyticOperationFromCache();
    }


    private void shouldBeAbleToAddAnalyticOperationToCache() throws OperationException {
        // given
        GetAllAnalytics get = new GetAllAnalytics.Builder().build();
        final Store store = mock(Store.class);
        given(store.getProperties()).willReturn(properties);

        // when
        addAnalyticOperationHandler.doOperation(add, context, store);

        AnalyticDetail expectedAnalyticOp = new AnalyticDetail.Builder()
                .operationName(add.getOperationName())
                .analyticName(add.getAnalyticName())
                .creatorId(user.getUserId())
                .readers(new ArrayList<>())
                .writers(new ArrayList<>())
                .description(add.getDescription())
                .score(0)
                .outputType(outputType)
                .metaData(metaData)
                .build();

        List<AnalyticDetail> expected = Lists.newArrayList(expectedAnalyticOp);
        List<AnalyticDetail> results = Lists.newArrayList(new GetAllAnalyticsHandler().doOperation(get, context, store));

        // then
        assertEquals(1, results.size());
        assertEquals(expected, results);
    }


    private void shouldBeAbleToDeleteAnalyticOperationFromCache() throws OperationException {
        // given
        final Store store = mock(Store.class);
        given(store.getProperties()).willReturn(properties);

        new AddAnalyticHandler().doOperation(add, context, store);

        DeleteAnalytic del = new DeleteAnalytic.Builder()
                .name("op")
                .build();

        GetAllAnalytics get = new GetAllAnalytics();

        // when
        deleteAnalyticOperationHandler.doOperation(del, context, store);

        List<AnalyticDetail> results = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, context, store));

        // then
        assertEquals(0, results.size());

    }

    private void shouldAllowUpdatingOfAnalyticOperations() throws OperationException {
        // given
        final Store store = mock(Store.class);
        final StoreProperties storeProps = mock(StoreProperties.class);
        given(store.getProperties()).willReturn(storeProps);

        new AddAnalyticHandler().doOperation(add, context, store);

        AddAnalytic update = new AddAnalytic.Builder()
                .analyticName(add.getAnalyticName())
                .operationName(add.getOperationName())
                .description("a different operation")
                .overwrite()
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        GetAllAnalytics get = new GetAllAnalytics();

        // when
        new AddAnalyticHandler().doOperation(add, context, store);

        List<AnalyticDetail> results = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, context, store));

        AnalyticDetail expectedAnalyticOp = new AnalyticDetail.Builder()
                .operationName(update.getOperationName())
                .analyticName(update.getAnalyticName())
                .description(update.getDescription())
                .creatorId(user.getUserId())
                .readers(new ArrayList<>())
                .writers(new ArrayList<>())
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        ArrayList<AnalyticDetail> expected = Lists.newArrayList(expectedAnalyticOp);

        // then
        assertEquals(expected.size(), results.size());
        assertEquals(expected, results);
    }

    private void shouldAllowUpdatingOfAnalyticOperationsWithAllowedUsers() throws OperationException {
        // given
        final Store store = mock(Store.class);
        given(store.getProperties()).willReturn(properties);

        new AddAnalyticHandler().doOperation(add, context, store);

        AddAnalytic update = new AddAnalytic.Builder()
                .operationName(add.getOperationName())
                .description("a different operation")
                .analyticName(add.getAnalyticName())
                .overwrite()
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        GetAllAnalytics get = new GetAllAnalytics();

        // when
        new AddAnalyticHandler().doOperation(add, context, store);

        List<AnalyticDetail> results = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, context, store));

        AnalyticDetail expectedAnalyticOp = new AnalyticDetail.Builder()
                .operationName(update.getOperationName())
                .analyticName(update.getAnalyticName())
                .description(update.getDescription())
                .creatorId(user.getUserId())
                .readers(new ArrayList<>())
                .writers(new ArrayList<>())
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        ArrayList<AnalyticDetail> expected = Lists.newArrayList(expectedAnalyticOp);

        // then
        assertEquals(expected.size(), results.size());
        assertEquals(expected, results);
    }

    private void shouldAllowReadingOfAnalyticOperationsUsingAdminAuth() throws OperationException {
        // given
        Context contextWithAuthorisedUser = new Context(authorisedUser);
        Context contextWithAdminUser = new Context(adminAuthUser);
        AnalyticDetail expectedAnalyticOp = new AnalyticDetail.Builder()
                .operationName(add.getOperationName())
                .analyticName(add.getAnalyticName())
                .description(add.getDescription())
                .creatorId(authorisedUser.getUserId())
                .readers(new ArrayList<>())
                .writers(new ArrayList<>())
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();
        ArrayList<AnalyticDetail> expected = Lists.newArrayList(expectedAnalyticOp);

        addAnalyticOperationHandler.doOperation(add, contextWithAuthorisedUser, store);

        // when
        List<AnalyticDetail> resultsWithNoAdminRole = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, context, store));

        // then
        assertEquals(0, resultsWithNoAdminRole.size());

        // when
        List<AnalyticDetail> resultsWithAdminRole = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, contextWithAdminUser, store));

        // then
        assertEquals(1, resultsWithAdminRole.size());
        assertEquals(expected, resultsWithAdminRole);
    }

    private void shouldAllowUpdatingOfAnalyticOperationsUsingAdminAuth() throws OperationException {
        // given
        Context contextWithAuthorisedUser = new Context(authorisedUser);
        Context contextWithAdminUser = new Context(adminAuthUser);
        addAnalyticOperationHandler.doOperation(add, contextWithAuthorisedUser, store);

        AddAnalytic update = new AddAnalytic.Builder()
                .operationName(add.getOperationName())
                .description("a different operation")
                .analyticName(add.getAnalyticName())
                .overwrite()
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        AnalyticDetail expectedAnalyticOp = new AnalyticDetail.Builder()
                .operationName(update.getOperationName())
                .analyticName(update.getAnalyticName())
                .description(update.getDescription())
                .creatorId(adminAuthUser.getUserId())
                .readers(new ArrayList<>())
                .writers(new ArrayList<>())
                .outputType(outputType)
                .metaData(metaData)
                .score(0)
                .build();

        ArrayList<AnalyticDetail> expected = Lists.newArrayList(expectedAnalyticOp);

        // when / then
        try {
            addAnalyticOperationHandler.doOperation(update, context, store);
            fail("Exception expected");
        } catch (final OperationException e) {
            assertTrue(e.getMessage().contains("User UNKNOWN does not have permission to overwrite"));
        }

        // when
        addAnalyticOperationHandler.doOperation(update, contextWithAdminUser, store);

        List<AnalyticDetail> results = Lists.newArrayList(getAllAnalyticOperationHandler.doOperation(get, contextWithAdminUser, store));

        // then
        assertEquals(expected.size(), results.size());
        assertEquals(expected, results);
    }
}
