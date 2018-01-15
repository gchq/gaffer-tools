#!/bin/bash -xe

SLIDER_VERSION=0.92.0-incubating
SLIDER_ACCUMULO_BRANCH=branches/branch-0.92
ACCUMULO_VERSION=1.7.2
GAFFER_VERSION=0.7.8
GAFFER_TOOLS_VERSION=0.7.8
MAVEN_VERSION=3.5.0
MVN_REPO=""

TSERVERS_PER_YARN_NODE=1
USAGE=85
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
		-u|--usage)
			USAGE=$2
			shift
			;;
		-n)
			TSERVERS_PER_YARN_NODE=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		--mvn-repo)
			if [ "$2" != "none" ]; then
				MVN_REPO=$2
			fi
			shift
			;;
		--ignore)
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
	echo "Usage: $0 <clusterName> [-a <accumuloVersion>] [-g <gafferVersion>] [-t <gafferToolsVersion>] [-s <sliderVersion>] [-u <proportionOfClusterToUseInPercent>] [-w <awsWaitHandleUrl>]"
	exit 1
fi

if [ "$MVN_REPO" != "" ]; then
	# Bootstrapping the local Maven repo is allowed to fail, we will just fallback to downloading all the dependencies
	# from Maven Central...
	set +e
	cd $HOME
	aws s3 cp s3://$MVN_REPO maven-repo.tar.gz
	tar -xf maven-repo.tar.gz
	rm -f maven-repo.tar.gz
	set -e
fi

# Install Apache Maven
MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
cd $HOME
curl -fLO $MAVEN_DOWNLOAD_URL
tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz

sudo tee /etc/profile.d/maven.sh <<EOF
#!/bin/bash
export PATH=$HOME/apache-maven-$MAVEN_VERSION/bin:\$PATH
EOF
source /etc/profile.d/maven.sh

# Install all required software and config into an instance specific directory
DST=~/slider-$CLUSTER_NAME
if [ -d $DST ]; then
	echo "A directory called $DST already exists!"
	exit 1
fi

echo "Installing all software and configuration to $DST"
mkdir -p $DST
cd $DST

echo "Installing git and xmlstarlet ..."
sudo yum install -y git xmlstarlet

# Set location of Hadoop config
export HADOOP_CONF_DIR=/etc/hadoop/conf

sudo tee /etc/profile.d/hadoop.sh <<EOF
#!/bin/bash
export HADOOP_CONF_DIR=/etc/hadoop/conf
EOF

# Set location of JDK
export JAVA_HOME=/etc/alternatives/java_sdk

# Build and install Gaffer
cd $DST

if ! curl -fL -o /dev/null https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/gaffer2/$GAFFER_VERSION/gaffer2-$GAFFER_VERSION.pom; then
	echo "Building Gaffer from branch $GAFFER_VERSION..."
	curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_VERSION.zip
	unzip $GAFFER_VERSION.zip
	rm $GAFFER_VERSION.zip
	cd Gaffer-$GAFFER_VERSION

	mvn clean install -Pquick -pl store-implementation/accumulo-store/ --also-make

	GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer version as $GAFFER_POM_VERSION"

	# Tidy up
	cd ..
	rm -rf Gaffer-$GAFFER_VERSION
else
	echo "Will use Gaffer $GAFFER_VERSION from Maven Central..."
	GAFFER_POM_VERSION=$GAFFER_VERSION
fi

# Install gaffer-slider
mkdir -p $DST/gaffer-slider
mkdir -p $DST/accumulo-pkg
cd $DST/gaffer-slider

# Make sure we only use a pre-built version of gaffer-slider if it has been built for the requested version of Gaffer
if [[ "$GAFFER_VERSION" == "$GAFFER_POM_VERSION" && "$GAFFER_VERSION" == "$GAFFER_TOOLS_VERSION" ]]; then
	curl -fL -o gaffer-slider-$GAFFER_TOOLS_VERSION.zip https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/$GAFFER_TOOLS_VERSION/slider-$GAFFER_TOOLS_VERSION.zip
	curl -fL -o gaffer-slider-$GAFFER_TOOLS_VERSION.jar https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/$GAFFER_TOOLS_VERSION/slider-$GAFFER_TOOLS_VERSION.jar
