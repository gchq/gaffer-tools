/*
 * Copyright 2017-2019 Crown Copyright
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

import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.IntStream;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TestPreferentialAttachmentCache {

    @Test
    public void testGetReturnsOneOfTheElementsAdded() {
        // Given
        final PreferentialAttachmentCache<String> cache = new PreferentialAttachmentCache<>(10);
        final Set<String> data = new HashSet<>();
        IntStream.range(0, 5).forEach(i -> data.add("" + i));
        data.forEach(cache::add);

        // When
        final List<String> results = new ArrayList<>();
        IntStream.range(0, 100).forEach(i -> results.add(cache.get()));

        // Then
        results.forEach(i -> assertTrue(data.contains(i)));
    }

    @Test
    public void testMaxSizeIsRespected() {
        // Given
        final PreferentialAttachmentCache<String> cache = new PreferentialAttachmentCache<>(10);
        IntStream.range(0, 20).forEach(i -> cache.add("A" + i));

        // When
        final long numberOfElements = cache.getNumberOfElements();

        // Then
        assertEquals(10, numberOfElements);
    }

    /**
     * This test could be made sophisticated, e.g. checking that the exponent of the power-law lies within a certain
     * range. Currently, this test simply checks that the frequency of the most popular item is several orders of
     * magnitude greater than the least frequent item.
     */
    @Test
    public void testPowerLaw() {
        // Given
        final PreferentialAttachmentCache<String> cache = new PreferentialAttachmentCache<>(10);
        IntStream.range(0, 10).forEach(i -> cache.add("A" + i));
        final Map<String, Long> itemToCount = new HashMap<>();

        // When
        IntStream.range(0, 1000000).forEach(i -> {
            final String item = cache.get();
            if (!itemToCount.containsKey(item)) {
                itemToCount.put(item, 0L);
            }
            itemToCount.put(item, itemToCount.get(item) + 1L);
        });
        final long maxFrequency = itemToCount.values().stream().mapToLong(Long::longValue).max().getAsLong();
        final long minFrequency = itemToCount.values().stream().mapToLong(Long::longValue).min().getAsLong();

        // Then
        assertTrue(maxFrequency / minFrequency > 5);
    }
}
