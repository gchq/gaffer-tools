#!/bin/bash -e

QUICKSTART_VERSION="1.8.4-SNAPSHOT"
GAFFER_SLIDER_VERSION="1.8.3"
GAFFER_VERSION="1.8.3"

CLUSTER_USAGE="50"
ACCUMULO_VERSION="1.8.1"
INSTANCE_NAME="quickstart"
REST_PORT="8085"
TOMCAT_URL=https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.17/bin/apache-tomcat-9.0.17.tar.gz
GAFFER_LIBS_HDFS=gaffer-libs/
GAFFERPY_VERSION="1.8.4-SNAPSHOT"
GAFFER_CONFIG_DIR="/home/hadoop/gaffer-config/"

REST_OPERATION_DECLARATIONS="sparkAccumuloOperationsDeclarations.json,/home/hadoop/example/quickstartOperationDeclarations.json"
STORE_OPERATION_DECLARATIONS="sparkAccumuloOperationsDeclarations.json,/home/hadoop/example/quickstartOperationDeclarations.json,/home/hadoop/pySparkAccumuloOperationsDeclarations.json"
SPARK_MASTER="yarn"
SPARK_LOADER_JAR="/home/hadoop/gaffer-quickstart-full.jar"
SPARK_HOME="/usr/lib/spark"
