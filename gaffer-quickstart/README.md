# Gaffer Quickstart #

Gaffer quickstart is a self-contained application that lets you quickly deploy a Gaffer stack by running a couple of scripts. 

It can be deployed either locally using mini-accumulo or distributed on AWS-EMR.

## Start Gaffer in local mode with the example data ##

This will run a Gaffer-accumulo instance on your local machine with a small example graph set up and some data you can load and query.

### Build and install ###

 1. `mvn clean install`. This will create a tarball in the `gaffer-quickstart-release-VERSION` directory in the gaffer-quickstart module.
 2. Unpack the tarball somewhere: `tar -xvf gaffer-release-VERSION.tar.gz`
 3. Set your `GAFFER_HOME` environment variable (e.g. in your `bash_profile` ) to point to wherever you unpacked the tarball.


Some example data is included in the project. You'll find it in `$GAFFER_HOME/example/data.csv`.

The data format is `source, destination, timestamp`. 

Also in the example folder you'll find a Gaffer schema, graph config and element generator. These files are the configuration for the example Gaffer graph and are automatically loaded when you start the services.

### Start the Gaffer services ###

Run `$GAFFER_HOME/bin/startup.sh`. 

This will start Gaffer with the rest service and UI running. After a few seconds, the UI will be on http://localhost:8080/ui and the rest service will be on http://localhost:8080/rest

Logging for Gaffer will be in `$GAFFER_HOME/gaffer.log`

### Load the example data ###

Run the following command in a terminal, replacing GAFFER_HOME with whatever your `$GAFFER_HOME` environment variable is set to (e.g. `/home/me/gaffer`)

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 
       "class": "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromCsv", 
       "filename": "GAFFER_HOME/example/data.csv",
       "mappingsFile": "GAFFER_HOME/example/element-generator.json" 
     }' 'http://localhost:8080/rest/v2/graph/operations/execute'
```

The mappings file tells Gaffer how to convert the csv data into graph edges and entities (more details to come)

##### Check the data is there #####

Run this command in a terminal

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
       "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
       "input": [ 
         { 
           "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed", 
           "vertex": "4"
         } 
       ] 
     }' 'http://localhost:8080/rest/v2/graph/operations/execute'
```

and you should see output that starts something like this

```
[{"class":"uk.gov.gchq.gaffer.data.element.Entity","group":"Emitter","vertex":"4","properties":{"timestamps":{"uk.gov.gchq.gaffer.time.RBMBackedTimestampSet":{"earliest":1254192988.000000000,"latest":1259186573.000000000,"numberOfTimestamps":24,"timeBucket":"SECOND","timestamps":[1254192988.000000000,1254194656.000000000,1254717913.000000000,1254819481.000000000,1254820005.000000000,1254942143.000000000,1255311564.000000000,1256302286.000000000,1256684529.000000000,1256685242.000000000,1256686062.000000000,1256686469.000000000,1256695725.000000000,1256783048.000000000,1256784708.000000000,1256854137.000000000,1256856267.000000000,1256856764.000000000,1256856825.000000000,1256867716.000000000,1256868481.000000000,1257092305.000000000,1258717389.000000000,1259186573.000000000]}},"count":{"java.lang.Long":25},"messagesSentEstimate":{"com.clearspring.analytics.stream.cardinality.HyperLogLogPlus":{"hyperLogLogPlus":{"hyperLogLogPlusSketchBytes":"/////gUFARF9foICgAd8hAP+AYIBgAH+AXp8jAH8AYQC+gGEAQ==","cardinality":24}}},"messagesReceivedEstimate":{"c
```

### Shutting down ###

Run `$GAFFER_HOME/bin/shutdown.sh`

## Deploy a Gaffer-Accumulo instance on AWS with the REST service and UI running ##

### Build and copy to S3 ###

 1. `mvn clean install`. This will create a folder structure like this `gaffer-quickstart-release-VERSION/gaffer-quickstart-VERSION/gaffer-quickstart-VERSION/example` etc. in the gaffer-quickstart module.
 2.  Copy the contents of the `gaffer-quickstart-VERSION` directory into an S3 bucket. So you have `s3://myBucket/gaffer-quickstart-VERSION/example` etc. 
 
This directory contains a set of bootstrap scripts and steps for deploying Gaffer-Accumulo on AWS and some gaffer config for an example graph. 
 
### Deploy on AWS-EMR ###

_Cloudformation templates coming soon_

This has been tested on EMR version 5.17.0

On the AWS web console create a new EMR cluster with the following options:

 - Choose Hadoop, ZooKeeper and Spark from the Software Configuration menu
 - Add these custom Jar steps, using the [scriptrunner](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hadoop-script.html) for your region, e.g. `s3://YOUR_REGION.elasticmapreduce/libs/script-runner/script-runner.jar`
  1. `s3://YOUR_BUCKET/gaffer-quickstart-VERSION/scripts/step/1-install-gaffer-quickstart.sh -s3 s3://gaffer-quickstart`
  2. `s3://YOUR_BUCKET/gaffer-quickstart-VERSION/scripts/step/2-deploy-gaffer.sh -cu 50`
  3. `s3://YOUR_BUCKET/gaffer-quickstart-VERSION/scripts/step/3-deploy-rest-ui-tomcat.sh`
 - For the master node choose `m3.xlarge`
 - For the data nodes choose `m3.2xlarge`
 - For the bootstrap actions, the following `custom action` is required to install gaffer:
  1. For JAR location enter `s3://YOUR_BUCKET/gaffer-quickstart-VERSION/scripts/bootstrap/0-install-gaffer-slider.sh`
  2. For Optional Arguments enter `s3://YOUR_BUCKET/gaffer-quickstart-VERSION/scripts/gaffer-slider -a 1.8.1`
  
When the cluster is up the gaffer UI and REST service will be available on port 8085.

### Adding the example data ###

To access the UI and REST service from your local machine, you'll need to open an SSH tunnel to the cluster and forward port 8085.

For example: `ssh -i $pem -L 8080:$host:8085 -D 8157 hadoop@$host`

where `$pem` is your pem file for accessing the cluster and `$host` is the cluster's master public dns name.

Then the UI will be on `http://localhost:8080/ui` and the REST service on `http://localhost:8080/rest`

You can add the example data over rest using the AddElementsFromCsv operation
 
```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 
       "class": "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromCsv", 
       "filename": "/home/hadoop/data.csv",
       "mappingsFile": "/home/hadoop/element-generator.json" 
     }' 'http://localhost:8080/rest/v2/graph/operations/execute'
```

And check that it's in the graph

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
       "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
       "input": [ 
         { 
           "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed", 
           "vertex": "4"
         } 
       ] 
     }' 'http://localhost:8080/rest/v2/graph/operations/execute'
```