#!/bin/bash -e

QUICKSTART_VERSION="1.7.0-RC3-SNAPSHOT"
GAFFER_VERSION=$QUICKSTART_VERSION

S3_BUCKET=

usage="usage: -s3, -schema, -graphconfig, -storeproperties, -restproperties"


if [[ $# -lt 2 ]]; then
    echo $usage
    echo "not enough args, exiting..."
    exit 1
fi

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -s3)
    S3_BUCKET="$2"
    shift # past argument
    ;;
    -schema)
    $SCHEMA_PATH="$2"
    shift # past argument
    ;;
    -graphconfig)
    $GRAPHCONFIG_PATH="$2"
    shift # past argument
    ;;
    -storeproperties)
    $STORE_PROPERTIES_PATH="$2"
    shift # past argument
    ;;
    -restproperties)
    $REST_STORE_PROPERTIES_PATH="$2"
    shift # past argument
    ;;
    *)
            echo $usage
            echo "unknown args, exiting..."
            exit 1
    ;;
esac
shift # past argument or value
done

echo "working in "$HOME

SCHEMA_PATH=$S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/example/schema.json
GRAPHCONFIG_PATH=$S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/example/graphconfig.json
STORE_PROPERTIES_PATH=$S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/example/accumulo-store.properties
REST_STORE_PROPERTIES_PATH=$S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/example/rest-store.properties

cd $HOME

aws s3 cp $S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/scripts/0-env.sh .

ENV_FILE=$HOME/0-env.sh

echo -e "QUICKSTART_VERSION=${QUICKSTART_VERSION}" >> $ENV_FILE
echo -e "GAFFER_VERSION=${GAFFER_VERSION}" >> $ENV_FILE

source $ENV_FILE

aws s3 cp $S3_BUCKET/gaffer-quickstart-${QUICKSTART_VERSION}/lib/quickstart-aws-${QUICKSTART_VERSION}-jar-with-dependencies.jar .
echo -e "JAR_FILE_PATH=${HOME}/quickstart-aws-${QUICKSTART_VERSION}-jar-with-dependencies.jar" >> $ENV_FILE

GAFFER_LIBS_HDFS=gaffer-libs/
echo -e "GAFFER_LIBS_HDFS=${GAFFER_LIBS_HDFS}" >> $ENV_FILE
hadoop fs -mkdir gaffer-libs
hadoop fs -put $HOME/quickstart-aws-${QUICKSTART_VERSION}-jar-with-dependencies.jar $GAFFER_LIBS_HDFS
echo -e "JAR_FILE_PATH_HDFS=${GAFFER_LIBS_HDFS}/quickstart-aws-${QUICKSTART_VERSION}-jar-with-dependencies.jar" >> $ENV_FILE

GAFFER_CONFIG_DIR=$HOME/gaffer-config/

mkdir $GAFFER_CONFIG_DIR


echo -e "adding $SCHEMA_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $SCHEMA_PATH $GAFFER_CONFIG_DIR
SCHEMA_FILE=$GAFFER_CONFIG_DIR${SCHEMA_PATH##*/}
echo -e "GAFFER_SCHEMA=${SCHEMA_FILE}" >> $ENV_FILE

echo -e "adding $GRAPHCONFIG_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $GRAPHCONFIG_PATH $GAFFER_CONFIG_DIR
GRAPHCONFIG_FILE=$GAFFER_CONFIG_DIR${GRAPHCONFIG_PATH##*/}
echo -e "GAFFER_GRAPHCONFIG=${GRAPHCONFIG_FILE}" >> $ENV_FILE

echo -e "adding $STORE_PROPERTIES_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $STORE_PROPERTIES_PATH $GAFFER_CONFIG_DIR
STORE_PROPERTIES_FILE=$GAFFER_CONFIG_DIR${STORE_PROPERTIES_PATH##*/}
echo -e "GAFFER_STOREPROPERTIES=${STORE_PROPERTIES_FILE}" >> $ENV_FILE

echo -e "adding $REST_STORE_PROPERTIES_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $REST_STORE_PROPERTIES_PATH $GAFFER_CONFIG_DIR
REST_STORE_PROPERTIES_FILE=$GAFFER_CONFIG_DIR${REST_STORE_PROPERTIES_PATH##*/}
echo -e "GAFFER_REST_STOREPROPERTIES=${REST_STORE_PROPERTIES_FILE}" >> $ENV_FILE



