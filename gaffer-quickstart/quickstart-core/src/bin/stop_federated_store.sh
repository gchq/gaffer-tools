#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
fi

HERE=$(pwd)

pidfile="$GAFFER_HOME/federated.pid"

while read -r line
do
    pid="$line"
    echo "stopping pid $pid"
done < "$pidfile"

kill -9 $pid

rm -rf $pidfile

$GAFFER_HOME/bin/_stop_miniaccumulo.sh




