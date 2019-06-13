This configuration profile can be used to deploy gaffer-slider onto a CDH 5 cluster.

As a minimum, your cluster should be running the following services:
* HDFS
* YARN
* ZooKeeper

Ensure that your cluster has Java 1.8 installed (required by Gaffer).
If `/etc/alternatives/jre_1.8.0/` does not point to the location of a Java 1.8 installation then update all the config files appropriately.

Update the `hadoop.registry.zk.quorum` property in `slider-client.xml` to point at the location of your ZooKeeper quorum.

