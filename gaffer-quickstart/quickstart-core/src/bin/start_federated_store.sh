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
CUSTOM_OPS_DIR=
PORT=8085

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
    --customops-dir|-c)
		CUSTOM_OPS_DIR=$2
		shift
		;;
	--port|-p)
		PORT=$2
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

function random_free_tcp_port {
  local ports="${1:-1}" interim="${2:-2048}" spacing=32
  local free_ports=( )
  local taken_ports=( $( netstat -aln | egrep ^tcp | fgrep LISTEN |
                         awk '{print $4}' | egrep -o '[0-9]+$' |
                         sort -n | uniq ) )
  interim=$(( interim + (RANDOM % spacing) ))

  for taken in "${taken_ports[@]}" 65535
  do
    while [[ $interim -lt $taken && ${#free_ports[@]} -lt $ports ]]
    do
      free_ports+=( $interim )
      interim=$(( interim + spacing + (RANDOM % spacing) ))
    done
    interim=$(( interim > taken + spacing
                ? interim
                : taken + spacing + (RANDOM % spacing) ))
  done

  [[ ${#free_ports[@]} -ge $ports ]] || return 2

  printf '%d\n' "${free_ports[@]}"
  port=${free_ports[0]}
  echo $port
}


if [ $PORT -eq 0 ]
then
    echo -e "choosing random free port"
    random_free_tcp_port
    PORT=$port
    echo -e $PORT
fi

echo -e "starting web services on port $PORT"


if [ -z $CUSTOM_OPS_DIR ]
then
    $GAFFER_HOME/bin/_start_miniaccumulo.sh

    echo -e "\ngaffer.store.operation.declarations=${GAFFER_HOME}/conf/operationDeclarations.json,${GAFFER_HOME}/federated/federatedOperationsDeclarations.json\n" >> $FEDERATED_STORE_PROPERTIES
    java -cp "$GAFFER_HOME/lib/quickstart-core-${VERSION}.jar:$GAFFER_HOME/lib/*" uk.gov.gchq.gaffer.quickstart.web.GafferWebServices $SCHEMA $FEDERATED_GRAPH_CONFIG $FEDERATED_STORE_PROPERTIES $REST_WAR $UI_WAR $RESTCONFIG $PORT>> $GAFFER_HOME/gaffer.log 2>&1 &
else
    $GAFFER_HOME/bin/_start_miniaccumulo.sh --customops-dir $CUSTOM_OPS_DIR

    $GAFFER_HOME/bin/_repackage_war.sh $CUSTOM_OPS_DIR >> $GAFFER_HOME/gaffer.log 2>&1
    customOpDecs=$(ls -m $CUSTOM_OPS_DIR/*.json)
    echo -e "\ngaffer.store.operation.declarations=${GAFFER_HOME}/conf/operationDeclarations.json,${GAFFER_HOME}/federated/federatedOperationsDeclarations.json,${customOpDecs}\n" >> $FEDERATED_STORE_PROPERTIES
    java -cp "$GAFFER_HOME/lib/quickstart-core-${VERSION}.jar:$GAFFER_HOME/lib/*:$CUSTOM_OPS_DIR/*" uk.gov.gchq.gaffer.quickstart.web.GafferWebServices $SCHEMA $FEDERATED_GRAPH_CONFIG $FEDERATED_STORE_PROPERTIES $REST_WAR $UI_WAR $RESTCONFIG $PORT>> $GAFFER_HOME/gaffer.log 2>&1 &
fi

echo -e "\ngaffer.serialisation.json.modules=uk.gov.gchq.gaffer.sketches.serialisation.json.SketchesJsonModules\n" >> $FEDERATED_STORE_PROPERTIES

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

echo -e "Gaffer UI available at http://localhost:"$PORT"/ui"
echo -e "Gaffer REST service available at http://localhost:"$PORT"/rest"
