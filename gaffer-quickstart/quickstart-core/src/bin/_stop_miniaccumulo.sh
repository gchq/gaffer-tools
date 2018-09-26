#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
fi

MINI_ACCUMULO_DIR=$GAFFER_HOME/miniaccumulo

if [[ ! -d "${MINI_ACCUMULO_DIR}" ]];
then
    echo "can't find miniaccumulo directory"
    exit 0
else
    echo "miniaccumulo directory at $MINI_ACCUMULO_DIR"
fi

touch $MINI_ACCUMULO_DIR/shutdown >> $GAFFER_HOME/gaffer.log 2>&1 &