package uk.gov.gchq.gaffer.randomelementgeneration;

import java.util.*;

/**
 *
 */
public class ProbabilityGenerator<T> {
    private final Random random = new Random();
    private SortedMap<T, Long> itemsToFrequency;
    private T[] items;
    private long totalCount;
    private List<Double> probabilities;
    private List<Double> cumulativeProbabilities;

    public ProbabilityGenerator(final SortedMap<T, Long> itemsToFrequency) {
        this.itemsToFrequency = itemsToFrequency;
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
