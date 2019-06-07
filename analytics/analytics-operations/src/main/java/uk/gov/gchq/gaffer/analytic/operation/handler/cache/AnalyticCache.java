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

package uk.gov.gchq.gaffer.store.operation.handler.analytic.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.cache.CacheServiceLoader;
import uk.gov.gchq.gaffer.cache.exception.CacheOperationException;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.commonutil.iterable.WrappedCloseableIterable;
import uk.gov.gchq.gaffer.named.operation.cache.exception.CacheOperationFailedException;
import uk.gov.gchq.gaffer.operation.analytic.AnalyticDetail;
import uk.gov.gchq.gaffer.user.User;

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
     * @param user              The user making the request.
     * @throws CacheOperationFailedException thrown if the user doesn't have write access to the AnalyticOperationDetail requested,
     *                                       or if the add operation fails for some reason.
     */
    public void addAnalyticOperation(final AnalyticDetail analyticOperation, final boolean overwrite, final User user) throws CacheOperationFailedException {
        add(analyticOperation, overwrite, user, null);
    }

    /**
     * If the user is just adding to the cache, ie the overwrite flag is set to false, then no security is added.
     * However if the user is overwriting the Analytic operation stored in the cache, then their opAuths must be checked
     * against the write roles associated with the {@link AnalyticDetail}. If it turns out the user is overwriting a
     * non-existent AnalyticOperationDetail, then the users AnalyticOperationDetail will be added normally.
     *
     * @param analyticOperation The AnalyticOperationDetail that the user wants to store.
     * @param overwrite         Flag relating to whether the user is adding (false) or updating/overwriting (true).
     * @param user              The user making the request.
     * @param adminAuth         The admin auth supplied for permissions.
     * @throws CacheOperationFailedException thrown if the user doesn't have write access to the AnalyticOperationDetail requested,
     *                                       or if the add operation fails for some reason.
     */
    public void addAnalyticOperation(final AnalyticDetail analyticOperation, final boolean overwrite, final User user, final String adminAuth) throws CacheOperationFailedException {
        add(analyticOperation, overwrite, user, adminAuth);
    }

    /**
     * Checks whether a {@link User} has write access to the cache. If they do then the AnalyticOperationDetail and name is
     * removed from the cache. If they don't or the AnalyticOperationDetail doesn't exist then an Exception is thrown.
     *
     * @param name The name of the AnalyticOperationDetail a user would like to delete.
     * @param user A {@link User} object that can optionally be used for checking permissions.
     * @throws CacheOperationFailedException Thrown when the AnalyticOperationDetail doesn't exist or the User doesn't have
     *                                       write permission on the AnalyticOperationDetail.
     */
    public void deleteAnalyticOperation(final String name, final User user) throws CacheOperationFailedException {
        remove(name, user, null);
    }

    /**
     * Checks whether a {@link User} has write access to the cache. If they do then the AnalyticOperationDetail and name is
     * removed from the cache. If they don't or the AnalyticOperationDetail doesn't exist then an Exception is thrown.
     *
     * @param name      The name of the AnalyticOperationDetail a user would like to delete.
     * @param user      A {@link User} object that can optionally be used for checking permissions.
     * @param adminAuth The admin auth supplied for permissions.
     * @throws CacheOperationFailedException Thrown when the AnalyticOperationDetail doesn't exist or the User doesn't have
     *                                       write permission on the AnalyticOperationDetail.
     */
    public void deleteAnalyticOperation(final String name, final User user, final String adminAuth) throws CacheOperationFailedException {
        remove(name, user, adminAuth);
    }

    /**
     * First gets the AnalyticOperationDetail in question and checks whether the user has read access before returning the value.
     * If the AnalyticOperationDetail doesn't exist or the User doesn't have permission to read this AnalyticOperationDetail, then an
     * exception is thrown.
     *
     * @param name The name of the AnalyticOperationDetail held in the cache.
     * @param user The {@link User} object that is used for checking read permissions.
     * @return AnalyticOperationDetail.
     * @throws CacheOperationFailedException thrown if the AnalyticOperationDetail doesn't exist or the User doesn't have permission
     *                                       to read it.
     */
    public AnalyticDetail getAnalyticOperation(final String name, final User user) throws CacheOperationFailedException {
        return get(name, user, null);
    }

    /**
     * First gets the AnalyticOperationDetail in question and checks whether the user has read access before returning the value.
     * If the AnalyticOperationDetail doesn't exist or the User doesn't have permission to read this AnalyticOperationDetail, then an
     * exception is thrown.
     *
     * @param name      The name of the AnalyticOperationDetail held in the cache.
     * @param user      The {@link User} object that is used for checking read permissions.
     * @param adminAuth The admin auth supplied for permissions.
     * @return AnalyticOperationDetail.
     * @throws CacheOperationFailedException thrown if the AnalyticOperationDetail doesn't exist or the User doesn't have permission
     *                                       to read it.
     */
    public AnalyticDetail getAnalyticOperation(final String name, final User user, final String adminAuth) throws CacheOperationFailedException {
        return get(name, user, adminAuth);
    }

    /**
     * Get all the Analytic operations held in the cache.
     *
     * @param user The {@link User} object that is used for checking read permissions.
     * @return a {@link CloseableIterable} containing the Analytic operation details
     */
    public CloseableIterable<AnalyticDetail> getAllAnalyticOperations(final User user) {
        return getAll(user, null);
    }

    /**
     * Get all the Analytic operations held in the cache.
     *
     * @param user      The {@link User} object that is used for checking read permissions.
     * @param adminAuth The admin auth supplied for permissions.
     * @return a {@link CloseableIterable} containing the Analytic operation details
     */
    public CloseableIterable<AnalyticDetail> getAllAnalyticOperations(final User user, final String adminAuth) {
        return getAll(user, adminAuth);
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
     * Delete the specified {@link AnalyticDetail}
     * from the cache.
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
    public void addToCache(final String name, final AnalyticDetail operation, final boolean overwrite) throws CacheOperationFailedException {
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
            throw new CacheOperationFailedException("Operation name cannot be null");
        }
        final AnalyticDetail op = CacheServiceLoader.getService().getFromCache(CACHE_NAME, name);

        if (null != op) {
            return op;
        }
        throw new CacheOperationFailedException("No Analytic operation with the name " + name + " exists in the cache");
    }

    private void add(final AnalyticDetail analyticOperation, final boolean overwrite, final User user, final String adminAuth) throws CacheOperationFailedException {
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
        if (existing.hasWriteAccess(user, adminAuth)) {
            addToCache(name, analyticOperation, true);
        } else {
            throw new CacheOperationFailedException("User " + user.getUserId() + " does not have permission to overwrite");
        }
    }

    private void remove(final String name, final User user, final String adminAuth) throws CacheOperationFailedException {
        if (null == name) {
            throw new CacheOperationFailedException("AnalyticOperation name cannot be null");
        }
        final AnalyticDetail existing = getFromCache(name);
        if (existing.hasWriteAccess(user, adminAuth)) {
            deleteFromCache(name);
        } else {
            throw new CacheOperationFailedException("User " + user +
                    " does not have authority to delete Analytic operation: " + name);
        }
    }

    private AnalyticDetail get(final String name, final User user, final String adminAuth) throws CacheOperationFailedException {
        final AnalyticDetail op = getFromCache(name);
        if (op.hasReadAccess(user, adminAuth)) {
            return op;
        } else {
            throw new CacheOperationFailedException("User: " + user + " does not have read access to " + name);
        }
    }

    private CloseableIterable<AnalyticDetail> getAll(final User user, final String adminAuth) {
        final Set<String> keys = CacheServiceLoader.getService().getAllKeysFromCache(CACHE_NAME);
        final Set<AnalyticDetail> executables = new HashSet<>();
        for (final String key : keys) {
            try {
                AnalyticDetail op = getFromCache(key);
                if (op.hasReadAccess(user, adminAuth)) {
                    executables.add(op);
                }
            } catch (final CacheOperationFailedException e) {
                LOGGER.error(e.getMessage(), e);
            }

        }
        return new WrappedCloseableIterable<>(executables);
    }
}
