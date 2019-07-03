#!/bin/bash

HERE=$(pwd)

if [[ -z "${GAFFER_HOME}" ]];
then
    echo "GAFFER_HOME environment variable not set"
    exit 0
else
    echo "GAFFER_HOME is $GAFFER_HOME"
    source $GAFFER_HOME/bin/_version.sh
fi

SCHEMA=
GRAPH_CONFIG=
STORE_PROPERTIES=
UICONFIG=
RESTCONFIG=
UI_WAR=$GAFFER_HOME/lib/quickstart-ui-${VERSION}.war
REST_WAR=$GAFFER_HOME/lib/quickstart-rest-${VERSION}.war
CUSTOM_OPS_DIR=
PORT=

usage="-schema schema file, -config graphconfig file, -store storeProperties file"

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -schema)
    SCHEMA="$2"
    shift # past argument
    ;;
    -config)
    GRAPH_CONFIG="$2"
    shift # past argument
    ;;
    -store)
    STORE_PROPERTIES="$2"
    shift # past argument
    ;;
    -uiconfig)
    UICONFIG="$2"
    shift # past argument
    ;;
    -restconfig)
    RESTCONFIG="$2"
    shift # past argument
    ;;
    -customops-dir)
	CUSTOM_OPS_DIR="$2"
	shift
	;;
	-port)
	echo "setting port"
	PORT="$2"
	echo -e "port set to $PORT"
	shift
	;;
    *)
            echo $usage
            echo "unknown args, exiting..."
            exit 1
    ;;
esac
shift # past argument or value
done

if [[ -z "${SCHEMA}" ]];
then
    echo "schema not set"
    exit 0
else
    echo "using schema at $SCHEMA"
fi

if [[ -z "${STORE_PROPERTIES}" ]];
then
    echo "store properties not set"
    exit 0
else
    echo "using store properties at $STORE_PROPERTIES"
fi

if [[ -z "${GRAPH_CONFIG}" ]];
then
    echo "graphconfig not set"
    exit 0
else
    echo "using graph config at $GRAPH_CONFIG"
fi

if [ -z $CUSTOM_OPS_DIR ]
then
    echo -e "\ngaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json,${GAFFER_HOME}/conf/operationDeclarations.json\n" >> $STORE_PROPERTIES
else
    $GAFFER_HOME/bin/_repackage_war.sh $CUSTOM_OPS_DIR >> $GAFFER_HOME/gaffer.log 2>&1
    customOpDecs=$(ls -m $CUSTOM_OPS_DIR/*.json)
    echo -e "\ngaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json,${GAFFER_HOME}/conf/operationDeclarations.json,${customOpDecs}\n" >> $STORE_PROPERTIES
fi

echo -e "\ngaffer.serialisation.json.modules=uk.gov.gchq.gaffer.sketches.serialisation.json.SketchesJsonModules\n" >> $STORE_PROPERTIES

java -cp "$GAFFER_HOME/lib/quickstart-core-${VERSION}.jar:$GAFFER_HOME/lib/*" uk.gov.gchq.gaffer.quickstart.web.GafferWebServices $SCHEMA $GRAPH_CONFIG $STORE_PROPERTIES $REST_WAR $UI_WAR $RESTCONFIG $PORT>> $GAFFER_HOME/gaffer.log 2>&1 &

pid=`ps -ef | grep GafferWebServices | head -n 1 | awk '{print $2}'`

echo $pid > $GAFFER_HOME/gafferwebservices.pid

echo -e "Starting gaffer web services"
echo -e "setting ui config to ${UICONFIG}"

until [ -f $GAFFER_HOME/gaffer_web_services_working/ui/config/config.json ]
do
     echo -n "."
     sleep 0.5
done
echo -e "\n"

cp $UICONFIG $GAFFER_HOME/gaffer_web_services_working/ui/config/config.json
cp $GAFFER_HOME/conf/icons/* $GAFFER_HOME/gaffer_web_services_working/ui/app/img/
