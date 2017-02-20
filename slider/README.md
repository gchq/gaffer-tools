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

# gaffer-slider

gaffer-slider is an application package for [Apache Slider](https://slider.incubator.apache.org) which allows Gaffer instances to be deployed onto [YARN](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/index.html) managed clusters.

It is to be deployed in conjunction with the [Accumulo application package](https://github.com/apache/incubator-slider/tree/develop/app-packages/accumulo) or the [HBase application package](https://github.com/apache/incubator-slider/tree/develop/app-packages/hbase). It ensures that the [server-side code required](https://github.com/gchq/Gaffer/wiki/Accumulo-Store-User-Guide#accumulo-set-up) by Gaffer to provide functionality such as aggregation and filtering at ingest and query time is made available to each Accumulo tablet server / HBase region server.

The package's behaviour can be altered using the following configuration properties. These should be added to the application instance's configuration file (appConfig.json).

| Property Name              | Type    | Description |
| -------------------------- | ------- | ----------- |
| gaffer.deploy.package.jars | boolean | If true, then the Gaffer JARs contained inside this package will be deployed (default: true) |
| gaffer.deploy.hdfs.jars    | string  | Can be used to specify a directory in HDFS that JARs should be copied from. Useful if you are making changes to Gaffer's server-side code as it makes it easy to deploy the changes without having to re-build this package. |


## Why deploy Gaffer using Slider?

Although there are a few different ways to deploy Gaffer, deploying instances onto a cluster using Slider provides the following benefits:

* any user can deploy Gaffer instances, not just administrators
* multiple instances can easily be deployed and run at the same time
* different users / applications can run different versions of Gaffer
* each instance can be configured differently
* users control when instances are started, stopped, upgraded etc
* the number of Accumulo tablet servers / HBase region servers can be scaled up and down (a.k.a flexed) during runtime
* users can have root access to their Accumulo / HBase instance
* failed Accumulo / HBase components are detected and automatically restarted by Slider
* YARN's monitoring is leveraged to detect and recover from container and node failures - restarting failed containers and, in the case of failed nodes, migrating containers to other nodes in the cluster


## Quick Start

Use the following instructions to quickly deploy a Gaffer instance. It will deploy the latest stable version of Gaffer onto an Accumulo instance (version determined by [Gaffer's pom.xml](https://github.com/gchq/Gaffer/search?q=path%3A%2F+filename%3Apom.xml+"accumulo.version")) called `$USER-gaffer-test`.

```
# Edit the files in the scripts/conf directory to match your cluster configuration
mvn clean package
scripts/deploy_accumulo_cluster.sh
```


## Building

The versions of Gaffer, Accumulo and HBase that are deployed, and the version of Slider that is used to do the deployment can be overridden on the command line. By default the gaffer-slider package is only built to support the deployment of Gaffer onto Accumulo. Maven profiles (called `accumulo` and `hbase` can be used to add and remove support for different stores.

```
mvn clean package \
  -Paccumulo,hbase \
  -Dgaffer.version=<gafferVersion> \
  -Daccumulo.version=<accumuloVersion> \
  -Dhbase.version=<hbaseVersion> \
  -Dslider.version=<sliderVersion>
```


## Deploying

Deploying a Gaffer instance onto a YARN managed cluster requires:

* A distribution of Slider
* An Accumulo / HBase application package
* A build of this gaffer-slider add-on package
* Configuration for the instance (appConfig.json and resources.json)

Distributions of Slider can be [downloaded from Maven Central](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22org.apache.slider%22%20AND%20a%3A%22slider-assembly%22), or [built from source](https://slider.incubator.apache.org/docs/getting_started.html#build). Slider needs to be configured with the location of the YARN Resource Manager and the ZooKeeper quorum for the cluster it will be deploying to. It will try to read these from `$HADOOP_CONF_DIR`, otherwise ensure that the `yarn.resourcemanager.address` and `hadoop.registry.zk.quorum` properties are set in `<slider>/conf/slider-client.xml`.

Pre-built Accumulo and HBase application packages are not currently released so must be built from source. For Accumulo, [follow these instructions](https://github.com/apache/incubator-slider/blob/develop/app-packages/accumulo/README.md) or [use this script](scripts/build_accumulo_package.sh). For HBase, [follow these instructions](https://github.com/apache/incubator-slider/blob/develop/app-packages/hbase/README.md) or [use this script](scripts/build_hbase_package.sh).

Two JSON files are used to configure how an instance of a Slider application is deployed and executed. `appConfig.json` is used to specify the configuration that is to be applied to the application after it has been installed, and before it is executed. `resources.json` is used to specify the resources that Slider should request for each container from YARN. Example configuration files for deploying a Gaffer instance on Accumulo can be found in [scripts/conf/accumulo/](scripts/conf/accumulo/), and example configuration for deploying on HBase in [scripts/conf/hbase/](scripts/conf/hbase/). Take care to ensure that if the amount of memory requested for any of the containers is changed, then the appropriate application configuration is also updated (i.e. increasing the heap size property for a component to take advantage of additional memory being available, or reducing the heap size to ensure the component runs within the new limit). Refer to [Slider's documentation](https://slider.incubator.apache.org/docs/configuration/index.html) for full details on how these configuration files are used and what properties can be set.

A Gaffer instance can then be deployed using the following command:

```
slider create <gafferInstanceName> \
	--appdef <slider-accumulo/hbase-app-package.zip> \
	--addon Gaffer <gaffer-slider.zip> \
	--template <appConfig.json> \
	--resources <resources.json>
```

**NB:** If this is the first time you have deployed a Slider Accumulo application with this particular instance name then you will be prompted for 3 different passwords. Please ensure that the password you enter for `trace.token.property.password` is the same as the one you provide for `root.initial.password`.

See the [Slider documentation](https://slider.incubator.apache.org/docs/getting_started.html#installapp) for commands that can be used to start, stop, delete, grow, shrink and upgrade running applications.
