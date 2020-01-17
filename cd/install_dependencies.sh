#!/usr/bin/env bash

set +e
# Some quick command to see if the pom is resolvable
gaffer_version=`mvn help:evaluate -Dexpression=gaffer.version -q -DforceStdout`
return_value=$?
set -e
if [[ ${return_value} -ne 0 ]]; then
    echo "Building Koryphe from source"
    cd .. && git clone https://github.com/gchq/koryphe.git && cd koryphe && mvn install -Pquick -q
    echo "Building Gaffer from source"
    cd .. && git clone https://github.com/gchq/gaffer.git && cd gaffer && mvn install -Pquick -q
    cd ../gaffer-tools
fi