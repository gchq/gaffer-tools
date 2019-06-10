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

package uk.gov.gchq.gaffer.performancetesting.aws;

import com.amazonaws.services.cloudwatch.AmazonCloudWatch;
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClientBuilder;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.cloudwatch.model.MetricDatum;
import com.amazonaws.services.cloudwatch.model.PutMetricDataRequest;
import com.amazonaws.services.cloudwatch.model.PutMetricDataResult;
import com.amazonaws.services.cloudwatch.model.StandardUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.performancetesting.Metrics;
import uk.gov.gchq.gaffer.performancetesting.MetricsListener;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;

public class CloudWatchMetricsListener implements MetricsListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(CloudWatchMetricsListener.class);

    public static final String NAMESPACE_PROP = "gaffer.performancetesting.cloudwatchmetricslistener.namespace";
    public static final String DIMENSION_PROP_PREFIX = "gaffer.performancetesting.cloudwatchmetricslistener.dimensions.";
    public static final String DIMENSION_PROP_NAME_SUFFIX = ".name";
    public static final String DIMENSION_PROP_VALUE_SUFFIX = ".value";

    private AmazonCloudWatch cloudwatch = null;
    private String namespace = null;
    private List<Dimension> dimensions = new ArrayList<>();

    @Override
    public void initialise(final Properties properties) {
        if (!properties.containsKey(NAMESPACE_PROP)) {
            throw new IllegalArgumentException("Properties should contain the CloudWatch namespace that the metrics should be pushed to (" + NAMESPACE_PROP + ")");
        }

        this.namespace = properties.getProperty(NAMESPACE_PROP);

        // Up to 10 dimensions can be assigned to each CloudWatch metric:
        // http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension
        for (int i = 1; i <= 10; i++) {
            final String dimensionNameProperty = DIMENSION_PROP_PREFIX + i + DIMENSION_PROP_NAME_SUFFIX;
            final String dimensionValueProperty = DIMENSION_PROP_PREFIX + i + DIMENSION_PROP_VALUE_SUFFIX;

            if (properties.containsKey(dimensionNameProperty) && properties.containsKey(dimensionValueProperty)) {
                this.dimensions.add(
                    new Dimension()
                        .withName(properties.getProperty(dimensionNameProperty))
                        .withValue(properties.getProperty(dimensionValueProperty))
                );
            }
        }

        this.cloudwatch = AmazonCloudWatchClientBuilder.defaultClient();
    }

    @Override
    public void update(final Metrics metrics) {
        List<MetricDatum> cloudwatchMetrics = new ArrayList<>();

        Date now = new Date();

        for (final String name : metrics.getMetricNames()) {
            Object value = metrics.getMetric(name);

            if (value instanceof Double) {
                cloudwatchMetrics.add(
                    new MetricDatum()
                        .withMetricName(name)
                        .withValue((double) value)
                        .withUnit(StandardUnit.CountSecond)
                        .withTimestamp(now)
                        .withDimensions(this.dimensions)
                );
            }
        }

        if (cloudwatchMetrics.size() > 0) {
            PutMetricDataResult response = this.cloudwatch.putMetricData(
                new PutMetricDataRequest()
                    .withNamespace(this.namespace)
                    .withMetricData(cloudwatchMetrics)
            );

            LOGGER.info(
                "AWS CloudWatch responseCode: {} requestId: {}",
                response.getSdkHttpMetadata().getHttpStatusCode(),
                response.getSdkResponseMetadata().getRequestId()
            );
        }
    }

    @Override
    public void close() {
        if (this.cloudwatch != null) {
            this.cloudwatch.shutdown();
            this.cloudwatch = null;
        }
    }

}
