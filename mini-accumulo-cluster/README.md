# README

Copyright 2016 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Gaffer Mini Accumulo Cluster

This project allows you to easily spin up a mini accumulo cluster. There are two options 1. Run a Cluster with a Shell as one program \(cluster-with-shell\) 2. Run the cluster separately and open shells as required. \(cluster and shell working together\)

### cluster-with-shell

To use run MiniAccumuloClusterWithShellController.main\(\) It doesn't require any arguments, however the following can be used: \[directory\_name\] \[is\_temp\_directory\] \[root\_password\] \[instance\_name\]

Can be run directly in your IDE

or

Can be built using 'mvn package' and run from the command line using:

```bash
java -cp target/mini-accumulo-cluster-*-jar-with-dependencies.jar uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterWithShellController
```

When starting up it will print out something similar to:

```
Cluster started:
    Location - <directory-started-in>miniAccumuloCLuster
    Zookeepers - localhost:<random port number>
    Instance name - instance
```

It will also create a store.properties file for you in the cluster directory. This can be used for connecting to the cluster via a Gaffer Accumulo store. Once running it will open an Accumulo shell. You can users from the shell if required. To stop, enter the 'quit' command in the accumulo shell.

### cluster

This requires the same arguments as the cluster-with-shell, but it will not open a shell. It will monitor a file called shutdown within its directory. Once that file is created, it shuts down the cluster. This allows external scripts to close the cluster, they can simply 'touch $MINIACCUMULODIR/shutdown' To run from command line, for example

```bash
java -cp target/mini-accumulo-cluster-*-jar-with-dependencies.jar uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController ~/miniAccumuloCluster false password instance
```

It may be necessary to add other libraries to the accumulo classpath, to allow things like Gaffer to work. In this case you can use the following command to add libraries to the classpath.

```bash
java -cp target/mini-accumulo-cluster-*-jar-with-dependencies.jar:otherFile1.jar:otherFile2.jar uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController ~/miniAccumuloCluster false password instance
```

### shell

This can be run in one of two ways

1. Open an interactive shell
2. Open a shell, run commands from a file, quit the shell

In either case, the first argument must be the store.properties filename created by the cluster. In the second case, add another argument that points to the file containing the commands to run.

```bash
java -cp target/mini-accumulo-cluster-*-jar-with-dependencies.jar uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloShellController ~/miniAccumuloCluster/store.properties
```

