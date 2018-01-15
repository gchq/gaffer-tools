#!/bin/bash -xe

GAFFER_VERSION=1.0.0
WAIT_HANDLE_URL=""
DESTINATION=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-g|--gaffer)
			GAFFER_VERSION=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		*)
			DESTINATION=$1
			;;
	esac
	shift
done

if [[ "$WAIT_HANDLE_URL" ]]; then
	function awsSignal {
		/opt/aws/bin/cfn-signal -e $? "$WAIT_HANDLE_URL"
	}
	trap awsSignal EXIT
fi

if [[ "$DESTINATION" == "" ]]; then
	echo "Usage: $0 <s3Destination> [-g <gafferVersion>] [-w <awsWaitHandleUrl>]"
	exit 1
fi

# Need to work out if we can download the Gaffer road-traffic-model.jar or if we need to build it from source...
if ! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/road-traffic-model/$GAFFER_VERSION/road-traffic-model-$GAFFER_VERSION.jar; then
	echo "Building Gaffer road-traffic-model.jar from branch $GAFFER_VERSION..."
	curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_VERSION.zip
	unzip $GAFFER_VERSION.zip
	rm $GAFFER_VERSION.zip
	cd Gaffer-$GAFFER_VERSION

	source /etc/profile.d/maven.sh
	mvn clean package -Pquick -pl example/road-traffic/road-traffic-model --also-make

	GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer version as $GAFFER_POM_VERSION"

	cp example/road-traffic/road-traffic-model/target/road-traffic-model-$GAFFER_POM_VERSION.jar ../

	# Tidy up
	cd ..
	rm -rf Gaffer-$GAFFER_VERSION
else
	echo "Using Gaffer road-traffic-model.jar from Maven Central..."
	GAFFER_POM_VERSION=$GAFFER_VERSION
fi

aws s3 cp ./road-traffic-model-$GAFFER_POM_VERSION.jar $DESTINATION
