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

This configuration profile can be used to deploy gaffer-slider onto a cluster provisioned by [Amazon's Elastic MapReduce (EMR)](https://aws.amazon.com/emr/).

When creating an EMR cluster, as a minimum, ensure you select the following software configuration:
* Hadoop
* ZooKeeper


## Running Integration Tests on AWS EMR

`deploy-gaffer-tests-on-emr.[sh|py]` can be used to run Gaffer's integration tests on an ephemeral AWS EMR cluster. They use the AWS API to provision a new EMR cluster with the software and configuration required to run the tests. Once the tests have run, the cluster will automatically terminate.

If the final status of the cluster is "Terminated" then all the integration tests passed successfully. If the final status is "Terminated with errors" the one, or more, of the tests failed.

The test output is stored in S3 so that it can be reviewed after the cluster has been terminated. The scripts will output the location that they have been written to.
