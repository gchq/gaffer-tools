#!/bin/bash -xe

# Install required software
sudo yum remove -y java-1.7.0-openjdk
sudo yum install -y java-1.8.0-openjdk-devel

MAVEN_VERSION=3.5.0
MAVEN_DOWNLOAD_URL=https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
function install_dev_tools {
	# Install Apache Maven
	if ! which mvn >/dev/null 2>&1; then
		echo "Downloading Apache Maven $MAVEN_VERSION from $MAVEN_DOWNLOAD_URL"
		curl -fLO $MAVEN_DOWNLOAD_URL
		tar -xf apache-maven-$MAVEN_VERSION-bin.tar.gz
		rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
		export PATH=$PWD/apache-maven-$MAVEN_VERSION/bin:$PATH
	fi
}

# Grab the Accumulo password from an SSM Parameter
ENCRYPTED_PASSWORD=$(aws ssm get-parameters --names "$PASSWORD_PARAM" --region "$AWS_REGION" --output text --query Parameters[0].Value)
if [ "$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to retrieve Gaffer password from AWS SSM Parameter: $PASSWORD_PARAM"
	exit 1
fi

# Decrypt the Accumulo password
PASSWORD=$(aws kms decrypt --region "$AWS_REGION" --ciphertext-blob fileb://<(echo "$ENCRYPTED_PASSWORD" | base64 -d) --query Plaintext --output text | base64 -d)
if [ "$PASSWORD" == "" ]; then
	echo "Unable to decrypt Gaffer password!"
	exit 1
fi

# Discover this instance's ID
INSTANCE_ID=$(curl http://169.254.169.254/latest/meta-data/instance-id)
if [ "$INSTANCE_ID" == "" ]; then
	echo "Unable to discover instance ID for this server"
	exit 1
fi

if [ "$MVN_REPO" != "" ]; then
	# Bootstrapping the local Maven repo is allowed to fail, we will just fallback to downloading all the dependencies
	# from Maven Central...
	set +e
	cd /root
	aws s3 cp s3://$MVN_REPO maven-repo.tar.gz
	tar -xf maven-repo.tar.gz
	rm -f maven-repo.tar.gz
	set -e
fi

# Create Gaffer configuration
INSTALL_DIR=/opt/gaffer

mkdir -p $INSTALL_DIR/etc
mkdir -p $INSTALL_DIR/lib
cd $INSTALL_DIR

tee -a etc/store.properties <<EOF
gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore
gaffer.store.properties.class=uk.gov.gchq.gaffer.accumulostore.AccumuloProperties

accumulo.instance=$ACCUMULO_INSTANCE
accumulo.zookeepers=$ZOOKEEPERS
accumulo.user=$ACCUMULO_USERNAME
accumulo.password=$PASSWORD

accumulo.maxBufferSizeForBatchWriterInBytes=$INGEST_MAX_BUFFER_BYTES
accumulo.maxTimeOutForBatchWriterInMilliseconds=$INGEST_MAX_TIMEOUT_MILLIS
accumulo.numThreadsForBatchWriter=$INGEST_NUM_THREADS
EOF

tee -a etc/performance-test.properties <<EOF
gaffer.performancetesting.ingest.elementSupplierClass=uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier
gaffer.performancetesting.ingest.numberOfElements=$INGEST_NUM_ELEMENTS

gaffer.performancetesting.query.idSupplierClass=uk.gov.gchq.gaffer.randomelementgeneration.supplier.EntitySeedSupplier
gaffer.performancetesting.query.numSeeds=$QUERY_NUM_SEEDS

gaffer.graph.id=$GAFFER_GRAPH_ID
gaffer.performancetesting.batchSize=$BATCH_SIZE
gaffer.performancetesting.rmat.includeEntities=$INGEST_INCLUDE_ENTITIES
gaffer.performancetesting.rmat.maxNodeId=$RMAT_MAX_NODE_ID

gaffer.performancetesting.metricsListener=uk.gov.gchq.gaffer.performancetesting.aws.CloudWatchMetricsListener
gaffer.performancetesting.cloudwatchmetricslistener.namespace=Gaffer
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.1.name=EmrJobFlowId
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.1.value=$EMR_JOB_FLOW_ID
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.2.name=InstanceName
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.2.value=$ACCUMULO_INSTANCE
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.3.name=TableName
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.3.value=$GAFFER_GRAPH_ID
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.4.name=InstanceId
gaffer.performancetesting.cloudwatchmetricslistener.dimensions.4.value=$INSTANCE_ID
EOF

# Need to work out if we can download the AWS performance testing JAR or if we need to build it from source...
if ! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/performance-testing-aws/$GAFFER_TOOLS_VERSION/performance-testing-aws-$GAFFER_TOOLS_VERSION-full.jar; then
	echo "Building aws performance testing JAR from branch $GAFFER_TOOLS_VERSION..."
	install_dev_tools

	curl -fLO https://github.com/gchq/gaffer-tools/archive/$GAFFER_TOOLS_VERSION.zip
	unzip $GAFFER_TOOLS_VERSION.zip
	rm $GAFFER_TOOLS_VERSION.zip
	cd gaffer-tools-$GAFFER_TOOLS_VERSION

	mvn clean package -Pquick -pl performance-testing/performance-testing-aws --also-make

	GAFFER_TOOLS_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
	echo "Detected Gaffer Tools version as $GAFFER_TOOLS_POM_VERSION"

	cp performance-testing/performance-testing-aws/target/performance-testing-aws-$GAFFER_TOOLS_POM_VERSION-full.jar ../lib/

	cd ..
	rm -rf gaffer-tools-$GAFFER_TOOLS_VERSION
else
	echo "Using aws performance testing JAR $GAFFER_TOOLS_VERSION from Maven Central..."
	mv performance-testing-aws-$GAFFER_TOOLS_VERSION-full.jar lib/
	GAFFER_TOOLS_POM_VERSION=$GAFFER_TOOLS_VERSION
fi

# Extract graph schema
jar -xf ./lib/performance-testing-aws-*-full.jar schema/

if [ "$GENERATOR_TYPE" == "data" ]; then
	# Generate and ingest random data
	java -Xms512m -Xmx1g -cp ./lib/performance-testing-aws-$GAFFER_TOOLS_POM_VERSION-full.jar \
		uk.gov.gchq.gaffer.performancetesting.ingest.ElementIngestTest \
		./schema \
		./etc/store.properties \
		./etc/performance-test.properties
elif [ "$GENERATOR_TYPE" == "query" ]; then
	# Run random queries
	java -Xms512m -Xmx1g -cp ./lib/performance-testing-aws-$GAFFER_TOOLS_POM_VERSION-full.jar \
		uk.gov.gchq.gaffer.performancetesting.query.QueryTest \
		./schema \
		./etc/store.properties \
		./etc/performance-test.properties
else
	echo "Unknown generator type: $GENERATOR_TYPE"
	exit 1
fi
