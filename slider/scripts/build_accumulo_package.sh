#!/bin/bash

#
# Copyright 2017 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# This script builds a Slider Application Package for Accumulo

if [ "$#" -lt 3 ]; then
	echo "Missing arguments: $0 <branch> <accumuloVersion> <outputDirectory> [--build-native]" >&2
	exit 1
fi

BRANCH=$1
ACCUMULO_VERSION=$2
DESTINATION=$3
BUILD_NATIVE=false

if [ "$4" == "--build-native" ]; then
	BUILD_NATIVE=true
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_PKG_FILE=slider-accumulo-app-package-$ACCUMULO_VERSION.zip

if [ -f "$DESTINATION/$APP_PKG_FILE" ]; then
	echo "$APP_PKG_FILE already exists in output directory '$DESTINATION', skipping build of app pkg..."
	exit 0
fi

TEMP_DIR=$(mktemp -d -t slider-XXXX)
# Cleanup temp dir when script exists
trap "rm -rf $TEMP_DIR" EXIT

# Build Accumulo Application Package
git clone -b $BRANCH https://github.com/apache/incubator-slider.git $TEMP_DIR || exit 1
cd $TEMP_DIR/app-packages/accumulo
mvn clean package -Paccumulo-app-package-maven -Daccumulo.version=$ACCUMULO_VERSION -Dpkg.version=$ACCUMULO_VERSION || exit 1
cd target

if [ "$BUILD_NATIVE" == "true" ]; then
	# Build Accumulo Native Libraries
	echo "Building Accumulo Native Libraries..."
	rm $APP_PKG_FILE
	pushd slider-accumulo-app-package-$ACCUMULO_VERSION
	pushd package/files/
	tar -xvf accumulo-$ACCUMULO_VERSION-bin.tar.gz || exit 1
	accumulo-$ACCUMULO_VERSION/bin/build_native_library.sh || exit 1
	tar -cvf accumulo-$ACCUMULO_VERSION-bin.tar.gz accumulo-$ACCUMULO_VERSION || exit 1
	rm -rf accumulo-$ACCUMULO_VERSION
	popd
	zip ../$APP_PKG_FILE -r . || exit 1
	popd
fi

# Copy Accumulo application package to destination directory
cd $DIR
mkdir -p $DESTINATION
cp $TEMP_DIR/app-packages/accumulo/target/$APP_PKG_FILE $DESTINATION
