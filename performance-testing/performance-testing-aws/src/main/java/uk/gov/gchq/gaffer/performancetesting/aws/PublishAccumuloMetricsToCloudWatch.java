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
import com.amazonaws.services.cloudwatch.model.AmazonCloudWatchException;
import com.amazonaws.services.cloudwatch.model.Dimension;
import com.amazonaws.services.cloudwatch.model.MetricDatum;
import com.amazonaws.services.cloudwatch.model.PutMetricDataRequest;
import com.amazonaws.services.cloudwatch.model.PutMetricDataResult;
import com.amazonaws.services.cloudwatch.model.StandardUnit;
import org.apache.accumulo.core.client.ZooKeeperInstance;
import org.apache.accumulo.core.client.impl.MasterClient;
import org.apache.accumulo.core.client.impl.Tables;
import org.apache.accumulo.core.master.thrift.MasterClientService;
import org.apache.accumulo.core.master.thrift.MasterMonitorInfo;
import org.apache.accumulo.core.master.thrift.TableInfo;
import org.apache.accumulo.core.master.thrift.TabletServerStatus;
import org.apache.accumulo.core.trace.Tracer;
import org.apache.accumulo.core.util.Pair;
import org.apache.accumulo.server.AccumuloServerContext;
import org.apache.accumulo.server.conf.ServerConfigurationFactory;
import org.apache.thrift.TException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;

/*
 * This utility periodically collects metrics from an Accumulo Master and publishes them to AWS CloudWatch
 */
