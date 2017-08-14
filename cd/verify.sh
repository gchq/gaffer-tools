#!/usr/bin/env bash

if [ "$RELEASE" != 'true' ]; then
    if [ "$MODULES" == '' ]; then
        echo "Running verify script: mvn -q verify -P travis,analyze -B"
        mvn -q verify -P travis,analyze -B
        echo "Running verify script: mvn -q verify -P travis,test -B"
        mvn -q verify -P travis,test -B
    else
        echo "Running verify script: mvn -q verify -P travis,analyze -B -pl $MODULES"
        mvn -q verify -P travis,analyze -B -pl $MODULES
        echo "Running verify script: mvn -q verify -P travis,test -B -pl $MODULES"
        mvn -q verify -P travis,test -B -pl $MODULES
    fi

    if [[ $MODULES == *":ui"* ]]; then
      mvn install -P quick,travis,road-traffic-demo -pl ui &
      sleep 2m
      mvn verify -P travis,system-test -Dwebdriver.gecko.driver=geckodriver -pl ui
      cd python-shell && python3 -m unittest discover -s src && cd ../
    fi
fi