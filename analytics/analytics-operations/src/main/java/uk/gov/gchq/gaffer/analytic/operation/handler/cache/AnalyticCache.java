/*
 * Copyright 2019 Crown Copyright
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

package uk.gov.gchq.gaffer.analytic.operation.handler.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.analytic.operation.AnalyticDetail;
import uk.gov.gchq.gaffer.cache.CacheServiceLoader;
import uk.gov.gchq.gaffer.cache.exception.CacheOperationException;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.commonutil.iterable.WrappedCloseableIterable;
import uk.gov.gchq.gaffer.named.operation.cache.exception.CacheOperationFailedException;

import java.util.HashSet;
import java.util.Set;

/**
 * Wrapper around the {@link CacheServiceLoader} to provide an interface for handling
 * the {@link AnalyticDetail}s for a Gaffer graph.
 */
public class AnalyticCache {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnalyticCache.class);
    private static final String CACHE_NAME = "AnalyticOperation";

    /**
     * If the user is just adding to the cache, ie the overwrite flag is set to false, then no security is added.
     * However if the user is overwriting the Analytic operation stored in the cache, then their opAuths must be checked
     * against the write roles associated with the {@link AnalyticDetail}. If it turns out the user is overwriting a
     * non-existent AnalyticOperationDetail, then the users AnalyticOperationDetail will be added normally.
     *
     * @param analyticOperation The AnalyticOperationDetail that the user wants to store.
     * @param overwrite         Flag relating to whether the user is adding (false) or updating/overwriting (true).
     * @throws CacheOperationFailedException Thrown if the add operation fails for some reason.
     */
    public void addAnalyticOperation(final AnalyticDetail analyticOperation, final boolean overwrite) throws CacheOperationFailedException {
        add(analyticOperation, overwrite);
    }

    /**
     * AnalyticOperationDetail and name is removed from the cache.
     * If AnalyticOperationDetail doesn't exist then an Exception is thrown.
     *
     * @param name      The name of the AnalyticOperationDetail a user would like to delete.
     * @throws CacheOperationFailedException Thrown when the AnalyticOperationDetail doesn't exist.
     */
    public void deleteAnalyticOperation(final String name) throws CacheOperationFailedException {
        remove(name);
    }

    /**
     * Gets the AnalyticOperationDetail in question.
     * If the AnalyticOperationDetail doesn't exist, then an exception is thrown.
     *
     * @param name      The name of the AnalyticOperationDetail held in the cache.
     * @return AnalyticOperationDetail.
     * @throws CacheOperationFailedException thrown if the AnalyticOperationDetail doesn't exist.
     */
    public AnalyticDetail getAnalyticOperation(final String name) throws CacheOperationFailedException {
        return get(name);
    }

    /**
     * Get all the Analytic operations held in the cache.
     * @return a {@link CloseableIterable} containing the Analytic operation details
     */
    public CloseableIterable<AnalyticDetail> getAllAnalyticOperations() {
        return getAll();
    }

    /**
     * Clear the Analytic operation cache.
     *
     * @throws CacheOperationFailedException if there was an error clearing the
     *                                       cache
     */
    public void clear() throws CacheOperationFailedException {
        try {
            CacheServiceLoader.getService().clearCache(CACHE_NAME);
        } catch (final CacheOperationException e) {
            throw new CacheOperationFailedException("Failed to clear cache", e);
        }
    }

    /**
     * Delete the specified {@link AnalyticDetail} from the cache.
     *
     * @param name the name of the operation to delete
     * @throws CacheOperationFailedException if there was an error deleting the
     *                                       operation from the cache
     */
    public void deleteFromCache(final String name) throws CacheOperationFailedException {
        CacheServiceLoader.getService().removeFromCache(CACHE_NAME, name);

        if (null != CacheServiceLoader.getService().getFromCache(CACHE_NAME, name)) {
            throw new CacheOperationFailedException("Failed to remove " + name + " from cache");
        }
    }

    /**
     * Add the specified Analytic operation to the cache.
     *
     * @param name      the name of the operation to add
     * @param operation the details of the new Analytic operation
     * @param overwrite if true, overwrite any existing entry which matches the
     *                  provided name
     * @throws CacheOperationFailedException if there was an error adding the
     *                                       operation to the cache
     */
    public void addToCache(final String name, final AnalyticDetail operation, final boolean overwrite)
            throws CacheOperationFailedException {
        try {
            if (overwrite) {
                CacheServiceLoader.getService().putInCache(CACHE_NAME, name, operation);
            } else {
                CacheServiceLoader.getService().putSafeInCache(CACHE_NAME, name, operation);
            }
        } catch (final CacheOperationException e) {
            throw new CacheOperationFailedException(e);
        }
    }

    /**
     * Retrieve the specified Analytic operation from the cache.
     *
     * @param name the name of the Analytic operation to retrieve
     * @return the details of the requested Analytic operation
     * @throws CacheOperationFailedException if there was an error accessing the
     *                                       cache
     */
    public AnalyticDetail getFromCache(final String name) throws CacheOperationFailedException {
        if (null == name) {
            throw new CacheOperationFailedException("AnalyticOperation name cannot be null");
        }
        final AnalyticDetail op = CacheServiceLoader.getService().getFromCache(CACHE_NAME, name);

        if (null != op) {
            return op;
        }
        throw new CacheOperationFailedException("No Analytic operation with the name " + name + " exists in the cache");
    }

    private void add(final AnalyticDetail analyticOperation, final boolean overwrite) throws CacheOperationFailedException {
        String name;
        try {
            name = analyticOperation.getAnalyticName();
        } catch (final NullPointerException e) {
            throw new CacheOperationFailedException("AnalyticOperation cannot be null", e);
        }
        if (null == name) {
            throw new CacheOperationFailedException("AnalyticOperation name cannot be null");
        }
        if (!overwrite) {
            addToCache(name, analyticOperation, false);
            return;
        }

        AnalyticDetail existing;

        try {
            existing = getFromCache(name);
        } catch (final CacheOperationFailedException e) { // if there is no existing Analytic Operation add one
            addToCache(name, analyticOperation, false);
            return;
        }
        addToCache(name, analyticOperation, true);
    }

    private void remove(final String name) throws CacheOperationFailedException {
        if (null == name) {
            throw new CacheOperationFailedException("AnalyticOperation name cannot be null");
        }
        deleteFromCache(name);
    }

    private AnalyticDetail get(final String name) throws CacheOperationFailedException {
        if (null == name) {
            throw new CacheOperationFailedException("AnalyticOperation name cannot be null");
        }
        return getFromCache(name);
    }

    private CloseableIterable<AnalyticDetail> getAll() {
        final Set<String> keys = CacheServiceLoader.getService().getAllKeysFromCache(CACHE_NAME);
        final Set<AnalyticDetail> executables = new HashSet<>();
        for (final String key : keys) {
            try {
                AnalyticDetail op = getFromCache(key);
                executables.add(op);
            } catch (final CacheOperationFailedException e) {
                LOGGER.error(e.getMessage(), e);
            }

        }
        return new WrappedCloseableIterable<>(executables);
    }
}