fi

if [[ ! -f gaffer-slider-$GAFFER_TOOLS_VERSION.zip || ! -f gaffer-slider-$GAFFER_TOOLS_VERSION.jar ]]; then
	echo "Building gaffer-slider from gaffer-tools branch $GAFFER_TOOLS_VERSION..."
	cd $DST

	curl -fLO https://github.com/gchq/gaffer-tools/archive/$GAFFER_TOOLS_VERSION.zip
	unzip $GAFFER_TOOLS_VERSION.zip
	rm $GAFFER_TOOLS_VERSION.zip
	cd gaffer-tools-$GAFFER_TOOLS_VERSION

	mvn clean package -Pquick -pl slider --also-make \
		-Dslider.version=$SLIDER_VERSION \
		-Dslider.accumulo.branch=$SLIDER_ACCUMULO_BRANCH \
		-Dgaffer.version=$GAFFER_POM_VERSION \
		-Daccumulo.version=$ACCUMULO_VERSION

	GAFFER_SLIDER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected gaffer-slider version as $GAFFER_SLIDER_POM_VERSION"

	cp slider/target/slider-$GAFFER_SLIDER_POM_VERSION.jar $DST/gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.jar
	cp slider/target/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip $DST/gaffer-slider/
	cp slider/target/accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip $DST/accumulo-pkg/
	cp -R slider/target/slider/slider-$SLIDER_VERSION $DST/

	# Tidy up
	cd ..
	rm -rf gaffer-tools-$GAFFER_TOOLS_VERSION
else
	echo "Will use gaffer-slider $GAFFER_TOOLS_VERSION from Maven Central..."
	GAFFER_SLIDER_POM_VERSION=$GAFFER_TOOLS_VERSION
fi

# Apache Slider
cd $DST
if [ ! -d "slider-$SLIDER_VERSION" ]; then
	SLIDER_DOWNLOAD_URL=https://repo1.maven.org/maven2/org/apache/slider/slider-assembly/$SLIDER_VERSION/slider-assembly-$SLIDER_VERSION-all.tar.gz
	echo "Downloading Apache Slider $SLIDER_VERSION from $SLIDER_DOWNLOAD_URL"
	curl -fLO $SLIDER_DOWNLOAD_URL
	tar -xf slider-assembly-$SLIDER_VERSION-all.tar.gz
	rm -f slider-assembly-$SLIDER_VERSION-all.tar.gz
fi

ln -s slider-$SLIDER_VERSION/bin/slider slider

# Configure Slider with location of ZooKeeper
echo "Configuring Slider with location of ZooKeeper ($HOSTNAME)..."
xmlstarlet ed --inplace \
	-s "/configuration" -t elem -n zkProperty -v "" \
	-s "/configuration/zkProperty" -t elem -n name -v "hadoop.registry.zk.quorum" \
	-s "/configuration/zkProperty" -t elem -n value -v "$HOSTNAME" \
	-r "/configuration/zkProperty" -v property \
	./slider-$SLIDER_VERSION/conf/slider-client.xml

# Accumulo Slider Package
cd $DST/accumulo-pkg
if [ ! -f "slider-accumulo-app-package-$ACCUMULO_VERSION.zip" ]; then
	echo "Building Accumulo Slider Application Package..."
	ACCUMULO_PKG_BUILD_URL1=https://raw.githubusercontent.com/gchq/gaffer-tools/gaffer-tools-$GAFFER_TOOLS_VERSION/slider/scripts/build_accumulo_package.sh
	ACCUMULO_PKG_BUILD_URL2=https://raw.githubusercontent.com/gchq/gaffer-tools/$GAFFER_TOOLS_VERSION/slider/scripts/build_accumulo_package.sh

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

# Download default config for EMR clusters
cd $DST/gaffer-slider

