package uk.gov.gchq.gaffer.randomelementgeneration.preferentialattachmentcache;

import org.junit.Test;
import uk.gov.gchq.gaffer.randomelementgeneration.ProbabilityGenerator;

import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.IntStream;

import static junit.framework.TestCase.assertTrue;

/**
 *
 */
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
        System.out.println(counts);

        // Then
        final double ratio = ((double) counts.get("A")) / counts.get("B");
    }
}
