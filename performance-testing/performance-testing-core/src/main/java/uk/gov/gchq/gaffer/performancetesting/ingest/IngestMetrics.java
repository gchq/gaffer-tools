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
package uk.gov.gchq.gaffer.performancetesting.ingest;

import uk.gov.gchq.gaffer.performancetesting.Metrics;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class IngestMetrics implements Metrics {
    public static final String ELEMENTS_PER_SECOND = "elements_per_second";
    private static final Set<String> METRIC_NAMES = Collections.unmodifiableSet(new HashSet<>(
            Arrays.asList(ELEMENTS_PER_SECOND)));
    private final Map<String, Double> metrics;

    public IngestMetrics(final double elementsPerSecond) {
        this.metrics = new HashMap<>();
        metrics.put(ELEMENTS_PER_SECOND, elementsPerSecond);
    }

    @Override
    public Set<String> getMetricNames() {
        return METRIC_NAMES;
    }

    @Override
    public Object getMetric(final String metricName) {
        return metrics.get(metricName);
    }

    public static String getElementsPerSecond() {
        return ELEMENTS_PER_SECOND;
    }
}
