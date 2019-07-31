#!/bin/bash

echo -e "adding custom operations to rest service"

source $GAFFER_HOME/bin/_version.sh

CUSTOM_OP_DIR=$1

WORKING=$(pwd)

WAR=$GAFFER_HOME/lib/quickstart-rest-${VERSION}.war

TEMPDIR=$GAFFER_HOME/temp/

mkdir -p $TEMPDIR

cp $WAR $TEMPDIR

rm $WAR

cd $TEMPDIR

jar -xvf quickstart-rest-${VERSION}.war

rm quickstart-rest-${VERSION}.war

cp $CUSTOM_OP_DIR/*.jar WEB-INF/lib/

jar -cvf quickstart-rest-${VERSION}.war *

cp quickstart-rest-${VERSION}.war $WAR

rm -rf $TEMPDIR

cd $WORKING