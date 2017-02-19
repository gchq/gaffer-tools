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

# This script builds a Slider Application Package for HBase

if [ "$#" -lt 3 ]; then
	echo "Missing arguments: $0 <branch> <hbaseVersion> <outputDirectory>" >&2
	exit 1
fi

BRANCH=$1
VERSION=$2
DESTINATION=$3

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_PKG_FILE=slider-hbase-app-package-$VERSION.zip

if [ -f "$DESTINATION/$APP_PKG_FILE" ]; then
	echo "$APP_PKG_FILE already exists in output directory '$DESTINATION', skipping build of app pkg..."
	exit 0
fi

TEMP_DIR=$(mktemp -d -t slider-XXXX)
# Cleanup temp dir when script exists
trap "rm -rf $TEMP_DIR" EXIT

# Get HBase Distribution
BIN_SRC=http://www.mirrorservice.org/sites/ftp.apache.org/hbase/$VERSION/hbase-$VERSION-bin.tar.gz
BIN_DST_DIR=$TEMP_DIR/hbase/
BIN_DST_FILE=hbase-$VERSION.tar.gz

mkdir -p $BIN_DST_DIR
curl -o $BIN_DST_DIR/$BIN_DST_FILE $BIN_SRC || exit 1

# Build HBase Application Package
git clone -b $BRANCH https://github.com/apache/incubator-slider.git $TEMP_DIR/slider || exit 1
cd $TEMP_DIR/slider/app-packages/hbase
mvn clean package -Phbase-app-package -Dhbase.version=$VERSION -Dpkg.version=$VERSION -Dpkg.name=$BIN_DST_FILE -Dpkg.src=$BIN_DST_DIR || exit 1

# Copy HBase application package to destination directory
cd $DIR
mkdir -p $DESTINATION
cp $TEMP_DIR/slider/app-packages/hbase/target/$APP_PKG_FILE $DESTINATION

