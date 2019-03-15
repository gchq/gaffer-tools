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

import uk.gov.gchq.gaffer.commonutil.ToStringBuilder;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class FileWriterMetricsListener implements MetricsListener {
    public static final String FILENAME = "gaffer.performancetesting.filewritermetricslistener.filename";
    private String filename = null;
    private BufferedWriter writer = null;

    public FileWriterMetricsListener() {
    }

    @Override
    public void initialise(final Properties properties) {
        if (!properties.containsKey(FILENAME)) {
            throw new IllegalArgumentException("Properties should contain the filename to write to (property "
                    + FILENAME + ")");
        }
        filename = properties.getProperty(FILENAME);
        try {
            writer = new BufferedWriter(new FileWriter(filename));
        } catch (final IOException e) {
            throw new RuntimeException("IOException opening file", e);
        }
    }

    @Override
    public void update(final Metrics metrics) {
        try {
            int i = 0;
            for (final String metricName : metrics.getMetricNames()) {
                if (i > 0) {
                    writer.write(", ");
                }
                writer.write(metricName + ": " + metrics.getMetric(metricName));
                i++;
            }
            writer.write("\n");
        } catch (final IOException e) {
            throw new RuntimeException("IOException writing metrics to file", e);
        }
    }

    @Override
    public void close() {
        if (null != writer) {
            try {
                writer.close();
            } catch (final IOException e) {
                throw new RuntimeException("IOException closing file", e);
            }
        }
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("filename", filename)
                .build();
    }
}
