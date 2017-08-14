#!/usr/bin/env bash

if [ "$RELEASE" != 'true' ]; then
  if [[ $MODULES == *":ui"* ]]; then
    export DISPLAY=:99.0
    sh -e /etc/init.d/xvfb start
    curl -OL https://github.com/mozilla/geckodriver/releases/download/v0.17.0/geckodriver-v0.17.0-linux64.tar.gz
    tar -xf geckodriver-v0.17.0-linux64.tar.gz
    mv geckodriver ui/
  fi
fi