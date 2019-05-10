# Gaffer Migration Testing on AWS

This test ensures that data ingested into a Gaffer instance can still be accessed after the underlying store has been upgraded to a new version of Gaffer. It also checks that the instance continues to return the same query results as before the upgrade.

The migration test is run by deploying a CloudFormation template on AWS, which:

* deploys an instance of Gaffer \(version A\), backed by an Accumulo store, onto an AWS EMR cluster
* generates Gaffer elements for the Road Traffic Counts \(sampled\) data set and ingests them into the Accumulo store
* provisions a web server instance to host the REST API \(version A\), configuring it to talk to the Accumulo store
* runs a series of queries via the REST API to check Gaffer returns the expected results
* runs an [EMR step script](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/deployment/aws/tests/migration-tests/emr-step-scripts/upgrade-gaffer-instance.sh) to perform the [Accumulo store migration actions](https://gchq.github.io/gaffer-doc/stores/accumulo-store.html#migration) to upgrade the Gaffer instance to version B \(updating the Gaffer jars on the Accumulo classpath, updating the graph schema, updating the Gaffer iterators on the graph's table etc\)
* provisions a new web server instance to host version B of the REST API
* re-runs the set of queries via the new REST API to check that the Gaffer instance continues to return the same results

