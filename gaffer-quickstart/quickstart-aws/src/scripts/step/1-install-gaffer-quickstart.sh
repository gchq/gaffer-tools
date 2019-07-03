#!/bin/bash -e

S3_BUCKET=
SCHEMA_PATH=
GRAPHCONFIG_PATH=
STORE_PROPERTIES_PATH=
REST_STORE_PROPERTIES_PATH=
UI_CONFIG=

usage="usage: -s3, -schema, -graphconfig, -storeproperties, -restproperties, -ui-config"


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
    SCHEMA_PATH="$2"
    shift # past argument
    ;;
    -graphconfig)
    GRAPHCONFIG_PATH="$2"
    shift # past argument
    ;;
    -storeproperties)
    STORE_PROPERTIES_PATH="$2"
    shift # past argument
    ;;
    -restproperties)
    REST_STORE_PROPERTIES_PATH="$2"
    shift # past argument
    ;;
    -ui-config)
    UI_CONFIG_PATH="$2"
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

ENV_FILE_LOCATION_S3=$S3_BUCKET/gaffer-quickstart/env/env.sh

ENV_FILE=${HOME}/env.sh



cd $HOME

aws s3 cp $ENV_FILE_LOCATION_S3 $ENV_FILE

source $ENV_FILE

mkdir $GAFFER_CONFIG_DIR

if [[ -z "${SCHEMA_PATH}" ]];
then
    SCHEMA_PATH=$S3_BUCKET/gaffer-quickstart/example/schema.json
fi

if [[ -z "${GRAPHCONFIG_PATH}" ]];
then
    GRAPHCONFIG_PATH=$S3_BUCKET/gaffer-quickstart/example/graphconfig.json
fi

if [[ -z "${STORE_PROPERTIES_PATH}" ]];
then
    STORE_PROPERTIES_PATH=$S3_BUCKET/gaffer-quickstart/example/accumulo-store.properties
fi


if [[ -z "${REST_STORE_PROPERTIES_PATH}" ]];
then
    REST_STORE_PROPERTIES_PATH=$S3_BUCKET/gaffer-quickstart/example/rest-store.properties
fi

if [[ -z "${UI_CONFIG_PATH}" ]];
then
    UI_CONFIG_PATH=$S3_BUCKET/gaffer-quickstart/example/ui-config.json
fi

aws s3 cp $S3_BUCKET/gaffer-quickstart/lib/gaffer-quickstart-full.jar .
echo -e "JAR_FILE_PATH=${HOME}/gaffer-quickstart-full.jar" >> $ENV_FILE

hadoop fs -mkdir gaffer-libs
hadoop fs -put $HOME/gaffer-quickstart-full.jar $GAFFER_LIBS_HDFS
echo -e "JAR_FILE_PATH_HDFS=${GAFFER_LIBS_HDFS}/gaffer-quickstart-full.jar" >> $ENV_FILE

REST_WAR_PATH=$S3_BUCKET/gaffer-quickstart/lib/quickstart-rest-${QUICKSTART_VERSION}.war
UI_WAR_PATH=$S3_BUCKET/gaffer-quickstart/lib/quickstart-ui-${QUICKSTART_VERSION}.war

echo -e "adding $SCHEMA_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $SCHEMA_PATH "$GAFFER_CONFIG_DIR/schema.json"
SCHEMA_FILE="$GAFFER_CONFIG_DIR/schema.json"
#SCHEMA_FILE=$GAFFER_CONFIG_DIR${SCHEMA_PATH##*/}
echo -e "GAFFER_SCHEMA=${SCHEMA_FILE}" >> $ENV_FILE

echo -e "adding $GRAPHCONFIG_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $GRAPHCONFIG_PATH "$GAFFER_CONFIG_DIR/graphconfig.json"
GRAPHCONFIG_FILE="$GAFFER_CONFIG_DIR/graphconfig.json"
#GRAPHCONFIG_FILE=$GAFFER_CONFIG_DIR${GRAPHCONFIG_PATH##*/}
echo -e "GAFFER_GRAPHCONFIG=${GRAPHCONFIG_FILE}" >> $ENV_FILE

echo -e "adding $STORE_PROPERTIES_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $STORE_PROPERTIES_PATH $GAFFER_CONFIG_DIR
STORE_PROPERTIES_FILE=$GAFFER_CONFIG_DIR${STORE_PROPERTIES_PATH##*/}
echo -e "GAFFER_STOREPROPERTIES=${STORE_PROPERTIES_FILE}" >> $ENV_FILE

echo -e "adding $REST_STORE_PROPERTIES_PATH to $GAFFER_CONFIG_DIR"
aws s3 cp $REST_STORE_PROPERTIES_PATH $GAFFER_CONFIG_DIR
REST_STORE_PROPERTIES_FILE=$GAFFER_CONFIG_DIR${REST_STORE_PROPERTIES_PATH##*/}
echo -e "GAFFER_REST_STOREPROPERTIES=${REST_STORE_PROPERTIES_FILE}" >> $ENV_FILE

echo -e "copying rest war file"
aws s3 cp $REST_WAR_PATH ${HOME}
REST_WAR=$HOME/${REST_WAR_PATH##*/}
echo -e "REST_WAR=${REST_WAR}" >> $ENV_FILE

echo -e "copying ui war file"
aws s3 cp $UI_WAR_PATH ${HOME}
UI_WAR=$HOME/${UI_WAR_PATH##*/}
echo -e "UI_WAR=${UI_WAR}" >> $ENV_FILE

echo -e "copying ui config"
aws s3 cp $UI_CONFIG_PATH "${GAFFER_CONFIG_DIR}/ui-config.json"
UI_CONFIG="${GAFFER_CONFIG_DIR}/ui-config.json"
#UI_CONFIG=$GAFFER_CONFIG_DIR${UI_CONFIG_PATH##*/}
echo -e "UI_CONFIG=${UI_CONFIG}" >> $ENV_FILE

mkdir ${HOME}/example
aws s3 cp $S3_BUCKET/gaffer-quickstart/example/ $HOME/example/ --recursive

hadoop fs -put /home/hadoop/example/data.csv example_data.csv


