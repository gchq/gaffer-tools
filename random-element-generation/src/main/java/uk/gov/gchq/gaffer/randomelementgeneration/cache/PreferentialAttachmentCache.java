/*
 * Copyright 2017 Crown Copyright
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
package uk.gov.gchq.gaffer.randomelementgeneration.cache;

import org.apache.log4j.Logger;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.ProbabilityGenerator;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

/**
 *
 * <p> This has a maximum size: when more than that number of distinct items have been added then no more can be added.
 */
public class PreferentialAttachmentCache<T> {
    private static final Logger LOGGER = Logger.getLogger(PreferentialAttachmentCache.class);

    private final Random random = new Random();
    private TreeMap<Long, Set<T>> mapFreqToItems;
    private TreeMap<T, Long> itemsToFreq;
    private int maxSize;

    public PreferentialAttachmentCache(final int maxSize) {
        this.mapFreqToItems = new TreeMap<>(Collections.reverseOrder());
        this.itemsToFreq = new TreeMap<>();
        this.maxSize = maxSize;
    }

    public void add(final T t) {
        if (!itemsToFreq.containsKey(t)) {
            itemsToFreq.put(t, 1L);
            if (mapFreqToItems.containsKey(1L)) {
                mapFreqToItems.get(1L).add(t);
            } else {
                mapFreqToItems.put(1L, new HashSet<>(Arrays.asList(t)));
            }
            if (itemsToFreq.keySet().size() > maxSize) {
                Set<T> items = mapFreqToItems.get(mapFreqToItems.lastKey()); // Last key as stored in reverse order
                int itemToRemove = random.nextInt(items.size());
                int count = 0;
                Iterator<T> it = items.iterator();
                while (it.hasNext()) {
                    T x = it.next();
                    if (count == itemToRemove) {
                        items.remove(x);
                        itemsToFreq.remove(x);
                    }
                    count++;
                    if (count > itemToRemove) {
                        break;
                    }
                }
            }
        } else {
            incrementFrequency(t);
        }
    }

    private void incrementFrequency(final T t) {
        long currentFreq = itemsToFreq.get(t);
        long newFreq = currentFreq + 1L;
        itemsToFreq.put(t, newFreq);
        mapFreqToItems.get(currentFreq).remove(t);
        if (mapFreqToItems.get(currentFreq).size() == 0) {
            mapFreqToItems.remove(currentFreq);
        }
        if (!mapFreqToItems.containsKey(newFreq)) {
            mapFreqToItems.put(newFreq, new HashSet<>());
        }
        mapFreqToItems.get(newFreq).add(t);
    }

    /**
     * Returns a random element in proportion to the frequencies. The frequency of the returned item is increased by 1.
     *
     * @return A random element from the cache with probability proportional to the frequency with which it has been returned.
     */
    public T get() {
        final long totalCount = getNumberOfElements();
        if (totalCount == 0) {
            LOGGER.warn("get() called on empty cache");
            return null;
        }
        final ProbabilityGenerator<T> generator = new ProbabilityGenerator<>(itemsToFreq);
        final T sample = generator.sample();
        // Increment current count for the sample
        itemsToFreq.put(sample, itemsToFreq.get(sample) + 1L);
        return sample;
    }

    public long getNumberOfElements() {
        return itemsToFreq.values().stream().mapToLong(Long::longValue).sum();
    }

    public Map<T, Long> getItemsAndFrequencies() {
        return Collections.unmodifiableMap(itemsToFreq);
    }
}
