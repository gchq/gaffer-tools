#!/bin/bash

set -e

source ~/.bashrc

export JAVA_HOME=/etc/alternatives/java_sdk_1.8.0

GAFFER_BRANCH=master
GAFFER_TOOLS_BRANCH=master

if [ "$#" -gt 2 ]; then
	echo "Invalid arguments: $0 [<gaffer-branch>] [<gaffer-tools-branch>]" >&2
	exit 1
elif [ "$#" -eq 2 ]; then
	GAFFER_BRANCH="$1"
	GAFFER_TOOLS_BRANCH="$2"
elif [ "$#" -eq 1 ]; then
	GAFFER_BRANCH="$1"
fi

TEMP_DIR=$(mktemp -d -t gaffer-funtests-XXXX)
# Cleanup temp dir when script exists
trap "rm -rf $TEMP_DIR" EXIT

# Build Gaffer if we can't obtain the requested version from Maven
if ! curl -sf -o /dev/null https://search.maven.org/remotecontent?filepath=uk/gov/gchq/gaffer/gaffer2/$GAFFER_BRANCH/gaffer2-$GAFFER_BRANCH.pom; then
	cd $TEMP_DIR
	git clone -b $GAFFER_BRANCH https://github.com/gchq/Gaffer.git
	cd Gaffer
	mvn clean install -Pquick

	GAFFER_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
else
	GAFFER_VERSION=$GAFFER_BRANCH
fi

cd $TEMP_DIR
git clone -b $GAFFER_TOOLS_BRANCH https://github.com/gchq/gaffer-tools.git
cd gaffer-tools/slider
mvn clean verify -Paccumulo-funtest -Dtest.cluster.type=emr -Dgaffer.version=$GAFFER_VERSION

