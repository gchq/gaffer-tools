#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
fi

echo -e "shutting down miniaccumulo"

MINI_ACCUMULO_DIR=$GAFFER_HOME/miniaccumulo

if [[ ! -d "${MINI_ACCUMULO_DIR}" ]];
then
    echo "can't find miniaccumulo directory to shut down"
    exit 0
else
    echo "miniaccumulo directory at $MINI_ACCUMULO_DIR"
    touch $MINI_ACCUMULO_DIR/shutdown >> $GAFFER_HOME/gaffer.log 2>&1 &
fi

while ! [ -d "$MINI_ACCUMULO_DIR" ];
do
    echo -n "."
    sleep 0.5
    counter=$((counter + 1))
    if [[ "$counter" -eq 60 ]]
    then
        rm -r $MINI_ACCUMULO_DIR
    fi
done



echo -e "done"