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
CUSTOM_OPS_DIR=
PORT=8085

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
		--rest-config|-r)
			RESTCONFIG=$2
			shift
			;;
		--customops-dir|-c)
			CUSTOM_OPS_DIR=$2
			shift
			;;
		--port|-p)
			PORT=$2
			shift
			;;
	esac
	shift
done

echo "GAFFER_HOME is set to $GAFFER_HOME"
source $GAFFER_HOME/bin/_version.sh


if [ -z $CUSTOM_OPS_DIR ]
then
    $GAFFER_HOME/bin/_start_miniaccumulo.sh
else
    $GAFFER_HOME/bin/_start_miniaccumulo.sh --customops-dir $CUSTOM_OPS_DIR
fi

if [ $? -eq 1 ]
then
    exit 1
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

$GAFFER_HOME/bin/_start_web_services.sh -schema $SCHEMA -config $GRAPHCONFIG -store $STOREPROPERTIES -port $PORT -uiconfig $UICONFIG -restconfig $RESTCONFIG -customops-dir $CUSTOM_OPS_DIR

$GAFFER_HOME/bin/_configure_pyspark.sh

echo -e "Gaffer UI available at http://localhost:"$PORT"/ui"
echo -e "Gaffer REST service available at http://localhost:"$PORT"/rest"
