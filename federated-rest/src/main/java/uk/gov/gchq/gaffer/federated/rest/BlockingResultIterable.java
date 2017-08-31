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

import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class BlockingResultIterable implements Iterable<Object> {
    public static final int SLEEP_TIME_IN_MS = 200;
    protected final List<Object> results;
    protected final int n;
    protected final long timeout;
    private final boolean skipErrors;
    private final boolean firstResult;

    public BlockingResultIterable(final List<Object> results, final int n, final long timeout, final boolean skipErrors, final boolean firstResult) {
        if (null == results) {
            throw new IllegalArgumentException("Iterable list cannot be null");
        }
        this.results = results;
        this.n = n;
        this.timeout = timeout;
        this.skipErrors = skipErrors;
        this.firstResult = firstResult;
    }


    @Override
    public Iterator<Object> iterator() {
        return new ResultIterator();
    }

    private class ResultIterator implements Iterator<Object> {
        private final Iterator<Object>[] iterators = new Iterator[n];
        private int index = 0;
        private boolean resultsReturned = false;

        @Override
        public boolean hasNext() {
            return -1 != getNextIndex();
        }

        @Override
        public Object next() {
            index = getNextIndex();
            if (-1 == index) {
                throw new NoSuchElementException();
            }

            resultsReturned = true;
            return getIterator(index).next();
        }

        private int getNextIndex() {
            boolean hasNext = getIterator(index).hasNext();
            int nextIndex = index;
            while (!hasNext) {
                if (firstResult && resultsReturned) {
                    nextIndex = -1;
                    break;
                }

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

        private Iterator<Object> getIterator(final int i) {
            if (null == iterators[i]) {
                iterators[i] = getIterable(i).iterator();
            }

            return iterators[i];
        }

        private Iterable<Object> getIterable(final int i) {
            final long startTime = System.currentTimeMillis();
            while (results.size() <= i && (System.currentTimeMillis() - startTime < timeout)) {
                // block until there is an iterator available
                try {
                    Thread.sleep(SLEEP_TIME_IN_MS);
                } catch (final InterruptedException e) {
                    throw new RuntimeException(e.getMessage(), e);
                }
            }

            if (results.size() <= i) {
                throw new RuntimeException("Iterable failed to be returned after " + (0.001 * timeout) + " seconds.");
            }

            Object result = results.get(i);
            if (result instanceof Exception) {
                if (!skipErrors) {
                    throw new RuntimeException((Exception) result);
                }
            } else if (result instanceof Iterable) {
                return ((Iterable<Object>) result);
            }

            throw new RuntimeException("Invalid result type");
        }
    }
}
