#!/bin/bash -e

if [[ $# -ne 1 ]]; then
	echo "Usage: $0 <appName>"
	exit 1
fi

CLUSTER_NAME=$1

SLIDER_APP_DIR=~/slider-$CLUSTER_NAME
if [ ! -d $SLIDER_APP_DIR ]; then
	echo "Expected to find a Slider application directory for $CLUSTER_NAME in $SLIDER_APP_DIR!"
	exit 3
fi

cd $SLIDER_APP_DIR

MAX_ATTEMPTS=10
INTERVAL=30

GAFFER_INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

for (( i=0; i<=$MAX_ATTEMPTS; i++ )); do
	if $GAFFER_INSTALL_DIR/install-accumulo-client.sh; then
		break
	else
		sleep $INTERVAL
	fi
done

