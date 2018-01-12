#!/bin/bash -xe

GAFFER_VERSION=1.0.0
ACCUMULO_INSTANCE=""
ZOOKEEPERS="$HOSTNAME:2181"
DATA_URL=""
WAIT_HANDLE_URL=""
USERNAME=""
KMS_ID=""
PARAM_NAME=""

GRAPH_ID=road_traffic

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-g|--gaffer)
			GAFFER_VERSION=$2
			shift
			;;
		-i|--accumulo-instance)
			ACCUMULO_INSTANCE=$2
			shift
			;;
		--id)
			GRAPH_ID=$2
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
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		-z|--zookeepers)
			ZOOKEEPERS=$2
			shift
			;;
		*)
			DATA_URL=$1
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

if [[ "$DATA_URL" == "" || "$ACCUMULO_INSTANCE" == "" || "$USERNAME" == "" || "$KMS_ID" == "" || "$PARAM_NAME" == "" ]]; then
	echo "Usage: $0 <roadTrafficDataUrl> -i <accumuloInstance> -u <username> -k <kmsID> -p <ssmParameterName> [-g <gafferVersion>] [--id <graphId>] [-w <awsWaitHandleUrl>] [-z <zookeepers>]"
	exit 1
fi

# Need to work out if we can download the Gaffer road-traffic-generators.jar, road-traffic-model.jar and accumulo-store.jar or if we need to build it from source...
if \
	! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/road-traffic-generators/$GAFFER_VERSION/road-traffic-generators-$GAFFER_VERSION-utility.jar || \
	! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/road-traffic-model/$GAFFER_VERSION/road-traffic-model-$GAFFER_VERSION.jar || \
	! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/accumulo-store/$GAFFER_VERSION/accumulo-store-$GAFFER_VERSION-utility.jar; then

	echo "Building Gaffer road-traffic-generators.jar, road-traffic-model.jar and accumulo-store.jar from branch $GAFFER_VERSION..."
	curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_VERSION.zip
	unzip $GAFFER_VERSION.zip
	rm $GAFFER_VERSION.zip
	cd Gaffer-$GAFFER_VERSION

	source /etc/profile.d/maven.sh
	mvn clean package -Pquick -pl example/road-traffic/road-traffic-generators,example/road-traffic/road-traffic-model,store-implementation/accumulo-store --also-make

	GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer version as $GAFFER_POM_VERSION"

	cp example/road-traffic/road-traffic-generators/target/road-traffic-generators-$GAFFER_POM_VERSION-utility.jar ../
	cp example/road-traffic/road-traffic-model/target/road-traffic-model-$GAFFER_POM_VERSION.jar ../
	cp store-implementation/accumulo-store/target/accumulo-store-$GAFFER_POM_VERSION-utility.jar ../

	# Tidy up
	cd ..
	rm -rf Gaffer-$GAFFER_VERSION
else
	echo "Using Gaffer road-traffic-generators.jar, road-traffic-model.jar and accumulo-store.jar from Maven Central..."
	GAFFER_POM_VERSION=$GAFFER_VERSION
fi

# Download Road Traffic Data Set
mkdir data
cd data
curl -fLO "$DATA_URL"

# Check if we need to unzip the data set
if compgen -G "./*.zip" >/dev/null 2>&1; then
	for file in "./*.zip"; do
		unzip $file
	done
fi

cd ..

# Grab the Accumulo password from an SSM Parameter
ENCRYPTED_PASSWORD=$(aws ssm get-parameters --names "$PARAM_NAME" --region "$AWS_DEFAULT_REGION" --output text --query Parameters[0].Value)
if [ "$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to retrieve Gaffer password from AWS SSM Parameter: $PARAM_NAME"
	exit 1
fi

# Decrypt the Accumulo password
PASSWORD=$(aws kms decrypt --region "$AWS_DEFAULT_REGION" --ciphertext-blob fileb://<(echo "$ENCRYPTED_PASSWORD" | base64 -d) --query Plaintext --output text | base64 -d)
if [ "$PASSWORD" == "" ]; then
	echo "Unable to decrypt Gaffer password!"
	exit 1
fi

# Extract graph schema
jar -xf road-traffic-model-$GAFFER_POM_VERSION.jar schema/

# Create Gaffer configuration
tee -a graphConfig.json <<EOF
{
	"graphId": "$GRAPH_ID"
}
EOF

tee -a store.properties <<EOF
gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore
gaffer.store.properties.class=uk.gov.gchq.gaffer.accumulostore.AccumuloProperties
accumulo.instance=$ACCUMULO_INSTANCE
accumulo.zookeepers=$ZOOKEEPERS
accumulo.table=$GRAPH_ID
accumulo.user=$USERNAME
accumulo.password=$PASSWORD
EOF

# Load Data
java -cp ./road-traffic-generators-$GAFFER_POM_VERSION-utility.jar:./accumulo-store-$GAFFER_POM_VERSION-utility.jar \
	uk.gov.gchq.gaffer.traffic.generator.RoadTrafficDataLoader \
	./graphConfig.json \
	./schema \
	./store.properties \
	./data/*.csv

# Cleanup
rm -rf ./data
