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
package uk.gov.gchq.gaffer.performancetesting.query;

import uk.gov.gchq.gaffer.performancetesting.Metrics;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class QueryMetrics implements Metrics {
    public static final String SEEDS_PER_SECOND = "seeds_per_second";
    public static final String RESULTS_PER_SECOND = "results_per_second";
    private static final Set<String> METRIC_NAMES = Collections.unmodifiableSet(new HashSet<>(
            Arrays.asList(SEEDS_PER_SECOND, RESULTS_PER_SECOND)));
    private final Map<String, Double> metrics;

    public QueryMetrics(final double seedsPerSecond, final double resultsPerSecond) {
        this.metrics = new HashMap<>();
        metrics.put(SEEDS_PER_SECOND, seedsPerSecond);
        metrics.put(RESULTS_PER_SECOND, resultsPerSecond);
    }

    @Override
    public Set<String> getMetricNames() {
        return METRIC_NAMES;
    }

    @Override
    public Object getMetric(final String metricName) {
        return metrics.get(metricName);
    }
}
