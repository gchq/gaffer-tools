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

import java.util.Properties;

/**
 * An implementation of this interface receives a {@link Metrics} object describing the current performance of a test.
 * It can then choose what to do with this information, e.g. store it in a file or database, or display it in a
 * dashboard.
 */
public interface MetricsListener {

    void initialise(Properties properties);

    void update(Metrics metrics);

    void close();
}
