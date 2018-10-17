#!/bin/bash -e

ENV_FILE=$HOME/0-env.sh

source $ENV_FILE

usage="usage:  -cu, -av"

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -cu)
    CLUSTER_USAGE="$2"
    shift # past argument
    ;;
    -av)
    ACCUMULO_VERSION="$2"
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

homeDir=$HOME
echo "working in "$homeDir

cd $homeDir

#change slider appConfig to point at the right dir in hdfs for external gaffer libs
echo "doing unspeakable things with sed... pointing gaffer slider at the special gaffer libs in hdfs"
sudo sed -ie 's/\"gaffer.deploy.hdfs.jars\": \"hdfs:\/\/\/user\/${USER}\/gaffer-jars-${CLUSTER_NAME}\/\",/\"gaffer.deploy.hdfs.jars\" : \"hdfs:\/\/\/user\/hadoop\/${GAFFER_LIBS_HDFS}\/\",/g' /opt/gaffer/${GAFFER_VERSION}/appConfig-default.json

#install gaffer
/opt/gaffer/${GAFFER_VERSION}/deploy-gaffer-instance.sh -g $GAFFER_VERSION -a $ACCUMULO_VERSION -u $CLUSTER_USAGE $INSTANCE_NAME

#set up store properties
zookeeper=`hostname`
echo "doing more unspeakable things with sed... adding the zookeepers to the storeproperties file"
sed -ie 's/zookeepers=/zookeepers='$zookeeper'/g' $GAFFER_STOREPROPERTIES
sed -ie 's/zookeepers=/zookeepers='$zookeeper'/g' $GAFFER_REST_STOREPROPERTIES
password=`cat slider-$INSTANCE_NAME/root.password`
echo "doing unspeakable things with sed yet again... adding the accumulo password to the storeproperties file"
sed -ie 's/accumulo.password=//g' $GAFFER_STOREPROPERTIES
echo "accumulo.password=$password" >> $GAFFER_STOREPROPERTIES
sed -ie 's/accumulo.password=//g' $GAFFER_REST_STOREPROPERTIES
echo "accumulo.password=$password" >> $GAFFER_REST_STOREPROPERTIES
