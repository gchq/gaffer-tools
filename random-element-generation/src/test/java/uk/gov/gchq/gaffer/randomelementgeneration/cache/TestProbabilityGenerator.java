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

import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.IntStream;

import static junit.framework.TestCase.assertTrue;

public class TestProbabilityGenerator {

    @Test
    public void testWhenUniform() {
        // Given
        final SortedMap<String, Long> itemsToFrequency = new TreeMap<>();
        itemsToFrequency.put("A", 100L);
        itemsToFrequency.put("B", 100L);
        final ProbabilityGenerator<String> generator = new ProbabilityGenerator<>(itemsToFrequency);

        // When
        final Map<String, Long> counts = new ConcurrentHashMap<>();
        counts.put("A", 0L);
        counts.put("B", 0L);
        IntStream.range(0, 1000000).asDoubleStream().forEach(i -> {
            final String sample = generator.sample();
            counts.put(sample, counts.get(sample) + 1L);
        });

        // Then
        final double ratio = ((double) counts.get("A")) / counts.get("B");
        assertTrue(0.99D < ratio && ratio < 1.01D);
    }

    @Test
    public void testWhenUnbalanced() {
        // Given
        final SortedMap<String, Long> itemsToFrequency = new TreeMap<>();
        itemsToFrequency.put("A", 10000L);
        itemsToFrequency.put("B", 10L);
        final ProbabilityGenerator<String> generator = new ProbabilityGenerator<>(itemsToFrequency);

        // When
        final Map<String, Long> counts = new ConcurrentHashMap<>();
        counts.put("A", 0L);
        counts.put("B", 0L);
        IntStream.range(0, 10000000).forEach(i -> {
            final String sample = generator.sample();
            counts.put(sample, counts.get(sample) + 1L);
        });

        // Then
        final double ratio = ((double) counts.get("A")) / counts.get("B");
        assertTrue(ratio > 100.0D);
    }
}
