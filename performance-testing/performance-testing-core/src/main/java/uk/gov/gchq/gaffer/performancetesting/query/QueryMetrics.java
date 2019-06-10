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
package uk.gov.gchq.gaffer.performancetesting.query;

import uk.gov.gchq.gaffer.performancetesting.Metrics;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

/**
 * This class contains the results from a {@link uk.gov.gchq.gaffer.performancetesting.query.QueryTest}. It provides
 * the number of seeds queried for per second and the number of results per second.
 */
public class QueryMetrics implements Metrics {
    public static final String SEEDS_PER_SECOND = "seeds_per_second";
    public static final String RESULTS_PER_SECOND = "results_per_second";
    private static final SortedSet<String> METRIC_NAMES = Collections.unmodifiableSortedSet(
            new TreeSet<>(Arrays.asList(SEEDS_PER_SECOND, RESULTS_PER_SECOND)));
    private final Map<String, Double> metrics;

    public QueryMetrics(final double seedsPerSecond, final double resultsPerSecond) {
        this.metrics = new HashMap<>();
        metrics.put(SEEDS_PER_SECOND, seedsPerSecond);
        metrics.put(RESULTS_PER_SECOND, resultsPerSecond);
    }

    @Override
    public SortedSet<String> getMetricNames() {
        return METRIC_NAMES;
    }

    @Override
    public Object getMetric(final String metricName) {
        return metrics.get(metricName);
    }

    @Override
    public void putMetric(final String metricName, final Object metric) {
        if (!METRIC_NAMES.contains(metricName)) {
            throw new IllegalArgumentException("Unrecognised metric " + metricName);
        }
        if (!(metric instanceof Double)) {
            throw new IllegalArgumentException("Metric must be a double (got " + metricName.getClass().getName() + ")");
        }
        metrics.put(metricName, (Double) metric);
    }
}
