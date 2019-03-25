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

mkdir -p $GAFFER_HOME/graphlibrary/

SCHEMA=$GAFFER_HOME/federated/schema.json
FEDERATED_GRAPH_CONFIG=$GAFFER_HOME/federated/federatedGraphconfig.json
ACCUMULO_GRAPH_CONFIG=$GAFFER_HOME/federated/accumuloGraphconfig.json

FEDERATED_STORE_PROPERTIES=$GAFFER_HOME/federated/aquariumFederated.properties
ACCUMULO_STORE_PROPERTIES=$GAFFER_HOME/miniaccumulo/store.properties
AQUARIUM_ACCUMULO_PROPERTIES=$GAFFER_HOME/graphlibrary/fishtankProps.properties
PYSPARK_STORE_PROPERTIES=$GAFFER_HOME/miniaccumulo/pyspark.store.properties

UICONFIG=$GAFFER_HOME/federated/ui-config.json
UI_WAR=$GAFFER_HOME/lib/quickstart-ui-${VERSION}.war
REST_WAR=$GAFFER_HOME/lib/quickstart-rest-${VERSION}.war
RESTCONFIG=$GAFFER_HOME/conf/restOptions.properties

federated_graph_config="{\n\\t\"graphId\" : \"aquarium\",\n\t\"library\" : {\n\t\t\"class\" : \"uk.gov.gchq.gaffer.store.library.FileGraphLibrary\",\n\t\t\"path\" : \"${GAFFER_HOME}/graphlibrary\"\n\t},\n\t\"hooks\" : [ ]\n}"

echo -e $federated_graph_config > $FEDERATED_GRAPH_CONFIG


usage="--schema schema file, --config graphconfig file, --store storeProperties file, --ui-config ui config file, --rest-config rest properties file"

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    --schema)
    SCHEMA="$2"
    shift # past argument
    ;;
    --config)
    FEDERATED_GRAPH_CONFIG="$2"
    shift # past argument
    ;;
    --store)
    FEDERATED_STORE_PROPERTIES="$2"
    shift # past argument
    ;;
    --ui-config)
    UICONFIG="$2"
    shift # past argument
    ;;
    --rest-config)
    RESTCONFIG="$2"
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

if [[ -z "${SCHEMA}" ]];
then
    echo "schema not set"
    exit 0
else
    echo "using schema at $SCHEMA"
fi

if [[ -z "${FEDERATED_STORE_PROPERTIES}" ]];
then
    echo "store properties not set"
    exit 0
else
    echo "using store properties at $FEDERATED_STORE_PROPERTIES"
fi

if [[ -z "${FEDERATED_GRAPH_CONFIG}" ]];
then
    echo "graphconfig not set"
    exit 0
else
    echo "using graph config at $FEDERATED_GRAPH_CONFIG"
fi

########################################

$GAFFER_HOME/bin/_start_miniaccumulo.sh

########################################

echo -e "\ngaffer.store.operation.declarations=${GAFFER_HOME}/conf/operationDeclarations.json,${GAFFER_HOME}/federated/federatedOperationsDeclarations.json\n" >> $FEDERATED_STORE_PROPERTIES

java -cp "$GAFFER_HOME/lib/quickstart-core-${VERSION}.jar:$GAFFER_HOME/lib/*" uk.gov.gchq.gaffer.quickstart.web.GafferWebServices $SCHEMA $FEDERATED_GRAPH_CONFIG $FEDERATED_STORE_PROPERTIES $REST_WAR $UI_WAR $RESTCONFIG>> $GAFFER_HOME/gaffer.log 2>&1 &

pid=`ps -ef | grep GafferWebServices | head -n 1 | awk '{print $2}'`

echo $pid > $GAFFER_HOME/federated.pid

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


cp $ACCUMULO_STORE_PROPERTIES $AQUARIUM_ACCUMULO_PROPERTIES

echo -e "\ngaffer.store.operation.declarations=${GAFFER_HOME}/conf/operationDeclarations.json,${GAFFER_HOME}/federated/federatedOperationsDeclarations.json\n" >> $ACCUMULO_STORE_PROPERTIES

echo -e "\ngaffer.store.operation.declarations=${GAFFER_HOME}/conf/operationDeclarations.json,${GAFFER_HOME}/federated/federatedOperationsDeclarations.json\n" >> $AQUARIUM_ACCUMULO_PROPERTIES

cp $ACCUMULO_STORE_PROPERTIES $PYSPARK_STORE_PROPERTIES

operationDeclarations="\ngaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json,pySparkAccumuloOperationsDeclarations.json,${GAFFER_HOME}/conf/operationDeclarations.json"
pythonSerialisers="\npythonserialiser.declarations=${GAFFER_HOME}/conf/customPysparkSerialisers.json"

echo -e $operationDeclarations >> $PYSPARK_STORE_PROPERTIES
echo -e $pythonSerialisers >> $PYSPARK_STORE_PROPERTIES


