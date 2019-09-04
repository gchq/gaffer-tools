# README

Copyright 2017 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Gaffer Slider

gaffer-slider is an application package for [Apache Slider](https://slider.incubator.apache.org) which allows Gaffer instances to be deployed onto [YARN](https://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/index.html) managed clusters.

See [gaffer-tools/slider](https://github.com/gchq/gaffer-tools/tree/master/slider).

It is to be deployed in conjunction with the [Accumulo application package](https://github.com/apache/incubator-slider/tree/develop/app-packages/accumulo) and ensures that the [server-side code required](https://github.com/gchq/Gaffer/wiki/Accumulo-Store-User-Guide#accumulo-set-up) by Gaffer to provide functionality such as aggregation and filtering at ingest and query time is made available to each Accumulo tablet server.

It does this by injecting an additional installation step into the deployment of an Accumulo instance. In this extra step, it copies additional Gaffer JARs into the Accumulo installation, ensuring that they are available on Accumulo's class path. The package's behaviour can be altered using the following 2 configuration properties. These should be added to the application instance's configuration file \(appConfig.json\).

| Property Name | Type | Description |
| :--- | :--- | :--- |
| gaffer.deploy.package.jars | boolean | If true, then the Gaffer JARs contained inside this package will be deployed \(default: true\) |
| gaffer.deploy.hdfs.jars | string | Can be used to specify a directory in HDFS that JARs should be copied from. Useful if you are making changes to Gaffer's server-side code as it makes it easy to deploy the changes without having to re-build this package. |

### Why deploy Gaffer using Slider?

Although there are a few different ways to deploy Gaffer, deploying instances onto a cluster using Slider provides the following benefits:

* any user can deploy Gaffer instances, not just administrators
* multiple instances can easily be deployed and run at the same time
* different users / applications can run different versions of Gaffer
* each instance can be configured differently
* users control when instances are started, stopped, upgraded etc
* the number of Accumulo tablet servers can be scaled up and down \(a.k.a flexed\) during runtime
* users can have root access to their Accumulo instance
* failed Accumulo components are detected and automatically restarted by Slider
* YARN's monitoring is leveraged to detect and recover from container and node failures - restarting failed containers and, in the case of failed nodes, migrating containers to other nodes in the cluster

### Quick Start

Use the following instructions to quickly deploy a Gaffer instance. It will deploy the latest stable version of Gaffer onto an Accumulo instance \(version determined by \[Gaffer's pom.xml\]\([https://github.com/gchq/Gaffer/search?q=path%3A%2F+filename%3Apom.xml+"accumulo.version](https://github.com/gchq/Gaffer/search?q=path%3A%2F+filename%3Apom.xml+"accumulo.version)"\)\) called `$USER-gaffer-test`.

* Identify the profile in [src/test/clusters/](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/slider/src/test/clusters/README.md) that matches your cluster configuration, or create a new one
* `mvn clean package -Dtest.cluster.type=<profileName>`
* `scripts/deploy_test_cluster.sh`

### Building

The versions of Gaffer and Accumulo that are deployed, and the version of Slider that is used to do the deployment can be overridden on the command line:

```bash
mvn clean package \
  -Dgaffer.version=<gafferVersion> \
  -Daccumulo.version=<accumuloVersion> \
  -Dslider.version=<sliderVersion>
```

### Deploying

Deploying a Gaffer instance onto a YARN managed cluster requires:

* A distribution of Slider
* An Accumulo application package
* A build of this gaffer-slider add-on package
* Configuration for the instance \(appConfig.json and resources.json\)

The cluster being deployed to must be running HDFS, YARN and ZooKeeper.

Distributions of Slider can be [downloaded from Maven Central](http://search.maven.org/#search|gav|1|g%3A"org.apache.slider"%20AND%20a%3A"slider-assembly"), or [built from source](https://slider.incubator.apache.org/docs/getting_started.html#build). Slider needs to be configured with the location of the YARN Resource Manager and the ZooKeeper quorum for the cluster it will be deploying to. It will try to read these from `$HADOOP_CONF_DIR`, otherwise ensure that the `yarn.resourcemanager.address` and `hadoop.registry.zk.quorum` properties are set in `<slider>/conf/slider-client.xml`.

Pre-built Accumulo application packages are not currently released so must be built from source. [Follow these instructions](https://github.com/apache/incubator-slider/blob/develop/app-packages/accumulo/README.md) or [use this script](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/slider/scripts/build_accumulo_package.sh).

Two JSON files are used to configure how an instance of a Slider application is deployed and executed. `appConfig.json` is used to specify the configuration that is to be applied to the application after it has been installed, and before it is executed. `resources.json` is used to specify the resources that Slider should request for each container from YARN. Example configuration files for deploying a Gaffer instance can be found in [src/test/clusters/](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/slider/src/test/clusters/README.md). Take care to ensure that if the amount of memory requested for any of the containers is changed, then the appropriate Accumulo configuration is also updated \(i.e. increasing the heap size property for a component to take advantage of additional memory being available, or reducing the heap size to ensure the component runs within the new limit\). Refer to [Slider's documentation](https://slider.incubator.apache.org/docs/configuration/index.html) for full details on how these configuration files are used and what properties can be set.

A Gaffer instance can then be deployed using the following command:

```bash
slider create <gafferInstanceName> \
    --appdef <slider-accumulo-app-package.zip> \
    --addon Gaffer <gaffer-slider.zip> \
    --template <appConfig.json> \
    --resources <resources.json>
```

**NB:** If this is the first time you have deployed a Slider application with this particular instance name then you will be prompted for 3 different passwords. Please ensure that the password you enter for `trace.token.property.password` is the same as the one you provide for `root.initial.password`.

See the [Slider documentation](https://slider.incubator.apache.org/docs/getting_started.html#installapp) for commands that can be used to start, stop, delete, grow, shrink and upgrade running applications.

### Running Functional Tests

* Identify the profile in [src/test/clusters/](https://github.com/n288TJYRX/DemoUI/tree/58d1a9746fd85aed190666623298f7f05378af25/slider/src/test/clusters/README.md) that matches your cluster configuration, or create a new one
* `mvn verify -Paccumulo-funtest -Dtest.cluster.type=<profileName>`

