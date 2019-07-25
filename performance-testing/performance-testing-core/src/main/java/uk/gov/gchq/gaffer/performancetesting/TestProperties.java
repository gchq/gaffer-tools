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

import uk.gov.gchq.gaffer.randomelementgeneration.Constants;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class TestProperties extends Properties {
    private static final String GRAPH_ID = "gaffer.graph.id";
    private static final String METRICS_LISTENER_CLASS = "gaffer.performancetesting.metricsListener";
    private static final String BATCH_SIZE = "gaffer.performancetesting.batchSize";
    private static final String RMAT_PROBABILITIES = "gaffer.performancetesting.rmat.probabilities";
    private static final String RMAT_INCLUDE_ENTITIES = "gaffer.performancetesting.rmat.includeEntities";
    private static final String RMAT_MAX_NODEID = "gaffer.performancetesting.rmat.maxNodeId";

    public String getGraphId() {
        return getProperty(GRAPH_ID);
    }

    public void setGraphId(final String graphId) {
        setProperty(GRAPH_ID, graphId);
    }

    public String getMetricsListenerClass() {
        return getProperty(METRICS_LISTENER_CLASS);
    }

    public void setMetricsListenerClass(final String metricsListenerClass) {
        setProperty(METRICS_LISTENER_CLASS, metricsListenerClass);
    }

    public int getBatchSize() {
        return Integer.parseInt(getProperty(BATCH_SIZE));
    }

    public void setBatchSize(final long batchSize) {
        if (batchSize <= 0L) {
            throw new IllegalArgumentException("The batch size must be greater than 0.");
        }
        setProperty(BATCH_SIZE, "" + batchSize);
    }

    public double[] getRmatProbabilities() {
        if (null == getProperty(RMAT_PROBABILITIES)) {
            return Constants.RMAT_PROBABILITIES;
        }
        return stringToDoubleArray(getProperty(RMAT_PROBABILITIES));
    }

    public void setRmatProbabilities(final double[] rmatProbabilities) {
        if (rmatProbabilities == null || rmatProbabilities.length != 4) {
            throw new IllegalArgumentException("Probabilities should be non-null and of length 4.");
        }
        final double min = Arrays.stream(rmatProbabilities).min().getAsDouble();
        if (min <= 0.0) {
            throw new IllegalArgumentException("Every entry in probabilities must be strictly positive.");
        }
        final double sum = Arrays.stream(rmatProbabilities).sum();
        if (sum < 0.999999999 || sum > 1.00000001) {
            throw new IllegalArgumentException("The entries in probabilities must sum to 1.");
        }
        setProperty(RMAT_PROBABILITIES, doubleArrayToString(rmatProbabilities));
    }

    public boolean getRmatIncludeEntities() {
        return Boolean.parseBoolean(getProperty(RMAT_INCLUDE_ENTITIES));
    }

    public void setRmatIncludeEntities(final boolean includeEntities) {
        setProperty(RMAT_INCLUDE_ENTITIES, Boolean.toString(includeEntities));
    }

    public long getRmatMaxNodeId() {
        return Long.parseLong(getProperty(RMAT_MAX_NODEID));
    }

    public void setRmatMaxNodeId(final long maxNodeId) {
        setProperty(RMAT_MAX_NODEID, "" + maxNodeId);
    }

    private static String doubleArrayToString(final double[] values) {
        if (null == values) {
            throw new IllegalArgumentException("Cannot convert null array to a string");
        }
        final StringBuilder builder = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            builder.append(values[i]);
            builder.append(",");
        }
        return builder.substring(0, builder.length() - 1);
    }

    private static double[] stringToDoubleArray(final String s) {
        if (null == s) {
            throw new IllegalArgumentException("Cannot convert null string to an array of doubles");
        }
        final List<Double> values = new ArrayList<>();
        for (final String item : s.split(",")) {
            values.add(Double.parseDouble(item));
        }
        return values.stream().mapToDouble(Double::doubleValue).toArray();
    }

    public void loadTestProperties(final String pathStr) {
        loadTestProperties(Paths.get(pathStr));
    }

    public void loadTestProperties(final Path testPropertiesPath) {
        try {
            super.load(Files.newInputStream(testPropertiesPath));
        } catch (final IOException e) {
            throw new RuntimeException("Failed to load test properties file: " + e.getMessage(), e);
        }
    }
}
