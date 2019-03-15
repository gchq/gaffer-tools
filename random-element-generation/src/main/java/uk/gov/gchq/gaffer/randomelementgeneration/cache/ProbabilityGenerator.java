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

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.SortedMap;

public class ProbabilityGenerator<T> {
    private final Random random = new Random();
    private T[] items;
    private long totalCount;
    private List<Double> probabilities;
    private List<Double> cumulativeProbabilities;

    public ProbabilityGenerator(final SortedMap<T, Long> itemsToFrequency) {
        this.items = (T[]) new Object[itemsToFrequency.size()];
        int i = 0;
        for (final T item : itemsToFrequency.keySet()) {
            items[i++] = item;
        }
        this.totalCount = itemsToFrequency.values().stream().mapToLong(Long::longValue).sum();
        // Probability of choosing an item x is itemsToFrequency(x) / totalCount
        this.probabilities = new ArrayList<>(itemsToFrequency.size());
        itemsToFrequency.entrySet()
                .forEach(entry -> {
                    probabilities.add(((double) entry.getValue()) / totalCount);
                });
        // Create cumulative probability distribution
        this.cumulativeProbabilities = new ArrayList<>(itemsToFrequency.size());
        double cumulative = 0.0D;
        for (final double p : probabilities) {
            cumulative += p;
            cumulativeProbabilities.add(cumulative);
        }
    }

    public T sample() {
        // Generate a random number between 0 and 1
        final double sample = random.nextDouble();
        // Iterate through the cumulative probabilities until find the first value greater than the sample
        int i = 0;
        for (final double p : cumulativeProbabilities) {
            if (sample < p) {
                return items[i];
            }
            i++;
        }
        return items[items.length - 1];
    }
}
