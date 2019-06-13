<!--
Copyright 2017 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Performance Testing of Gaffer on AWS

The CloudFormation template and scripts in this directory can be used to deploy AWS infrastructure to test the ingest and query performance of a Gaffer graph backed by an Accumulo store.

The template:

* deploys an Accumulo instance onto an AWS EMR cluster (using Apache Slider) and configures it so that it can be used as a Gaffer store
* uses the [AccumuloElementIngestTest](../../../../performance-testing/performance-testing-accumulo-store/src/main/java/uk/gov/gchq/gaffer/accumulostore/performancetesting/ingest/AccumuloElementIngestTest.java) utility to generate some suitable split points for the Accumulo table Gaffer will use
* deploys [ElementIngestTest](../../../../performance-testing/performance-testing-core/src/main/java/uk/gov/gchq/gaffer/performancetesting/ingest/ElementIngestTest.java) inside an EC2 Auto Scaling group to randomly generate data to be ingested into the Gaffer graph
* deploys [QueryTest](../../../../performance-testing/performance-testing-core/src/main/java/uk/gov/gchq/gaffer/performancetesting/query/QueryTest.java) inside an EC2 Auto Scaling group to randomly issue queries against the Gaffer graph
* installs [PublishAccumuloMetricsToCloudWatch](../../../../performance-testing/performance-testing-aws/src/main/java/uk/gov/gchq/gaffer/performancetesting/aws/PublishAccumuloMetricsToCloudWatch.java) onto the EMR master node
* generates a CloudWatch Dashboard to display EC2, EMR, Accumulo and Gaffer metrics
