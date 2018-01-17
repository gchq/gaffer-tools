#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

DST=accumulo
CLUSTER_NAME=$(cat ./etc/cluster.name)
ACCUMULO_VERSION=$(cat ./etc/accumulo.version)

if [ ! -d "$DST" ]; then
	mkdir -p "$DST"
	./slider client \
		--install \
		--dest "$DST" \
		--package ./accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
		--name $CLUSTER_NAME \
		--debug \
	|| (rm -rf "$DST" && exit 1)
fi
