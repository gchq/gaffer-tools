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

# Gaffer on AWS

This directory contains CloudFormation templates and scripts that can be used to deploy Gaffer instances onto
infrastructure provided by [AWS](https://aws.amazon.com).

| Template Name     | Description |
| ----------------- | ----------- |
| gaffer-slider-emr | Provisions an EMR cluster and runs a step script that deploys the [Gaffer Slider Application Package](../../../slider/) to spin up a Gaffer instance. |
| gaffer-user       | Runs a step script to create a new user on an existing Gaffer EMR cluster. |
| gaffer-web        | Provisions an EC2 instance which runs the Gaffer REST API and web UI. Requires an existing Gaffer EMR cluster to retrieve data from. |
| gaffer-with-user  | Combines 'gaffer-slider-emr' and 'gaffer-user' to provision a new Gaffer instance on EMR with a user. |
| gaffer-with-web   | Combines 'gaffer-slider-emr', 'gaffer-user' and 'gaffer-web' to provision a new Gaffer instance on EMR with a user and a web server hosting the REST API and web UI. |

These templates can be uploaded to the [CloudFormation web console](https://console.aws.amazon.com/cloudformation) or,
if you have the [AWS Command Line Interface](https://aws.amazon.com/cli/) installed, you can use the deployment scripts
in this directory. They can also be nested inside your own CloudFormation templates as part of a larger application.