public class PublishAccumuloMetricsToCloudWatch implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(PublishAccumuloMetricsToCloudWatch.class);

    private final String instanceName;
    private final String zookeepers;
    private int interval = 60;

    private ZooKeeperInstance instance;
    private AccumuloServerContext context;
    private MasterClientService.Client client;
    private AmazonCloudWatch cloudwatch;

    private SortedMap<String, String> tableIdToNameMap;
    private Date previousCaptureDate = null;
    private Map<Pair<String, List<Dimension>>, Double> previousMetrics = null;

    public PublishAccumuloMetricsToCloudWatch(final String instanceName, final String zookeepers) {
        this.instanceName = instanceName;
        this.zookeepers = zookeepers;
    }

    public PublishAccumuloMetricsToCloudWatch(final String instanceName, final String zookeepers, final int interval) {
        this(instanceName, zookeepers);
        this.interval = interval;
    }

    private void connect() {
        // Connect to Accumulo Master
        this.instance = new ZooKeeperInstance(this.instanceName, this.zookeepers);
        ServerConfigurationFactory config = new ServerConfigurationFactory(this.instance);
        this.context = new AccumuloServerContext(config);
        this.client = MasterClient.getConnection(this.context);

        // Set up connection to AWS CloudWatch
        this.cloudwatch = AmazonCloudWatchClientBuilder.defaultClient();
    }

    private void disconnect() {
        if (this.cloudwatch != null) {
            this.cloudwatch.shutdown();
            this.cloudwatch = null;
        }
    }

    private String getTableNameForId(final String id) {
        if (this.tableIdToNameMap == null || !this.tableIdToNameMap.containsKey(id)) {
            // Refresh the cache as a table may have just been created
            this.tableIdToNameMap = Tables.getIdToNameMap(this.instance);
        }

        return this.tableIdToNameMap.get(id);
    }


    private List<MetricDatum> gatherMetrics() throws TException {
        final String awsEmrJobFlowId = AwsEmrUtils.getJobFlowId();

        final MasterMonitorInfo stats = this.client.getMasterStats(Tracer.traceInfo(), this.context.rpcCreds());
        LOGGER.trace(stats.toString());

        final Date now = new Date();
        final List<MetricDatum> metrics = new ArrayList<>();
        final Map<Pair<String, List<Dimension>>, Double> metricsToCache = new HashMap<>();

        // Master Metrics
        final List<Dimension> masterDimensions = new ArrayList<>();
        if (awsEmrJobFlowId != null) {
            masterDimensions.add(new Dimension().withName("EmrJobFlowId").withValue(awsEmrJobFlowId));
        }
        masterDimensions.add(new Dimension().withName("InstanceName").withValue(this.instanceName));

        metrics.addAll(this.generateCountMetricForEachDimensionCombination("TabletServerCount", (double) stats.getTServerInfoSize(), masterDimensions, now));
        metrics.addAll(this.generateCountMetricForEachDimensionCombination("BadTabletServerCount", (double) stats.getBadTServersSize(), masterDimensions, now));
        metrics.addAll(this.generateCountMetricForEachDimensionCombination("DeadTabletServerCount", (double) stats.getDeadTabletServersSize(), masterDimensions, now));
        metrics.addAll(this.generateCountMetricForEachDimensionCombination("ServersShuttingDownCount", (double) stats.getServersShuttingDownSize(), masterDimensions, now));
        metrics.addAll(this.generateCountMetricForEachDimensionCombination("TableCount", (double) stats.getTableMapSize(), masterDimensions, now));

        // Tablet Server Metrics
        for (final TabletServerStatus tserver : stats.getTServerInfo()) {
            // Trimming off the port from the tablet server name as (at the moment) we only deploy a single tablet server per YARN node
            // This makes it easier to locate the metrics in CloudWatch
            // @TODO: Make this optional via a command line flag?
            String tabletServerHostName = tserver.getName();
            if (tabletServerHostName.contains(":")) {
                tabletServerHostName = tabletServerHostName.substring(0, tabletServerHostName.lastIndexOf(':'));
            }

            final List<Dimension> tserverDimensions = new ArrayList<>();
            if (awsEmrJobFlowId != null) {
                tserverDimensions.add(new Dimension().withName("EmrJobFlowId").withValue(awsEmrJobFlowId));
            }
            tserverDimensions.add(new Dimension().withName("InstanceName").withValue(this.instanceName));
            tserverDimensions.add(new Dimension().withName("TabletServerName").withValue(tabletServerHostName));

            metrics.addAll(this.generateCountMetricForEachDimensionCombination("DataCacheRequests", (double) tserver.getDataCacheRequest(), tserverDimensions, now));
            metrics.addAll(this.generateCountMetricForEachDimensionCombination("DataCacheHits", (double) tserver.getDataCacheHits(), tserverDimensions, now));
            metrics.addAll(this.generateCountMetricForEachDimensionCombination("IndexCacheRequests", (double) tserver.getIndexCacheRequest(), tserverDimensions, now));
            metrics.addAll(this.generateCountMetricForEachDimensionCombination("IndexCacheHits", (double) tserver.getIndexCacheHits(), tserverDimensions, now));
            metrics.addAll(this.generateCountMetricForEachDimensionCombination("Lookups", (double) tserver.getLookups(), tserverDimensions, now));
            metrics.addAll(this.generateCountMetricForEachDimensionCombination("OsLoad", tserver.getOsLoad(), tserverDimensions, now));

            // Table Metrics
            for (final Map.Entry<String, TableInfo> tableEntry : tserver.getTableMap().entrySet()) {
                final String tableId = tableEntry.getKey();
                final TableInfo info = tableEntry.getValue();

                final String tableName = this.getTableNameForId(tableId);
                if (tableName != null) {
                    final List<Dimension> dimensions = new ArrayList<>();
                    if (awsEmrJobFlowId != null) {
                        dimensions.add(new Dimension().withName("EmrJobFlowId").withValue(awsEmrJobFlowId));
                    }
                    dimensions.add(new Dimension().withName("InstanceName").withValue(this.instanceName));
                    dimensions.add(new Dimension().withName("TableName").withValue(tableName));
                    dimensions.add(new Dimension().withName("TabletServerName").withValue(tabletServerHostName));

                    metrics.addAll(this.generateCountMetricForEachDimensionCombination("TabletCount", (double) info.getTablets(), dimensions, now));
                    metrics.addAll(this.generateCountMetricForEachDimensionCombination("OnlineTabletCount", (double) info.getOnlineTablets(), dimensions, now));
                    metrics.addAll(this.generateCountMetricForEachDimensionCombination("RecordCount", (double) info.getRecs(), dimensions, now));
                    metrics.addAll(this.generateCountMetricForEachDimensionCombination("RecordsInMemoryCount", (double) info.getRecsInMemory(), dimensions, now));
                    if (info.getScans() != null) {
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("ScansRunning", (double) info.getScans().getRunning(), dimensions, now));
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("ScansQueued", (double) info.getScans().getQueued(), dimensions, now));
                    }
                    if (info.getMinors() != null) {
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("MinorCompactionCount", (double) info.getMinors().getRunning(), dimensions, now));
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("MinorCompactionQueuedCount", (double) info.getMinors().getQueued(), dimensions, now));
                    }
                    if (info.getMajors() != null) {
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("MajorCompactionCount", (double) info.getMajors().getRunning(), dimensions, now));
                        metrics.addAll(this.generateCountMetricForEachDimensionCombination("MajorCompactionQueuedCount", (double) info.getMajors().getQueued(), dimensions, now));
                    }

                    // The 'IngestRate' metric reported by Accumulo updates every ~5 seconds, so generate our own
                    // version of the metric for our interval using 'RecordCount'. Note that our version is affected by
                    // MinC + MajC that reduce the number of records so -ve rates are possible!
                    final Pair<String, List<Dimension>> metricCacheKey = new Pair<>("RecordCount", dimensions);
                    if (this.previousMetrics != null && this.previousMetrics.containsKey(metricCacheKey)) {
                        final double change = (double) info.getRecs() - this.previousMetrics.get(metricCacheKey);
                        final double rate = change / ((now.getTime() - this.previousCaptureDate.getTime()) / 1000);
                        metrics.addAll(
                            this.generateMetricForEachDimensionCombination(
                                new MetricDatum()
                                    .withMetricName("CalculatedIngestRate").withValue(rate)
                                    .withUnit(StandardUnit.CountSecond).withTimestamp(now),
                                dimensions
                            )
                        );
                    }
                    metricsToCache.put(metricCacheKey, (double) info.getRecs());

                    metrics.addAll(
                        this.generateMetricForEachDimensionCombination(
                            new MetricDatum()
                                .withMetricName("IngestRate").withValue(info.getIngestRate())
                                .withUnit(StandardUnit.CountSecond).withTimestamp(now),
                            dimensions
                        )
                    );

                    metrics.addAll(
                        this.generateMetricForEachDimensionCombination(
                            new MetricDatum()
                                .withMetricName("IngestByteRate").withValue(info.getIngestByteRate())
                                .withUnit(StandardUnit.BytesSecond).withTimestamp(now),
                            dimensions
                        )
                    );

                    metrics.addAll(
                        this.generateMetricForEachDimensionCombination(
                            new MetricDatum()
                                .withMetricName("QueryRate").withValue(info.getQueryRate())
                                .withUnit(StandardUnit.CountSecond).withTimestamp(now),
                            dimensions
                        )
                    );

                    metrics.addAll(
                        this.generateMetricForEachDimensionCombination(
                            new MetricDatum()
                                .withMetricName("QueryByteRate").withValue(info.getQueryByteRate())
                                .withUnit(StandardUnit.BytesSecond).withTimestamp(now),
                            dimensions
                        )
                    );

                    metrics.addAll(
                        this.generateMetricForEachDimensionCombination(
                            new MetricDatum()
                                .withMetricName("ScanRate").withValue(info.getScanRate())
                                .withUnit(StandardUnit.CountSecond).withTimestamp(now),
                            dimensions
                        )
                    );
                }
            }
        }

        this.previousCaptureDate = now;
        this.previousMetrics = metricsToCache;

        return metrics;
    }

    private void publishMetrics(final List<MetricDatum> metrics) {
        LOGGER.info("Submitting " + metrics.size() + " metrics to CloudWatch");

        // CloudWatch throws InvalidParameterValue if a value has a high level of precision and is very close to 0
        for (final MetricDatum metric : metrics) {
            if (Math.abs(metric.getValue()) < 0.0001) {
                metric.setValue(0.0);
            }
        }

        // There's a limit on the AWS API which means only 20 metrics can be submitted at once!
        for (int i = 0; i < metrics.size(); i += 20) {
            final List<MetricDatum> metricBatch = metrics.subList(i, i + 20 > metrics.size() ? metrics.size() : i + 20);
            try {
                final PutMetricDataResult response = this.cloudwatch.putMetricData(
                    new PutMetricDataRequest()
                        .withNamespace("Accumulo")
                        .withMetricData(metricBatch)
                );

                LOGGER.debug(response.getSdkResponseMetadata().getRequestId());
            } catch (final AmazonCloudWatchException e) {
                LOGGER.error("Failed publishing the following metrics to CloudWatch: " + metricBatch, e);
            }
        }
    }

    private List<MetricDatum> generateCountMetricForEachDimensionCombination(final String name, final double value, final List<Dimension> dimensions, final Date tstamp) {
        return this.generateMetricForEachDimensionCombination(
            new MetricDatum()
                .withMetricName(name)
                .withValue(value)
                .withUnit(StandardUnit.Count)
                .withTimestamp(tstamp),
            dimensions
        );
    }

    private List<MetricDatum> generateMetricForEachDimensionCombination(final MetricDatum metric, final List<Dimension> dimensions) {
        final List<MetricDatum> metrics = new ArrayList<>();
        for (int i = 0; i < dimensions.size(); i++) {
            metrics.add(metric.clone().withDimensions(dimensions.subList(0, i + 1)));
        }
        return metrics;
    }

    public void run() {
        this.connect();

        boolean run = true;
        while (run) {
            long startTime = System.currentTimeMillis();

            try {
                final List<MetricDatum> metrics = this.gatherMetrics();
                this.publishMetrics(metrics);
            } catch (final TException e) {
                e.printStackTrace();
            }

            long finishTime = System.currentTimeMillis();
            long delay = (this.interval * 1000) - (finishTime - startTime);

            if (delay > 0) {
                try {
                    Thread.sleep(delay);
                } catch (final InterruptedException e) {
                    run = false;
                }
            }
        }

        this.disconnect();
    }

    public static void main(final String[] args) {
        if (args.length != 2) {
            System.err.println("Syntax: " + PublishAccumuloMetricsToCloudWatch.class.getSimpleName() + " <instanceName> <zookeepers>");
            System.exit(1);
        }

        final String instanceName = args[0];
        final String zookeepers = args[1];

        PublishAccumuloMetricsToCloudWatch metricCollection = new PublishAccumuloMetricsToCloudWatch(instanceName, zookeepers);
        metricCollection.run();
    }

}
