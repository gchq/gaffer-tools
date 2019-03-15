#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
fi

SCHEMA=$GAFFER_HOME/example/schema.json
GRAPHCONFIG=$GAFFER_HOME/example/graphconfig.json
STOREPROPERTIES=$GAFFER_HOME/miniaccumulo/store.properties
UICONFIG=$GAFFER_HOME/example/ui-config.json
RESTCONFIG=$GAFFER_HOME/conf/restOptions.properties

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		--schema|-s)
			SCHEMA=$2
			shift
			;;
		--graphconfig|-g)
			GRAPHCONFIG=$2
			shift
			;;
		--storeproperties|-s)
			STOREPROPERTIES=$2
			shift
			;;
		--ui-config|-u)
			UICONFIG=$2
			shift
			;;
		--rest-config|-u)
			RESTCONFIG=$2
			shift
			;;
	esac
	shift
done

echo "GAFFER_HOME is set to $GAFFER_HOME"
source $GAFFER_HOME/bin/_version.sh

$GAFFER_HOME/bin/_start_miniaccumulo.sh

$GAFFER_HOME/bin/_start_web_services.sh -schema $SCHEMA -config $GRAPHCONFIG -store $STOREPROPERTIES -uiconfig $UICONFIG -restconfig $RESTCONFIG

$GAFFER_HOME/bin/_configure_pyspark.sh

echo -e "Gaffer UI available at http://localhost:8080/ui"
echo -e "Gaffer REST service available at http://localhost:8080/rest"
