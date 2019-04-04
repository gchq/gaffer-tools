#!/bin/bash -e

HERE=$(pwd)

CUSTOM_OPS_DIR=

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		--customops-dir|-c)
			CUSTOM_OPS_DIR=$2
			shift
			;;
	esac
	shift
done

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
    source $GAFFER_HOME/bin/_version.sh
fi

echo -e "starting accumulo" >> $GAFFER_HOME/gaffer.log

if [ -z $CUSTOM_OPS_DIR ]
then
    java -cp "$GAFFER_HOME/lib/gaffer-quickstart-${VERSION}.jar:$GAFFER_HOME/lib/*" uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController -d $GAFFER_HOME/miniaccumulo >> $GAFFER_HOME/gaffer.log 2>&1 &
else
    java -cp "$GAFFER_HOME/lib/gaffer-quickstart-${VERSION}.jar:$GAFFER_HOME/lib/*:$CUSTOM_OPS_DIR/*" uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController -d $GAFFER_HOME/miniaccumulo >> $GAFFER_HOME/gaffer.log 2>&1 &

fi

echo -e "waiting for store.properties" >> $GAFFER_HOME/gaffer.log

echo -e "Starting mini-accumulo"

while ! [ -f "$GAFFER_HOME/miniaccumulo/store.properties" ];
do
    echo -n "."
    sleep 0.5
done

echo -e "\nminiaccumulo started"