if ! curl -fLO https://raw.githubusercontent.com/gchq/gaffer-tools/gaffer-tools-$GAFFER_TOOLS_VERSION/slider/src/test/clusters/emr/accumulo/appConfig-default.json; then
	curl -fLO https://raw.githubusercontent.com/gchq/gaffer-tools/$GAFFER_TOOLS_VERSION/slider/src/test/clusters/emr/accumulo/appConfig-default.json
fi

sudo sed -i.bak "s|\${accumulo.version}|$ACCUMULO_VERSION|" appConfig-default.json

# Generate configuration for our cluster
echo "Generating gaffer-slider configuration based on current Hadoop environment..."
cd $DST/gaffer-slider
java -cp ./gaffer-slider-$GAFFER_SLIDER_POM_VERSION.jar:../slider-$SLIDER_VERSION/lib/*:$(hadoop classpath) \
	uk.gov.gchq.gaffer.slider.util.AppConfigGenerator \
	-t $TSERVERS_PER_YARN_NODE \
	-u $USAGE \
	appConfig-default.json \
	appConfig.json \
	resources.json

# Double check a Slider app with the requested name does not already exist
cd $DST
if ./slider exists $CLUSTER_NAME; then
	echo "A slider app called $CLUSTER_NAME already exists!"
	exit 1
fi

# Check that a credential keystore doesn't already exist
CREDSTORE=$(jq -r '.global."site.accumulo-site.general.security.credential.provider.paths"' ./gaffer-slider/appConfig.json)
CREDSTORE=${CREDSTORE/\$\{USER\}/$USER}
CREDSTORE=${CREDSTORE/\$\{CLUSTER_NAME\}/$CLUSTER_NAME}

if hadoop credential list -provider $CREDSTORE | grep "root.initial.password"; then
	hadoop fs -rm ${CREDSTORE/jceks:\/\/hdfs/}
fi

# Generate passwords for Accumulo
ROOT_PWD=$(openssl rand -base64 32)
SECRET=$(openssl rand -base64 32)

# Deploy Gaffer instance
echo "Deploying gaffer-slider as $CLUSTER_NAME..."
./slider create $CLUSTER_NAME \
	--appdef ./accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
	--addon Gaffer ./gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip \
	--template ./gaffer-slider/appConfig.json \
	--resources ./gaffer-slider/resources.json \
	--debug <<ARGS
$ROOT_PWD
$ROOT_PWD
$SECRET
$SECRET
$ROOT_PWD
$ROOT_PWD
ARGS

CONFIG_DIR=$DST/etc
echo "Saving configuration to $CONFIG_DIR for future use..."
mkdir -p $CONFIG_DIR
cd $CONFIG_DIR
echo "$CLUSTER_NAME" >cluster.name
echo "$SLIDER_VERSION" >slider.version
echo "$ACCUMULO_VERSION" >accumulo.version
echo "$GAFFER_POM_VERSION" >gaffer.version
echo "$GAFFER_VERSION" >gaffer.branch
echo "$GAFFER_TOOLS_VERSION" >gaffer-tools.branch
echo "$GAFFER_SLIDER_POM_VERSION" >gaffer-slider.version
echo "$ROOT_PWD" >root.password
echo "$SECRET" >instance.secret

echo "Downloading utility scripts..."
cd $DST
TOOLS_GITHUB_ROOT_URL="https://raw.githubusercontent.com/gchq/gaffer-tools/gaffer-tools-$GAFFER_TOOLS_VERSION"

if ! curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/utility-scripts/install-accumulo-client.sh; then
	TOOLS_GITHUB_ROOT_URL="https://raw.githubusercontent.com/gchq/gaffer-tools/$GAFFER_TOOLS_VERSION"
	curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/utility-scripts/install-accumulo-client.sh
fi

curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/utility-scripts/accumulo-shell.sh
curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/utility-scripts/create-accumulo-user.sh
curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/utility-scripts/create-accumulo-user-with-kms.sh
chmod +x *.sh

mkdir -p spark
cd spark
curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/spark-scripts/gaffer-spark-shell.sh
curl -fLO $TOOLS_GITHUB_ROOT_URL/deployment/aws/core/spark-scripts/gaffer-spark-shell.scala
chmod +x *.sh
cd ..

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
