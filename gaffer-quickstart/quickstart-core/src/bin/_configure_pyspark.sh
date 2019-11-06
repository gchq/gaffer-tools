#!/bin/bash -e

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
fi

source $GAFFER_HOME/bin/_version.sh

operationDeclarations="\ngaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json,pySparkAccumuloOperationsDeclarations.json,${GAFFER_HOME}/conf/operationDeclarations.json"


HERE=$(pwd)

echo -e "waiting for store.properties" >> $GAFFER_HOME/gaffer.log
while ! [ -f "$GAFFER_HOME/miniaccumulo/store.properties" ];
do
    echo -n "."
    sleep 0.5
done

echo -e "creating gaffer pyspark properties file at $GAFFER_HOME/miniaccumulo/pyspark.store.properties" >> $GAFFER_HOME/gaffer.log

echo -e "\n\nspark.master=local[*]" >> $GAFFER_HOME/miniaccumulo/store.properties
echo -e "\nspark.home=${SPARK_HOME}" >> $GAFFER_HOME/miniaccumulo/store.properties
echo -e "\nspark.loader.jar=${GAFFER_HOME}/lib/gaffer-quickstart-full.jar" >> $GAFFER_HOME/miniaccumulo/store.properties


cp $GAFFER_HOME/miniaccumulo/store.properties $GAFFER_HOME/miniaccumulo/pyspark.store.properties

sed -ie "/gaffer.store.operation.declarations/s/$/,pySparkAccumuloOperationsDeclarations.json/" $GAFFER_HOME/miniaccumulo/pyspark.store.properties
echo -e $pythonSerialisers >> $GAFFER_HOME/miniaccumulo/pyspark.store.properties

echo -e "\nPyspark operations loaded"