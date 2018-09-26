#!/bin/bash

HERE=$(pwd)

pidfile="$GAFFER_HOME/gafferwebservices.pid"

while read -r line
do
    pid="$line"
    echo "stopping pid $pid"
done < "$pidfile"

kill -9 $pid

rm -rf $pidfile

rm -rf $GAFFER_HOME/gaffer_web_services_working

