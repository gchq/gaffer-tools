#!/bin/bash -e

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
    source $GAFFER_HOME/bin/_version.sh
fi

java -cp "$GAFFER_HOME/lib/gaffer-quickstart-${VERSION}.jar:$GAFFER_HOME/lib/*" uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController -d $GAFFER_HOME/miniaccumulo >> $GAFFER_HOME/gaffer.log 2>&1 &

echo -e "waiting for store.properties" >> $GAFFER_HOME/gaffer.log

echo -e "Starting mini-accumulo"

while ! [ -f "$GAFFER_HOME/miniaccumulo/store.properties" ];
do
    echo -n "."
    sleep 0.5
done

operationDeclarations="\ngaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json"
echo -e $operationDeclarations >> $GAFFER_HOME/miniaccumulo/store.properties

echo -e "\nminiaccumulo started"
