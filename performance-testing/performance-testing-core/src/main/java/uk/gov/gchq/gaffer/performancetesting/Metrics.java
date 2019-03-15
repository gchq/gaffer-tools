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
package uk.gov.gchq.gaffer.performancetesting;

import java.util.SortedSet;

/**
 * An implementation of this interface contains information about the performance of a test. Each metric has a name
 * and a value. The name is just a {@link String} and the value can be any {@link Object}.
 */
public interface Metrics {

    SortedSet<String> getMetricNames();

    Object getMetric(String metricName);

    void putMetric(String metricName, Object metric);
}
