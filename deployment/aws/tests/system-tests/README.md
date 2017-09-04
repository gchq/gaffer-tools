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

# System Testing of Gaffer on AWS

The CloudFormation template in this directory:

* deploys an Accumulo instance onto an AWS EMR cluster (using Apache Slider) and configures it so that it can be used as a Gaffer store
* generates Gaffer elements for the Road Traffic Counts (sampled) data set and ingests them into the Accumulo store
* provisions a web server instance to host the REST API, configuring it to talk to the Accumulo store
* runs a series of queries via the REST API

Successful deployment of this template therefore provides some confidence that all the CloudFormation templates in this repository are capable of correctly deploying a functioning Gaffer instance.
