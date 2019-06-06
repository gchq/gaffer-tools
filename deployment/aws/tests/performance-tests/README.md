# Performance Testing of Gaffer on AWS

The CloudFormation template and scripts in this directory can be used to deploy AWS infrastructure to test the ingest and query performance of a Gaffer graph backed by an Accumulo store.

The template:

* deploys an Accumulo instance onto an AWS EMR cluster \(using Apache Slider\) and configures it so that it can be used as a Gaffer store
* uses the [AccumuloElementIngestTest](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/performance-testing/performance-testing-accumulo-store/src/main/java/uk/gov/gchq/gaffer/accumulostore/performancetesting/ingest/AccumuloElementIngestTest.java) utility to generate some suitable split points for the Accumulo table Gaffer will use
* deploys [ElementIngestTest](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/performance-testing/performance-testing-core/src/main/java/uk/gov/gchq/gaffer/performancetesting/ingest/ElementIngestTest.java) inside an EC2 Auto Scaling group to randomly generate data to be ingested into the Gaffer graph
* deploys [QueryTest](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/performance-testing/performance-testing-core/src/main/java/uk/gov/gchq/gaffer/performancetesting/query/QueryTest.java) inside an EC2 Auto Scaling group to randomly issue queries against the Gaffer graph
* installs [PublishAccumuloMetricsToCloudWatch](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/performance-testing/performance-testing-aws/src/main/java/uk/gov/gchq/gaffer/performancetesting/aws/PublishAccumuloMetricsToCloudWatch.java) onto the EMR master node
* generates a CloudWatch Dashboard to display EC2, EMR, Accumulo and Gaffer metrics

