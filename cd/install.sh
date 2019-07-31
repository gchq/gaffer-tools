#!/usr/bin/env bash

set -e

if [[ "$RELEASE" != 'true' ]]; then
    if [[ "$TRAVIS_BRANCH" == 'develop' ]] || [[ "$TRAVIS_PULL_REQUEST" != 'false' ]]; then
        if [[ "$MODULES" == 'analytics-ui' ]]; then
            npm install -g @angular-cli
            npm install
        elif  [[ "$MODULES" == '' ]] || [[ $MODULES == *'!'* ]]; then
            echo "Running install script: mvn -q install -P quick,travis,build-extras -B -V"
            mvn -q install -P quick,travis,build-extras -B -V
        else
            echo "Running install script: mvn -q install -P quick,travis,build-extras -B -V -pl $MODULES -am"
            mvn -q install -P quick,travis,build-extras -B -V -pl $MODULES -am
        fi
    fi
fi
