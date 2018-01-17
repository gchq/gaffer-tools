#!/bin/bash -xe

GAFFER_TOOLS_VERSION=""
GRAPH_ID=""
ACCUMULO_INSTANCE=""
PARAM_NAME=""
ACCUMULO_USER=""
WAIT_HANDLE_URL=""
ZOOKEEPERS="$HOSTNAME:2181"

RMAT_MAX_NODE_ID=1000000000
NUM_ELEMENTS=100000
SPLITS_PER_TABLET_SERVER=1

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-g|--graph-id)
			GRAPH_ID=$2
			shift
			;;
		-i|--accumulo-instance)
			ACCUMULO_INSTANCE=$2
			shift
			;;
		-m|--max-rmat-node-id)
			RMAT_MAX_NODE_ID=$2
			shift
			;;
		-n|--num-elements)
			NUM_ELEMENTS=$2
			shift
			;;
		-p|--param)
			PARAM_NAME=$2
			shift
			;;
		-s|--splits-per-tablet-server)
			SPLITS_PER_TABLET_SERVER=$2
			shift
			;;
		-u|--user)
			ACCUMULO_USER=$2
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
			GAFFER_TOOLS_VERSION=$1
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

if [[ "$GAFFER_TOOLS_VERSION" == "" || "$GRAPH_ID" == "" || "$ACCUMULO_INSTANCE" == "" || "$PARAM_NAME" == "" || "$ACCUMULO_USER" == "" ]]; then
	echo "Usage: $0 <gafferToolsVersion> -g <graphID> -i <accumuloInstance> -p <ssmParameterName> -u <user> [-m <maxRmatNodeId>] [-n <numberOfElements>] [-s <splitsPerTabletServer>] [-z <zookeepers>] [-w <awsWaitHandleUrl>]"
	exit 1
fi

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

mkdir etc
mkdir lib
mkdir schema

# Need to work out if we can download the performance testing JAR or if we need to build it from source...
if ! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/performance-testing-accumulo-store/$GAFFER_TOOLS_VERSION/performance-testing-accumulo-store-$GAFFER_TOOLS_VERSION-full.jar; then
	echo "Building accumulo store performance testing JAR from branch $GAFFER_TOOLS_VERSION..."
	curl -fLO https://github.com/gchq/gaffer-tools/archive/$GAFFER_TOOLS_VERSION.zip
	unzip $GAFFER_TOOLS_VERSION.zip
	rm $GAFFER_TOOLS_VERSION.zip
	cd gaffer-tools-$GAFFER_TOOLS_VERSION

	source /etc/profile.d/maven.sh
	mvn clean package -Pquick -pl performance-testing/performance-testing-accumulo-store --also-make

	GAFFER_TOOLS_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer Tools version as $GAFFER_TOOLS_POM_VERSION"

	cp performance-testing/performance-testing-accumulo-store/target/performance-testing-accumulo-store-$GAFFER_TOOLS_POM_VERSION-full.jar ../lib/

	cd ..
	rm -rf gaffer-tools-$GAFFER_TOOLS_VERSION
else
	echo "Using accumulo store performance testing JAR $GAFFER_TOOLS_VERSION from Maven Central..."
	mv performance-testing-accumulo-store-$GAFFER_TOOLS_VERSION-full.jar lib/
	GAFFER_TOOLS_POM_VERSION=$GAFFER_TOOLS_VERSION
fi

# Extract graph schema
jar -xf ./lib/performance-testing-accumulo-store-*-full.jar schema/

# Accumulo store config
tee -a etc/store.properties <<EOF
gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore
gaffer.store.properties.class=uk.gov.gchq.gaffer.accumulostore.AccumuloProperties
accumulo.instance=$ACCUMULO_INSTANCE
accumulo.zookeepers=$ZOOKEEPERS
accumulo.user=$ACCUMULO_USER
accumulo.password=$PASSWORD
EOF

# Performance testing config
tee -a etc/performance-test.properties <<EOF
gaffer.graph.id=$GRAPH_ID
gaffer.performancetesting.ingest.elementSupplierClass=uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier
gaffer.performancetesting.ingest.numberOfElements=0
gaffer.performancetesting.batchSize=0
gaffer.performancetesting.rmat.includeEntities=true
gaffer.performancetesting.rmat.maxNodeId=$RMAT_MAX_NODE_ID
gaffer.accumulostore.performancetesting.ingest.tempDirectory=/user/$USER/gaffer-split-points/
gaffer.accumulostore.performancetesting.ingest.numElementsForSplitEstimation=$NUM_ELEMENTS
gaffer.accumulostore.performancetesting.ingest.numSplitPointsPerTabletServer=$SPLITS_PER_TABLET_SERVER
EOF

# Change the default memory usage for MapReduce jobs
# By default AWS configures the AM, Mappers and Reducers to use quite a lot of memory and if we don't change these
# values then the 'estimate split points' MR job that we submit below will sit and hang in the 'ACCEPTED' state as we
# allocate most of the available YARN memory to our Gaffer instance
MEM=768
MAX_MEM=614

# Ensure xmlstarlet is installed
if ! which xmlstarlet >/dev/null 2>&1; then
	sudo yum install -y xmlstarlet
fi

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='yarn.app.mapreduce.am.resource.mb']/value" -v "$MEM" \
	/etc/hadoop/conf/mapred-site.xml

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='mapreduce.map.memory.mb']/value" -v "$MEM" \
	/etc/hadoop/conf/mapred-site.xml

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='mapreduce.reduce.memory.mb']/value" -v "$MEM" \
	/etc/hadoop/conf/mapred-site.xml

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='yarn.app.mapreduce.am.command-opts']/value" -v "-Xmx${MAX_MEM}m" \
	/etc/hadoop/conf/mapred-site.xml

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='mapreduce.map.java.opts']/value" -v "-Xmx${MAX_MEM}m" \
	/etc/hadoop/conf/mapred-site.xml

sudo xmlstarlet ed --inplace \
	-u "/configuration/property[name='mapreduce.reduce.java.opts']/value" -v "-Xmx${MAX_MEM}m" \
	/etc/hadoop/conf/mapred-site.xml

# Calculate and set split points
hadoop jar ./lib/performance-testing-accumulo-store-$GAFFER_TOOLS_POM_VERSION-full.jar \
	uk.gov.gchq.gaffer.accumulostore.performancetesting.ingest.AccumuloElementIngestTest \
	./schema \
	./etc/store.properties \
	./etc/performance-test.properties

# Cleanup
rm -rf etc
rm -rf lib
rm -rf schema
