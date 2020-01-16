#!/usr/bin/env bash

set -e

if [[ "$RELEASE" != 'true' ]]; then
    if [[ "$TRAVIS_BRANCH" == 'develop' ]] || [[ "$TRAVIS_PULL_REQUEST" != 'false' ]] && [[ "$MODULES" != 'analytics-ui' ]]; then
        # Check if Gaffer version is in maven central and build from source if not
        gaffer_version=`mvn help:evaluate -Dexpression=gaffer.version -q -DforceStdout`
        mvn dependency:get -Dartifact=uk.gov.gchq.gaffer:gaffer2:${gaffer_version} -q
        if [[ $? != 0 ]]; then
            echo "Building Koryphe from source"
            cd .. && git clone https://github.com/gchq/koryphe.git && cd koryphe && mvn install -Pquick -T2C -q
            echo "Building Gaffer from source"
            cd .. && git clone https://github.com/gchq/gaffer.git && cd gaffer && mvn install -Pquick -T2C -q
        fi
        if  [[ "$MODULES" == '' ]] || [[ $MODULES == *'!'* ]]; then
            echo "Running install script: mvn -q install -P quick,travis,build-extras -B -V"
            mvn -q install -P quick,travis,build-extras -B -V
        else
            echo "Running install script: mvn -q install -P quick,travis,build-extras -B -V -pl $MODULES -am"
            mvn -q install -P quick,travis,build-extras -B -V -pl $MODULES -am
        fi
    fi
fi
