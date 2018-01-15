#!/bin/bash -xe

OUTPUT_NAME=gaffer-m2
MAVEN_VERSION=3.5.0

sudo yum remove -y java-1.7.0-openjdk
sudo yum install -y git java-1.8.0-openjdk-devel gcc-c++

export JAVA_HOME=/etc/alternatives/java_sdk

# Install Apache Maven
MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
curl -fLO $MAVEN_DOWNLOAD_URL
tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
export PATH=$PWD/apache-maven-$MAVEN_VERSION/bin:$PATH

# Build Gaffer
git clone -b develop --depth 1 https://github.com/gchq/Gaffer.git
cd Gaffer
mvn clean verify
cd ..

# Build gaffer-tools
git clone -b develop --depth 1 https://github.com/gchq/gaffer-tools.git
cd gaffer-tools
mvn clean verify
cd ..

# Create a tarball of all the Gaffer and gaffer-tools dependencies
DIR=$PWD
cd $HOME
tar -cf $DIR/$OUTPUT_NAME.tar .m2
cd $DIR
gzip $OUTPUT_NAME.tar

echo "Upload $OUTPUT_NAME.tar.gz into one of your S3 buckets"
