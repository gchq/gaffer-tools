#!/bin/bash -xe

SLIDER_VERSION=0.92.0-incubating
SLIDER_ACCUMULO_BRANCH=branches/branch-0.92
ACCUMULO_VERSION=1.7.2
GAFFER_VERSION=0.7.8
GAFFER_TOOLS_VERSION=0.7.8
MAVEN_VERSION=3.5.0

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

# Install all required software and config into an instance specific directory
DST=~/slider-$CLUSTER_NAME
if [ -d $DST ]; then
	echo "A directory called $DST already exists!"
	exit 1
fi

echo "Installing all software and configuration to $DST"
mkdir -p $DST

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
MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
cd $DST
curl -fLO $MAVEN_DOWNLOAD_URL
tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
export PATH=$DST/apache-maven-$MAVEN_VERSION/bin:$PATH

# Install Apache Slider
SLIDER_DOWNLOAD_URL=https://repo1.maven.org/maven2/org/apache/slider/slider-assembly/$SLIDER_VERSION/slider-assembly-$SLIDER_VERSION-all.tar.gz
echo "Downloading Apache Slider $SLIDER_VERSION from $SLIDER_DOWNLOAD_URL"
cd $DST
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

# Set location of Hadoop config
export HADOOP_CONF_DIR=/etc/hadoop/conf

sudo tee /etc/profile.d/hadoop.sh <<EOF
#!/bin/bash
export HADOOP_CONF_DIR=/etc/hadoop/conf
EOF

# Set location of JDK
export JAVA_HOME=/etc/alternatives/java_sdk

# Install Accumulo application package
echo "Building Accumulo Slider Application Package..."
cd $DST
mkdir accumulo-pkg
cd accumulo-pkg

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

	mvn clean package -Pquick -pl slider --also-make -Dgaffer.version=$GAFFER_POM_VERSION

	GAFFER_SLIDER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' ../pom.xml)
	echo "Detected gaffer-slider version as $GAFFER_SLIDER_POM_VERSION"

	cp target/slider-$GAFFER_SLIDER_POM_VERSION.jar $DST/gaffer-slider/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.jar
	cp target/gaffer-slider-$GAFFER_SLIDER_POM_VERSION.zip $DST/gaffer-slider/

	# Tidy up
	cd ../../
	rm -rf gaffer-tools-$GAFFER_TOOLS_VERSION
else
	echo "Will use gaffer-slider $GAFFER_TOOLS_VERSION from Maven Central..."
	GAFFER_SLIDER_POM_VERSION=$GAFFER_TOOLS_VERSION
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

echo "Generating admin helper scripts..."
cd $DST

tee install-accumulo-client.sh <<EOF
#!/bin/bash -e

DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd \$DIR

DST=accumulo
CLUSTER_NAME=\$(cat ./etc/cluster.name)
ACCUMULO_VERSION=\$(cat ./etc/accumulo.version)

if [ ! -d "\$DST" ]; then
	mkdir -p "\$DST"
	./slider client \\
		--install \\
		--dest "\$DST" \\
		--package ./accumulo-pkg/slider-accumulo-app-package-\$ACCUMULO_VERSION.zip \\
		--name \$CLUSTER_NAME \\
		--debug \\
	|| (rm -rf "\$DST" && exit 1)
fi

EOF

tee accumulo-shell.sh <<EOF
#!/bin/bash -e

DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd \$DIR
./install-accumulo-client.sh || exit 1
./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password --disable-auth-timeout "\$@"

EOF

tee create-accumulo-user.sh <<EOF
#!/bin/bash -e

USERNAME=""
PASSWORD=""
VISIBILITIES=""

while [[ \$# -gt 0 ]]; do
	key="\$1"

	case \$key in
		-p|--password)
			PASSWORD=\$2
			shift
			;;
		-v|--visibilities)
			VISIBILITIES=\$2
			shift
			;;
		*)
			USERNAME=\$1
			;;
	esac
	shift
done

if [ "\$USERNAME" == "" ]; then
	echo "Usage: \$0 <username> [-v <visibilities>]"
	exit 1
fi

if [ "\$PASSWORD" == "" ]; then
	while true; do
		read -s -p "Password: " PASSWORD
		echo
		read -s -p "Confirm Password: " PASSWORD2
		echo
		[ "\$PASSWORD" = "\$PASSWORD2" ] && break
		echo "Passwords do not match, please try again..."
	done
fi

DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd \$DIR
./install-accumulo-client.sh || exit 1

./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "createuser \$USERNAME" <<ARGS
\$PASSWORD
\$PASSWORD
ARGS

./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "grant -u \$USERNAME -s System.CREATE_TABLE"

if [[ "\$VISIBILITIES" != "" ]]; then
	./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "setauths -u \$USERNAME -s \$VISIBILITIES"
fi

EOF

tee create-accumulo-user-with-kms.sh <<EOF
#!/bin/bash -e

USERNAME=""
VISIBILITIES=""
KMS_ID=""
PARAM_NAME=""
WAIT_HANDLE_URL=""

while [[ \$# -gt 0 ]]; do
	key="\$1"

	case \$key in
		-k|--kms)
			KMS_ID=\$2
			shift
			;;
		-p|--param)
			PARAM_NAME=\$2
			shift
			;;
		-v|--visibilities)
			if [ "\$2" != "none" ]; then
				VISIBILITIES=\$2
			fi
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=\$2
			shift
			;;
		*)
			USERNAME=\$1
			;;
	esac
	shift
done

if [[ "\$WAIT_HANDLE_URL" ]]; then
	function awsSignal {
		/opt/aws/bin/cfn-signal -e \$? "\$WAIT_HANDLE_URL"
	}
	trap awsSignal EXIT
fi

if [[ "\$USERNAME" == "" || "\$KMS_ID" == "" || "\$PARAM_NAME" == "" ]]; then
	echo "Usage: \$0 <username> -k <kmsID> -p <ssmParameterName> [-v <visibilities>] [-w <WaitHandleUrl>]"
	exit 1
fi

# Generate password for Accumulo
PASSWORD=\$(openssl rand -base64 32)

# Encrypt password using AWS KMS
ENCRYPTED_PASSWORD=\$(aws kms encrypt --region "\$AWS_DEFAULT_REGION" --key-id "\$KMS_ID" --plaintext "\$PASSWORD" --output text --query CiphertextBlob)
if [ "\$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to use AWS KMS: \$KMS_ID to encrypt password!"
	exit 1
fi

# Put encrypted password into a SSM Parameter based Secret Store
aws ssm put-parameter --name "\$PARAM_NAME" --value "\$ENCRYPTED_PASSWORD" --type String --overwrite

DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd \$DIR

if [[ "\$VISIBILITIES" != "" ]]; then
	VISIBILITIES="-v \$VISIBILITIES"
fi

./create-accumulo-user.sh \$USERNAME \$VISIBILITIES <<ARGS
\$PASSWORD
\$PASSWORD
ARGS

EOF

chmod +x *.sh

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
