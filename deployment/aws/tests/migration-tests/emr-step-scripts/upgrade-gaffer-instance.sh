#!/bin/bash -xe

SLIDER_VERSION=0.92.0-incubating
SLIDER_ACCUMULO_BRANCH=branches/branch-0.92
ACCUMULO_VERSION=1.7.2
GAFFER_VERSION=0.7.8
GAFFER_TOOLS_VERSION=0.7.8

USERNAME=""
KMS_ID=""
PARAM_NAME=""
GAFFER_INSTANCE_NAME=""
ACCUMULO_INSTANCE_NAME=""
GRAPH_ID=""
SCHEMA=""
ZOOKEEPERS="$HOSTNAME:2181"
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
		-k|--kms)
			KMS_ID=$2
			shift
			;;
		-p|--param)
			PARAM_NAME=$2
			shift
			;;
		-u|--username)
			USERNAME=$2
			shift
			;;
		-gi|--gaffer-instance)
			GAFFER_INSTANCE_NAME=$2
			shift
			;;
		-ai|--accumulo-instance)
			ACCUMULO_INSTANCE_NAME=$2
			shift
			;;
		--schema)
			SCHEMA=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		-z|--zookeepers)
			ZOOKEEPERS=$2
			shift
			;;
		*)
			GRAPH_ID=$1
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

if [[ "$GAFFER_INSTANCE_NAME" == "" || "$ACCUMULO_INSTANCE_NAME" == "" || "$GRAPH_ID" == "" || "$SCHEMA" == "" || "$USERNAME" == "" || "$KMS_ID" == "" || "$PARAM_NAME" == "" ]]; then
	echo "Usage: $0 -gi <gafferInstanceName> -ai <accumuloInstanceName> -u <username> -k <kmsID> -p <ssmParameterName> --schema <schemaJar> <graphId> [-a <accumuloVersion>] [-g <gafferVersion>] [-t <gafferToolsVersion>] [-s <sliderVersion>] [-z <zookeepers>] [-w <awsWaitHandleUrl>]"
	exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo "Downloading new graph schema from S3..."
aws s3 cp $SCHEMA schema.jar
jar -xf schema.jar schema/

