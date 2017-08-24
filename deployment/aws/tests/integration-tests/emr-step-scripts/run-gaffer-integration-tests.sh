#!/bin/bash -xe

GAFFER_VERSION=""
ACCUMULO_INSTANCE=""
KMS_ID=""
PARAM_NAME=""
PASSWORD=""
ACCUMULO_USER=""
WAIT_HANDLE_URL=""
ZOOKEEPERS="$HOSTNAME:2181"

MAVEN_VERSION=3.5.0

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-i|--accumulo-instance)
			ACCUMULO_INSTANCE=$2
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
		--password)
			PASSWORD=$2
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
	echo "Usage: $0 <gafferVersion> -i <accumuloInstance> -k <kmsID> -p <ssmParameterName> -u <user> -z <zookeepers> [-w <awsWaitHandleUrl>]"
	exit 1
}

if [[ "$GAFFER_VERSION" == "" || "$ACCUMULO_INSTANCE" == "" || "$ACCUMULO_USER" == "" || "$ZOOKEEPERS" == "" ]]; then
	printUsage
fi

if [ "$PASSWORD" == "" ] && [[ "$KMS_ID" == "" || "$PARAM_NAME" == "" ]]; then
	printUsage
fi

if [[ "$PASSWORD" == "" ]]; then

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

fi

# Make sure git is installed
if ! which git >/dev/null 2>&1; then
	sudo yum install -y git
fi

# Install Apache Maven
if ! which mvn >/dev/null 2>&1; then
	MAVEN_DOWNLOAD_URL=http://www.mirrorservice.org/sites/ftp.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
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

# Configure Gaffer to test against the Gaffer instance deployed on the EMR cluster
for file in ./store-implementation/accumulo-store/src/test/resources/*.properties; do
	sed -i "s|^gaffer.store.class=.*$|gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.SingleUseAccumuloStore|" $file
	sed -i "s|^accumulo.instance=.*$|accumulo.instance=$ACCUMULO_INSTANCE|" $file
	sed -i "s|^accumulo.zookeepers=.*$|accumulo.zookeepers=$ZOOKEEPERS|" $file
	sed -i "s|^accumulo.user=.*$|accumulo.user=$ACCUMULO_USER|" $file
	sed -i "s|^accumulo.password=.*$|accumulo.password=$PASSWORD|" $file
	sed -i "s|^accumulo.file.replication=.*$|accumulo.file.replication=3|" $file
done

# Run integration tests for Accumulo store
mvn verify -Pintegration-test -pl store-implementation/accumulo-store --also-make

# Clean up
cd ..
rm -rf Gaffer
rm -rf apache-maven-$MAVEN_VERSION
