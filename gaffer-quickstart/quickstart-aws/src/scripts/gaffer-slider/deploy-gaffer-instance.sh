#!/bin/bash -e

SLIDER_VERSION=0.92.0-incubating
ACCUMULO_VERSION=1.7.2
GAFFER_VERSION=0.7.5
USAGE=85
CLUSTER_NAME=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-s|--slider)
			SLIDER_VERSION=$2
			shift
			;;
		-a|--accumulo)
			ACCUMULO_VERSION=$2
			shift
			;;
		-g|--gaffer)
			GAFFER_VERSION=$2
			shift
			;;
		-u|--usage)
			USAGE=$2
			shift
			;;
		*)
			CLUSTER_NAME=$1
			;;
	esac
	shift
done

if [ "$CLUSTER_NAME" == "" ]; then
	echo "Usage: $0 <clusterName> [-a <accumuloVersion>] [-g <gafferVersion>] [-s <sliderVersion>] [-u <proportionOfClusterToUseInPercent>]"
	exit 1
fi

SLIDER_INSTALL_DIR=/opt/slider/slider-$SLIDER_VERSION
ACCUMULO_INSTALL_DIR=/opt/accumulo/$ACCUMULO_VERSION
GAFFER_INSTALL_DIR=/opt/gaffer/$GAFFER_VERSION

SLIDER=$SLIDER_INSTALL_DIR/bin/slider

if $SLIDER exists $CLUSTER_NAME; then
	echo "A slider app called $CLUSTER_NAME already exists!"
	exit 2
fi

DST=~/slider-$CLUSTER_NAME
if [ -d $DST ]; then
	echo "A directory called $DST already exists!"
	exit 3
fi

mkdir -p $DST
cd $DST

# Generate instance configuration
java -cp $GAFFER_INSTALL_DIR/*:$SLIDER_INSTALL_DIR/lib/*:$(hadoop classpath) \
	uk.gov.gchq.gaffer.slider.util.AppConfigGenerator \
	-u $USAGE \
	$GAFFER_INSTALL_DIR/appConfig-default.json \
	appConfig.json \
	resources.json

# Check that a credential keystore doesn't already exist
CREDSTORE=$(jq -r '.global."site.accumulo-site.general.security.credential.provider.paths"' appConfig.json)
CREDSTORE=${CREDSTORE/\$\{USER\}/$USER}
CREDSTORE=${CREDSTORE/\$\{CLUSTER_NAME\}/$CLUSTER_NAME}

if hadoop credential list -provider $CREDSTORE | grep "root.initial.password"; then
	hadoop fs -rm $CREDSTORE
fi

# Generate passwords for Accumulo
ROOT_PWD=$(openssl rand -base64 32)
SECRET=$(openssl rand -base64 32)

# Deploy Gaffer instance
$SLIDER create $CLUSTER_NAME \
	--appdef $ACCUMULO_INSTALL_DIR/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
	--addon Gaffer $GAFFER_INSTALL_DIR/gaffer-slider-$GAFFER_VERSION.zip \
	--template appConfig.json \
	--resources resources.json \
	--debug <<ARGS
$ROOT_PWD
$ROOT_PWD
$SECRET
$SECRET
$ROOT_PWD
$ROOT_PWD
ARGS

echo "$CLUSTER_NAME" >cluster.name
echo "$SLIDER_VERSION" >slider.version
echo "$ACCUMULO_VERSION" >accumulo.version
echo "$ROOT_PWD" >root.password
echo "$SECRET" >instance.secret
