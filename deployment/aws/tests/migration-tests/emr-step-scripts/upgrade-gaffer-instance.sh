#!/bin/bash -xe

SLIDER_VERSION=0.92.0-incubating
SLIDER_ACCUMULO_BRANCH=branches/branch-0.92
ACCUMULO_VERSION=1.7.2
GAFFER_VERSION=0.7.8
GAFFER_TOOLS_VERSION=0.7.8
MAVEN_VERSION=3.5.0

CLUSTER_NAME=""
WAIT_HANDLE_URL=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-a|--accumulo)
			ACCUMULO_VERSION=$2
			shift
			;;
		-g|--gaffer)
			GAFFER_VERSION=$2
			shift
			;;
		-s|--slider)
			SLIDER_VERSION=$2
			shift
			;;
		-t|--gaffer-tools)
			GAFFER_TOOLS_VERSION=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		*)
			CLUSTER_NAME=$1
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

if [ "$CLUSTER_NAME" == "" ]; then
	echo "Usage: $0 <clusterName> [-a <accumuloVersion>] [-g <gafferVersion>] [-t <gafferToolsVersion>] [-s <sliderVersion>] [-w <awsWaitHandleUrl>]"
	exit 1
fi

DST=~/slider-$CLUSTER_NAME
if [ ! -d $DST ]; then
	echo "Unable to find an existing Gaffer instance in: $DST"
	exit 1
fi

# Double check a Slider app with the requested name does already exist
cd $DST
if ! ./slider exists $CLUSTER_NAME; then
	echo "A slider app called $CLUSTER_NAME does not exist!"
	exit 1
fi

# Stop the Gaffer instance
./slider stop $CLUSTER_NAME

# Ensure some dependencies are installed
PKGS_TO_INSTALL=()

if ! which xmlstarlet >/dev/null 2>&1; then
	PKGS_TO_INSTALL+=(xmlstarlet)
fi

if ! which git >/dev/null 2>&1; then
	PKGS_TO_INSTALL+=(git)
fi

