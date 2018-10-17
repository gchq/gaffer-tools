#!/bin/bash -e

if [ ! -f "cluster.name" ]; then
	echo "Please run this command inside a Slider application directory!"
	exit 1
fi

DST=accumulo
CLUSTER_NAME=$(cat ./cluster.name)
SLIDER_VERSION=$(cat ./slider.version)
ACCUMULO_VERSION=$(cat ./accumulo.version)

SLIDER_INSTALL_DIR=/opt/slider/slider-$SLIDER_VERSION
ACCUMULO_INSTALL_DIR=/opt/accumulo/$ACCUMULO_VERSION

SLIDER=$SLIDER_INSTALL_DIR/bin/slider

if [ ! -d "$DST" ]; then
	mkdir -p "$DST"
	$SLIDER client \
		--install \
		--dest "$DST" \
		--package $ACCUMULO_INSTALL_DIR/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
		--name $CLUSTER_NAME \
		--debug \
	|| (rm -rf "$DST" && exit 1)
fi

