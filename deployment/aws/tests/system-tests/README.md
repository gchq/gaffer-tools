# System Testing of Gaffer on AWS

The CloudFormation template in this directory:

* deploys an Accumulo instance onto an AWS EMR cluster \(using Apache Slider\) and configures it so that it can be used as a Gaffer store
* generates Gaffer elements for the Road Traffic Counts \(sampled\) data set and ingests them into the Accumulo store
* provisions a web server instance to host the REST API, configuring it to talk to the Accumulo store
* runs a series of queries via the REST API

Successful deployment of this template therefore provides some confidence that all the CloudFormation templates in this repository are capable of correctly deploying a functioning Gaffer instance.