echo "Obtaining Accumulo password from SSM parameter..."
ENCRYPTED_PASSWORD=$(aws ssm get-parameters --names "$PARAM_NAME" --region "$AWS_DEFAULT_REGION" --output text --query Parameters[0].Value)
if [ "$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to retrieve Gaffer password from AWS SSM Parameter: $PARAM_NAME"
	exit 1
fi

echo "Decrypting Accumulo password using KMS..."
PASSWORD=$(aws kms decrypt --region "$AWS_DEFAULT_REGION" --ciphertext-blob fileb://<(echo "$ENCRYPTED_PASSWORD" | base64 -d) --query Plaintext --output text | base64 -d)
if [ "$PASSWORD" == "" ]; then
	echo "Unable to decrypt Gaffer password!"
	exit 1
fi

echo "Creating Gaffer Store properties file..."
tee store.props <<EOF
gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore
gaffer.store.properties.class=uk.gov.gchq.gaffer.accumulostore.AccumuloProperties
accumulo.instance=$ACCUMULO_INSTANCE_NAME
accumulo.zookeepers=$ZOOKEEPERS
accumulo.table=$GRAPH_ID
accumulo.user=$USERNAME
accumulo.password=$PASSWORD
EOF

DST=~/slider-$GAFFER_INSTANCE_NAME
if [ ! -d $DST ]; then
	echo "Unable to find an existing Gaffer instance in: $DST"
	exit 1
fi

# Double check a Slider app with the requested name does already exist
cd $DST
if ! ./slider exists $GAFFER_INSTANCE_NAME; then
	echo "A slider app called $GAFFER_INSTANCE_NAME does not exist!"
	exit 1
fi

echo "Taking the Accumulo table offline..."
./accumulo-shell.sh -e "offline $GRAPH_ID -w"

echo "Stopping the Gaffer instance..."
./slider stop $GAFFER_INSTANCE_NAME

source /etc/profile.d/maven.sh

# Set location of Hadoop config
export HADOOP_CONF_DIR=/etc/hadoop/conf

# Set location of JDK
export JAVA_HOME=/etc/alternatives/java_sdk

# Build and install Gaffer
cd $DIR

if ! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/accumulo-store/$GAFFER_VERSION/accumulo-store-$GAFFER_VERSION-utility.jar; then
	echo "Building Gaffer from branch $GAFFER_VERSION..."
	curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_VERSION.zip
	unzip $GAFFER_VERSION.zip
	rm $GAFFER_VERSION.zip
	cd Gaffer-$GAFFER_VERSION

	mvn clean install -Pquick -pl store-implementation/accumulo-store/ --also-make

	GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer version as $GAFFER_POM_VERSION"

	cp store-implementation/accumulo-store/target/accumulo-store-$GAFFER_POM_VERSION-utility.jar ../

	# Tidy up
	cd ..
	rm -rf Gaffer-$GAFFER_VERSION
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

	cp -f slider/target/slider-$GAFFER_SLIDER_POM_VERSION.jar $DST/gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.jar
	cp -f slider/target/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip $DST/gaffer-slider/
	cp -f slider/target/accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip $DST/accumulo-pkg/
	cp -f -R slider/target/slider/slider-$SLIDER_VERSION $DST/

	# Tidy up
	cd ..
	rm -rf gaffer-tools-$GAFFER_TOOLS_VERSION
else
	echo "Will use gaffer-slider $GAFFER_TOOLS_VERSION from Maven Central..."
	GAFFER_SLIDER_POM_VERSION=$GAFFER_TOOLS_VERSION
fi

# Install Apache Slider
cd $DST
if [ ! -d "slider-$SLIDER_VERSION" ]; then
	SLIDER_DOWNLOAD_URL=https://repo1.maven.org/maven2/org/apache/slider/slider-assembly/$SLIDER_VERSION/slider-assembly-$SLIDER_VERSION-all.tar.gz
	echo "Downloading Apache Slider $SLIDER_VERSION from $SLIDER_DOWNLOAD_URL"
	curl -fLO $SLIDER_DOWNLOAD_URL
	tar -xf slider-assembly-$SLIDER_VERSION-all.tar.gz
	rm -f slider-assembly-$SLIDER_VERSION-all.tar.gz
fi

if [ -f slider ]; then
	rm -f slider
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

# Accumulo Slider package
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

cd $DST
echo "Upgrading Gaffer instance..."
hadoop fs -rm .slider/cluster/$GAFFER_INSTANCE_NAME/appdef/appPkg.zip
hadoop fs -rm .slider/cluster/$GAFFER_INSTANCE_NAME/addons/Gaffer/addon_Gaffer.zip
./slider update $GAFFER_INSTANCE_NAME \
	--appdef ./accumulo-pkg/slider-accumulo-app-package-$ACCUMULO_VERSION.zip \
	--addon Gaffer ./gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip \
	--template ./gaffer-slider/appConfig.json \
	--resources ./gaffer-slider/resources.json \
	--debug

echo "Starting Gaffer instance..."
./slider start $GAFFER_INSTANCE_NAME

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

		echo "Migrating Accumulo Store..."
		cd $DIR
		java -cp ./accumulo-store-$GAFFER_POM_VERSION-utility.jar \
			uk.gov.gchq.gaffer.accumulostore.utils.AddUpdateTableIterator \
			$GRAPH_ID \
			./schema/ \
			./store.props \
			update

		echo "Putting the Accumulo table back online..."
		cd $DST
		./accumulo-shell.sh -e "online $GRAPH_ID -w"

		echo "Done!"
		exit 0
	else
		echo "Gaffer instance is not ready yet, sleeping for $INTERVAL secs..."
		sleep $INTERVAL
	fi
done

echo "Gaffer instance is still not ready, deployment must have failed..."
exit 1
