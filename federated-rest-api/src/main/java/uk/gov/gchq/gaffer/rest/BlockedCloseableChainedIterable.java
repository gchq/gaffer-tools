/*
 * Copyright 2016 Crown Copyright
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

package uk.gov.gchq.gaffer.rest;

import com.google.common.collect.Lists;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterator;
import uk.gov.gchq.gaffer.commonutil.iterable.WrappedCloseableIterator;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class BlockedCloseableChainedIterable<T> implements CloseableIterable<T> {
    public static final int SLEEP_TIME_IN_MS = 200;
    public static final int DEFAULT_TIMEOUT_IN_MS = 60000;
    protected final List<Iterable<T>> itrs;
    protected final int n;
    protected final long timeout;

    public BlockedCloseableChainedIterable(final List<Iterable<T>> itrs, final int n) {
        this(itrs, n, DEFAULT_TIMEOUT_IN_MS);
    }

    public BlockedCloseableChainedIterable(final Iterable<T>[] itrs, final int n, final long timeout) {
        this(Lists.newArrayList(itrs), n, timeout);
    }

    public BlockedCloseableChainedIterable(final List<Iterable<T>> itrs, final int n, final long timeout) {
        if (null == itrs) {
            throw new IllegalArgumentException("Iterable list cannot be null");
        }
        this.itrs = itrs;
        this.n = n;
        this.timeout = timeout;
    }


    @Override
    public void close() {
        iterator().close();
    }

    @Override
    public CloseableIterator<T> iterator() {
        return new WrappedCloseableIterator<>(new IteratorWrapper());
    }

    private class IteratorWrapper implements CloseableIterator<T> {
        private final Iterator<T>[] iterators = new Iterator[n];
        private int index = 0;

        @Override
        public boolean hasNext() {
            return -1 != getNextIndex();
        }

        @Override
        public T next() {
            index = getNextIndex();
            if (-1 == index) {
                throw new NoSuchElementException();
            }

            return getIterator(index).next();
        }

        private int getNextIndex() {
            boolean hasNext = getIterator(index).hasNext();
            int nextIndex = index;
            while (!hasNext) {
                nextIndex = nextIndex + 1;
                if (nextIndex < n) {
                    hasNext = getIterator(nextIndex).hasNext();
                } else {
                    nextIndex = -1;
                    break;
                }
            }

            return nextIndex;
        }

        @Override
        public void remove() {
            getIterator(index).remove();
        }

        private Iterator<T> getIterator(final int i) {
            if (null == iterators[i]) {
                iterators[i] = getIterable(i).iterator();
            }

            return iterators[i];
        }

        private Iterable<T> getIterable(final int i) {
            final long startTime = System.currentTimeMillis();
            while (itrs.size() <= i && (System.currentTimeMillis() - startTime < timeout)) {
                // block until there is an iterator available
                try {
                    Thread.sleep(SLEEP_TIME_IN_MS);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }

            if (itrs.size() <= i) {
                throw new RuntimeException("Iterable failed to be returned after " + (0.001 * timeout) + " seconds.");
            }

            final Iterable<T> itr = itrs.get(i);
            if (null == itr) {
                throw new RuntimeException("Iterable was null - this is likely due to an error upstream. Check the logs.");
            }

            return itr;
        }

        @Override
        public void close() {
            for (int i = 0; i < n; i++) {
                final Iterable<T> itr = getIterable(i);
                if (itr instanceof CloseableIterable) {
                    ((CloseableIterable) itr).close();
                }
            }

            for (final Iterator<T> iterator : iterators) {
                if (iterator instanceof CloseableIterator) {
                    ((CloseableIterator) iterator).close();
                }
            }
        }
    }
}