if [ ${#PKGS_TO_INSTALL[@]} -gt 0 ]; then
	echo "Installing ${PKGS_TO_INSTALL[@]} ..."
	sudo yum install -y ${PKGS_TO_INSTALL[@]}
fi

# Install Apache Maven
export PATH=$DST/apache-maven-$MAVEN_VERSION/bin:$PATH
MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
if [ ! -d "apache-maven-$MAVEN_VERSION" ]; then
	echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
	curl -fLO $MAVEN_DOWNLOAD_URL
	tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
	rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
fi

# Install Apache Slider
SLIDER_DOWNLOAD_URL=https://repo1.maven.org/maven2/org/apache/slider/slider-assembly/$SLIDER_VERSION/slider-assembly-$SLIDER_VERSION-all.tar.gz
if [ ! -d "slider-$SLIDER_VERSION" ]; then
	echo "Downloading Apache Slider $SLIDER_VERSION from $SLIDER_DOWNLOAD_URL"
	curl -fLO $SLIDER_DOWNLOAD_URL
	tar -xf slider-assembly-$SLIDER_VERSION-all.tar.gz
	ln -s slider-$SLIDER_VERSION/bin/slider slider

	# Configure Slider with location of ZooKeeper
	echo "Configuring Slider with location of ZooKeeper ($HOSTNAME)..."
	xmlstarlet ed --inplace \
		-s "/configuration" -t elem -n zkProperty -v "" \
		-s "/configuration/zkProperty" -t elem -n name -v "hadoop.registry.zk.quorum" \
		-s "/configuration/zkProperty" -t elem -n value -v "$HOSTNAME" \
		-r "/configuration/zkProperty" -v property \
		./slider-$SLIDER_VERSION/conf/slider-client.xml
fi

# Set location of Hadoop config
export HADOOP_CONF_DIR=/etc/hadoop/conf

# Set location of JDK
export JAVA_HOME=/etc/alternatives/java_sdk

# Install Accumulo application package
mkdir -p accumulo-pkg
cd accumulo-pkg

ACCUMULO_PKG_BUILD_URL1=https://raw.githubusercontent.com/gchq/gaffer-tools/gaffer-tools-$GAFFER_TOOLS_VERSION/slider/scripts/build_accumulo_package.sh
ACCUMULO_PKG_BUILD_URL2=https://raw.githubusercontent.com/gchq/gaffer-tools/$GAFFER_TOOLS_VERSION/slider/scripts/build_accumulo_package.sh

if [ ! -f "slider-accumulo-app-package-$ACCUMULO_VERSION.zip" ]; then
	echo "Building Accumulo Slider Application Package..."
	echo "Trying to download Accumulo build script from $ACCUMULO_PKG_BUILD_URL1"
	if ! curl -fLO $ACCUMULO_PKG_BUILD_URL1; then
		echo "Trying to download Accumulo build script from $ACCUMULO_PKG_BUILD_URL2"
		curl -fLO $ACCUMULO_PKG_BUILD_URL2
	fi

	if [ ! -f ./build_accumulo_package.sh ]; then
		echo "Failed to download the build_accumulo_package.sh script from the gaffer-tools github repo!"
		exit 1
	fi

	echo "Running Accumulo build script..."
	chmod +x ./build_accumulo_package.sh
	./build_accumulo_package.sh $SLIDER_ACCUMULO_BRANCH $ACCUMULO_VERSION . --build-native
fi

# Build and install Gaffer
cd $DST

if ! curl -fL -o /dev/null https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/gaffer2/$GAFFER_VERSION/gaffer2-$GAFFER_VERSION.pom; then
	echo "Building Gaffer from branch $GAFFER_VERSION..."
	git clone -b $GAFFER_VERSION --depth 1 https://github.com/gchq/Gaffer.git
	cd Gaffer
	mvn clean install -Pquick -pl store-implementation/accumulo-store/ --also-make

	GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer version as $GAFFER_POM_VERSION"

	# Tidy up
	cd ..
	rm -rf Gaffer
else
	echo "Will use Gaffer $GAFFER_VERSION from Maven Central..."
	GAFFER_POM_VERSION=$GAFFER_VERSION
fi

# Install gaffer-slider
mkdir -p $DST/gaffer-slider
cd $DST/gaffer-slider

# Make sure we only use a pre-built version of gaffer-slider if it has been built for the requested version of Gaffer
if [[ "$GAFFER_VERSION" == "$GAFFER_POM_VERSION" && "$GAFFER_VERSION" == "$GAFFER_TOOLS_VERSION" ]]; then
	curl -fL -o gaffer-slider-$GAFFER_TOOLS_VERSION.zip https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/$GAFFER_TOOLS_VERSION/slider-$GAFFER_TOOLS_VERSION.zip
	curl -fL -o gaffer-slider-$GAFFER_TOOLS_VERSION.jar https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/$GAFFER_TOOLS_VERSION/slider-$GAFFER_TOOLS_VERSION.jar
fi

if [[ ! -f gaffer-slider-$GAFFER_TOOLS_VERSION.zip || ! -f gaffer-slider-$GAFFER_TOOLS_VERSION.jar ]]; then
	echo "Building gaffer-slider from gaffer-tools branch $GAFFER_TOOLS_VERSION..."
	cd $DST
	git clone -b $GAFFER_TOOLS_VERSION --depth 1 https://github.com/gchq/gaffer-tools.git
	cd gaffer-tools/slider
	mvn clean package -Pquick -Dgaffer.version=$GAFFER_POM_VERSION

	GAFFER_SLIDER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' ../pom.xml)
	echo "Detected gaffer-slider version as $GAFFER_SLIDER_POM_VERSION"

	cp target/slider-$GAFFER_SLIDER_POM_VERSION.jar $DST/gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.jar
	cp target/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip $DST/gaffer-slider/

	# Tidy up
	cd ../../
	rm -rf gaffer-tools
else
	echo "Will use gaffer-slider $GAFFER_TOOLS_VERSION from Maven Central..."
	GAFFER_SLIDER_POM_VERSION=$GAFFER_TOOLS_VERSION
fi

echo "Upgrading Gaffer instance..."
hadoop fs -rm .slider/cluster/$CLUSTER_NAME/appdef/appPkg.zip
hadoop fs -rm .slider/cluster/$CLUSTER_NAME/addons/Gaffer/addon_Gaffer.zip
./slider update $CLUSTER_NAME \
	--appdef ./accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
	--addon Gaffer ./gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip \
	--template ./gaffer-slider/appConfig.json \
	--resources ./gaffer-slider/resources.json \
	--debug

echo "Starting Gaffer instance..."
./slider start $CLUSTER_NAME

CONFIG_DIR=$DST/etc
echo "Updating configuration in $CONFIG_DIR..."
cd $CONFIG_DIR
echo "$SLIDER_VERSION" >slider.version
echo "$ACCUMULO_VERSION" >accumulo.version
echo "$GAFFER_POM_VERSION" >gaffer.version
echo "$GAFFER_VERSION" >gaffer.branch
echo "$GAFFER_TOOLS_VERSION" >gaffer-tools.branch
echo "$GAFFER_SLIDER_POM_VERSION" >gaffer-slider.version

cd $DST
rm -rf accumulo
echo "Waiting for deployed Gaffer instance to be ready..."
MAX_ATTEMPTS=30
INTERVAL=10

for (( i=0; i<=$MAX_ATTEMPTS; i++ )); do
	if ./install-accumulo-client.sh; then
		echo "Gaffer instance is ready :D"
		exit 0
	else
		echo "Gaffer instance is not ready yet, sleeping for $INTERVAL secs..."
		sleep $INTERVAL
	fi
done

echo "Gaffer instance is still not ready, deployment must have failed..."
exit 1
