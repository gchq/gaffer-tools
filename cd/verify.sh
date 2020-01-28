#!/usr/bin/env bash

set -e

if [[ "$RELEASE" != 'true' ]] && [[ "$TRAVIS_PULL_REQUEST" != 'false' ]]; then
    if [[ "$MODULES" == '' ]]; then
        echo "Running verify script: mvn -q -nsu verify -P travis,analyze -B"
        mvn -q -nsu verify -P travis,analyze -B
        echo "Running verify script: mvn -q -nsu verify -P travis,test -B"
        mvn -q -nsu verify -P travis,test -B
    elif [[ "$MODULES" == 'analytics-ui' ]]; then
        # It would be good to move these into the pre-install and install phases. For now though, it works.

        # Install node version manager
        wget https://raw.githubusercontent.com/creationix/nvm/v0.31.0/nvm.sh -O ~/.nvm/nvm.sh
        source ~/.nvm/nvm.sh

        # Update nodejs to the latest version
        nvm install node

        # Install the Analytics UI
        cd analytics/analytics-ui
        npm install -g @angular/cli
        npm install

        # Run the tests and linting
        ng lint
        ng test --watch=false --progress=false --browsers=ChromeHeadlessCI
        ng build --prod
    else
        echo "Running verify script: mvn -q -nsu verify -P travis,analyze -B -pl $MODULES"
        mvn -q -nsu verify -P travis,analyze -B -pl $MODULES
        echo "Running verify script: mvn -q -nsu verify -P travis,test -B -pl $MODULES"
        mvn -q -nsu verify -P travis,test -B -pl $MODULES
    fi

    if [[ $MODULES == *":ui"* ]]; then
      mvn install -P quick,travis,road-traffic-demo -B -pl ui &
      export DISPLAY=:99.0
      sh -e /etc/init.d/xvfb start
      sudo apt-get -qq update
      sudo apt-get install -y dbus
      sudo bash -c "dbus-uuidgen > /etc/machine-id"
      curl -OL https://github.com/mozilla/geckodriver/releases/download/v0.23.0/geckodriver-v0.23.0-linux64.tar.gz
      tar -xf geckodriver-v0.23.0-linux64.tar.gz
      mv geckodriver ui/
      sleep 1m
      mvn verify -P travis,system-test -Dwebdriver.gecko.driver=geckodriver -pl ui
      cd python-shell && python3 -m unittest discover -s src && cd ../
    fi
fi
