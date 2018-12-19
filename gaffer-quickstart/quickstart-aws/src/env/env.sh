#!/bin/bash -e

QUICKSTART_VERSION="1.7.0-RC3-SNAPSHOT"
GAFFER_SLIDER_VERSION="1.7.0"
GAFFER_VERSION="1.7.0-RC3-SNAPSHOT"

CLUSTER_USAGE="85"
ACCUMULO_VERSION="1.8.1"
INSTANCE_NAME="quickstart"
REST_PORT="8085"
TOMCAT_URL=http://apache.mirrors.nublue.co.uk/tomcat/tomcat-9/v9.0.13/bin/apache-tomcat-9.0.13.tar.gz
GAFFER_LIBS_HDFS=gaffer-libs/
GAFFERPY_VERSION="1.7.0-RC5-SNAPSHOT"
GAFFER_CONFIG_DIR="/home/hadoop/gaffer-config/"

REST_OPERATION_DECLARATIONS="sparkAccumuloOperationsDeclarations.json"
STORE_OPERATION_DECLARATIONS="sparkAccumuloOperationsDeclarations.json,home/hadoop/quickstartOperationDeclarations.json"
SPARK_MASTER="yarn"
SPARK_LOADER_JAR="/home/hadoop/quickstart-aws-jar-with-dependencies.jar"
SPARK_HOME="/usr/lib/spark"
