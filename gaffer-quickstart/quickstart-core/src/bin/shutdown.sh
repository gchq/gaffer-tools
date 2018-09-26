#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
fi


$GAFFER_HOME/bin/_stop_miniaccumulo.sh

$GAFFER_HOME/bin/_stop_web_services.sh

