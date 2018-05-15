#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "Usage: ./softUpdateGafferVersion.sh <new version>"
    exit 1
fi

newVersion=$1

mvn -q org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.parent.version
oldVersion=`mvn org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.parent.version | grep -v '\['`


sed -i '' "s/version>$oldVersion</version>$newVersion</g" pom.xml
sed -i '' "s/gaffer2:$oldVersion/gaffer2:$newVersion/g" NOTICES

sed -i '' "s/__version__ = \"$oldVersion\"/__version__ = \"$newVersion\"/g" python-shell/__init__.py
sed -i '' "s/__version__ = \"$oldVersion\"/__version__ = \"$newVersion\"/g" python-shell/src/__init__.py
sed -i '' "s/__version__ = \"$oldVersion\"/__version__ = \"$newVersion\"/g" python-shell/src/gafferpy/__init__.py
sed -i '' "s/__version__ = \"$oldVersion\"/__version__ = \"$newVersion\"/g" python-shell/src/test/__init__.py
