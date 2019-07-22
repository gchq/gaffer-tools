#!/bin/bash -e

#
# Copyright 2017-2019 Crown Copyright
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

ACCUMULO_174_PATCH="diff --git a/app-packages/accumulo/src/main/java/org/apache/slider/accumulo/CustomAuthenticator.java b/app-packages/accumulo/src/main/java/org/apache/slider/accumulo/CustomAuthenticator.java
index 0f508380..586870b4 100644
--- a/app-packages/accumulo/src/main/java/org/apache/slider/accumulo/CustomAuthenticator.java
+++ b/app-packages/accumulo/src/main/java/org/apache/slider/accumulo/CustomAuthenticator.java
@@ -50,8 +50,7 @@ public final class CustomAuthenticator implements Authenticator {
   public void initializeSecurity(TCredentials credentials, String principal,
       byte[] token) throws AccumuloSecurityException {
     String pass = null;
-    SiteConfiguration siteconf = SiteConfiguration.getInstance(
-        DefaultConfiguration.getInstance());
+    SiteConfiguration siteconf = SiteConfiguration.getInstance();
     String jksFile = siteconf.get(
         Property.GENERAL_SECURITY_CREDENTIAL_PROVIDER_PATHS);
"

ACCUMULO_18_PATCH="diff --git a/app-packages/accumulo/pom.xml b/app-packages/accumulo/pom.xml
index 494dd4b3..c5e3b204 100644
--- a/app-packages/accumulo/pom.xml
+++ b/app-packages/accumulo/pom.xml
@@ -283,6 +283,14 @@
           </dependency>
         </dependencies>
       </plugin>
+      <plugin>
+        <!-- Allows us to get the apache-ds bundle artifacts -->
+        <groupId>org.apache.felix</groupId>
+        <artifactId>maven-bundle-plugin</artifactId>
+        <version>3.0.1</version>
+        <extensions>true</extensions>
+        <inherited>true</inherited>
+      </plugin>
     </plugins>
   </build>
 
@@ -320,12 +328,6 @@
       <scope>test</scope>
     </dependency>
     <dependency>
-      <groupId>org.apache.thrift</groupId>
-      <artifactId>libthrift</artifactId>
-      <version>0.9.1</version>
-      <scope>test</scope>
-    </dependency>
-    <dependency>
       <groupId>org.apache.accumulo</groupId>
       <artifactId>accumulo-test</artifactId>
       <scope>test</scope>
diff --git a/app-packages/accumulo/src/test/groovy/org/apache/slider/funtest/accumulo/AccumuloProxyIT.groovy b/app-packages/accumulo/src/test/groovy/org/apache/slider/funtest/accumulo/AccumuloProxyIT.groovy
index d25811f4..a9b4c8dc 100644
--- a/app-packages/accumulo/src/test/groovy/org/apache/slider/funtest/accumulo/AccumuloProxyIT.groovy
+++ b/app-packages/accumulo/src/test/groovy/org/apache/slider/funtest/accumulo/AccumuloProxyIT.groovy
@@ -17,7 +17,8 @@
 package org.apache.slider.funtest.accumulo
 
 import groovy.util.logging.Slf4j
-import org.apache.accumulo.proxy.TestProxyClient
+//import org.apache.accumulo.proxy.TestProxyClient
+import org.apache.accumulo.test.proxy.TestProxyClient
 import org.apache.accumulo.proxy.thrift.AccumuloProxy
 import org.apache.accumulo.proxy.thrift.ColumnUpdate
 import org.apache.accumulo.proxy.thrift.TimeType
diff --git a/pom.xml b/pom.xml
index c05416d7..01584c26 100644
--- a/pom.xml
+++ b/pom.xml
@@ -172,7 +172,7 @@
     <!-- define the protobuf JAR version                               -->
     <protobuf.version>2.5.0</protobuf.version>
 
-    <slf4j.version>1.7.5</slf4j.version>
+    <slf4j.version>1.7.21</slf4j.version>
     <snakeyaml.version>1.16</snakeyaml.version>
     <storm.version>0.9.3</storm.version>
     <stringtemplate.version>2.4.1</stringtemplate.version>
"

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
if ! git clone -b $BRANCH --depth 1 https://github.com/apache/incubator-slider.git $TEMP_DIR; then
	git clone -b $BRANCH https://github.com/apache/incubator-slider.git $TEMP_DIR
fi

# The Accumulo application package in the Slider repo currently fails to build for Accumulo 1.7.4+
# Applying a patch to fix this until SLIDER-1249 has been resolved.
if [[ "$ACCUMULO_VERSION" == 1.7.4 ]]; then
	cd $TEMP_DIR
	echo "Applying patch for Accumulo 1.7.4+..."
	git apply - <<<"$ACCUMULO_174_PATCH"
elif [[ "$ACCUMULO_VERSION" == 1.8.* || "$ACCUMULO_VERSION" == 1.9.* ]]; then
	cd $TEMP_DIR
	echo "Applying patch for Accumulo 1.7.4+..."
	git apply - <<<"$ACCUMULO_174_PATCH"
	echo "Applying patch for Accumulo 1.8.0+..."
	git apply - <<<"$ACCUMULO_18_PATCH"
fi

cd $TEMP_DIR/app-packages/accumulo
mvn clean package -Paccumulo-app-package-maven -Daccumulo.version=$ACCUMULO_VERSION -Dpkg.version=$ACCUMULO_VERSION -DskipTests
cd target

if [ "$BUILD_NATIVE" == "true" ]; then
	echo "Building Accumulo Native Libraries..."
	rm $APP_PKG_FILE
	pushd slider-accumulo-app-package-$ACCUMULO_VERSION
	pushd package/files/
	tar -xvf accumulo-$ACCUMULO_VERSION-bin.tar.gz
	accumulo-$ACCUMULO_VERSION/bin/build_native_library.sh
	tar -cvf accumulo-$ACCUMULO_VERSION-bin.tar.gz accumulo-$ACCUMULO_VERSION
	rm -rf accumulo-$ACCUMULO_VERSION
	popd
	zip ../$APP_PKG_FILE -r .
	popd
fi

# Copy Accumulo application package to destination directory
cd $DIR
mkdir -p $DESTINATION
cp $TEMP_DIR/app-packages/accumulo/target/$APP_PKG_FILE $DESTINATION

