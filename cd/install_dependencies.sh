#!/usr/bin/env bash

set +e
# Some quick command to see if the pom is resolvable
gaffer_version=`mvn help:evaluate -Dexpression=gaffer.version -q -DforceStdout`
return_value=$?
set -e
if [[ ${return_value} -ne 0 ]]; then
    echo "Building Koryphe from source"
    cd .. && git clone https://github.com/gchq/koryphe.git && cd koryphe && git checkout master && mvn dependency:purge-local-repository clean install -Pquick -q
    echo "Building Gaffer from source"
    cd .. && git clone https://github.com/gchq/gaffer.git && cd gaffer && git checkout master && mvn dependency:purge-local-repository clean install -Pquick -q
    ls -l ~/.m2/repository/uk/gov/gchq/gaffer
    ls -l ~/.m2/repository/uk/gov/gchq/gaffer/gaffer2/
    ls -l ~/.m2/repository/uk/gov/gchq/gaffer/gaffer2/1.10.5
fi