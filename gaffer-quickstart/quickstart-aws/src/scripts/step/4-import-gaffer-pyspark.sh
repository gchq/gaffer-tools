#!/bin/bash -e

S3_BUCKET=
ENV_FILE=$HOME/env.sh

source $ENV_FILE

usage="usage: -s3"


if [[ $# -lt 2 ]]; then
    echo $usage
    echo "not enough args, exiting..."
    exit 1
fi

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -s3)
    S3_BUCKET="$2"
    shift # past argument
    ;;
    *)
            echo $usage
            echo "unknown args, exiting..."
            exit 1
    ;;
esac
shift # past argument or value
done

cd $HOME

echo "working in "$HOME

aws s3 cp $S3_BUCKET/ ${HOME} --recursive

echo -e "alias gafferpy=\"pyspark --jars ${HOME}/gafferpy-build-${GAFFERPY_VERSION}-jar-with-dependencies.jar --py-files ${HOME}/gafferpy-build-${GAFFERPY_VERSION}-python-modules.zip --packages graphframes:graphframes:0.6.0-spark2.3-s_2.11\"" >> .bashrc

source .bashrc
