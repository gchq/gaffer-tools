#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
fi

echo "GAFFER_HOME is set to $GAFFER_HOME"
source $GAFFER_HOME/bin/_version.sh


if [ -n "$GAFFER_HOME/conf/schema.json" ]; then
    SCHEMAS_DIR=$GAFFER_HOME/example
    echo "loading example graph schemas from $SCHEMAS_DIR"
else
    SCHEMAS_DIR=$GAFFER_HOME/conf
fi

$GAFFER_HOME/bin/_start_miniaccumulo.sh

$GAFFER_HOME/bin/_start_web_services.sh -schema $SCHEMAS_DIR/schema.json -config $SCHEMAS_DIR/graphconfig.json -store $GAFFER_HOME/miniaccumulo/store.properties

#$GAFFER_HOME/bin/_configure_pyspark.sh

echo -e "Gaffer UI available at http://localhost:8080/ui"
echo -e "Gaffer REST service available at http://localhost:8080/rest"