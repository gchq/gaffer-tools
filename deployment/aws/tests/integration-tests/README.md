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

# Running Gaffer's Integration Tests on AWS

This directory contains CloudFormation templates and scripts that can be used to run Gaffer's store integration tests
against a Gaffer instance deployed onto infrastructure provided by [AWS](https://aws.amazon.com).

## Running via [Elastic MapReduce (EMR)](https://aws.amazon.com/emr/)

To deploy using the [AWS console](https://console.aws.amazon.com/elasticmapreduce) ensure that your EMR cluster:
* includes the following software:
  * Hadoop
  * ZooKeeper
* runs the following scripts using 'Custom Jar' steps with ``s3://elasticmapreduce/libs/script-runner/script-runner.jar``:
  * [deploy-gaffer-instance.sh](../../core/emr-step-scripts/deploy-gaffer-instance.sh)
  * /home/hadoop/slider-$INSTANCE_ID/create-accumulo-user.sh
  * [run-gaffer-integration-tests.sh](emr-step-scripts/run-gaffer-integration-tests.sh)

If you have the [AWS Command Line Interface](https://aws.amazon.com/cli/) installed, you can use the
[deploy-gaffer-integration-tests-via-emr.sh](deploy-gaffer-integration-tests-via-emr.sh) script instead. The EMR
cluster will auto-terminate once the tests have completed. If the final status of the cluster is "Terminated"
then all the integration tests passed successfully. If the final status is "Terminated with errors" then at least one
of the tests failed. The test output is stored in S3 so that it can be reviewed after the cluster has been terminated.
The script will output the location that they have been written to.

## Running via [CloudFormation](https://aws.amazon.com/cloudformation/)

The [gaffer-integration-tests.yaml](cloudformation/gaffer-integration-tests.yaml) template can be uploaded to the
[CloudFormation web console](https://console.aws.amazon.com/cloudformation). Alternatively, if you have the
[AWS Command Line Interface](https://aws.amazon.com/cli/) installed, you can use the
[deploy-gaffer-integration-tests-via-cloudformation.sh](deploy-gaffer-integration-tests-via-cloudformation.sh) script instead.
If the creation of the CloudFormation stack succeeds then all of the integration tests have successfully passed,
otherwise at least 1 of the tests have failed.
