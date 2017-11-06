#!/bin/bash -xe

GAFFER_VERSION=""
HOST=""
PORT=80
WAIT_HANDLE_URL=""
MAVEN_VERSION=3.5.0

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-h|--host)
			HOST=$2
			shift
			;;
		-p|--port)
			PORT=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		*)
			GAFFER_VERSION=$1
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

function printUsage {
	echo "Usage: $0 <gafferVersion> -h <restApiHost> [-p <restApiPort>] [-w <awsWaitHandleUrl>]"
	exit 1
}

if [[ "$GAFFER_VERSION" == "" || "$HOST" == "" ]]; then
	printUsage
fi

# Make sure git is installed
if ! which git >/dev/null 2>&1; then
	sudo yum install -y git
fi

# Install Apache Maven
if ! which mvn >/dev/null 2>&1; then
	MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
	echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
	curl -fLO $MAVEN_DOWNLOAD_URL
	tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
	rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
	export PATH=$PWD/apache-maven-$MAVEN_VERSION/bin:$PATH
fi

if ! git clone -b gaffer2-$GAFFER_VERSION --depth 1 https://github.com/gchq/Gaffer.git; then
	git clone -b $GAFFER_VERSION --depth 1 https://github.com/gchq/Gaffer.git
fi

cd Gaffer
GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
echo "Detected Gaffer version as $GAFFER_POM_VERSION"

# Detect if we can download Gaffer dependencies from Maven Central, or if we will need to build them
if ! curl -fL -o /dev/null https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/gaffer2/$GAFFER_POM_VERSION/gaffer2-$GAFFER_POM_VERSION.pom; then
	echo "Building Gaffer from branch $GAFFER_VERSION..."
	mvn clean install -Pquick -pl example/road-traffic/road-traffic-rest/ --also-make
fi

# Run the Road Traffic REST API System Tests
mvn verify -Psystem-test -pl example/road-traffic/road-traffic-rest -Dgaffer.rest.host=$HOST -Dgaffer.rest.port=$PORT

# Tidy up
cd ..
rm -rf Gaffer
rm -rf apache-maven-$MAVEN_VERSION
