#!/bin/bash

HERE=$(pwd)

echo -e "stopping gaffer web services"

pidfile="$GAFFER_HOME/gafferwebservices.pid"

while read -r line
do
    pid="$line"
    echo "stopping pid $pid"
done < "$pidfile"

kill -9 $pid

rm -f $pidfile

echo -e "cleaning up"

rm -r $GAFFER_HOME/gaffer_web_services_working

echo -e "done"