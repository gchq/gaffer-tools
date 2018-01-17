#!/bin/bash -e

GRAPH_ID=""
GAFFER_USER=""
KMS_ID=""
PARAM_NAME=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-i|--graph-id)
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
			GAFFER_USER=$2
			shift
			;;
	esac
	shift
done

if [[ "$GAFFER_USER" == "" || "$KMS_ID" == "" || "$KMS_ID" == "" || "$PARAM_NAME" == "" ]]; then
	echo "Usage: $0 -k <kmsID> -p <ssmParameterName> -u <username> [-i <graphId>]"
	exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

if [[ ! -f ../etc/cluster.name || ! -f ../etc/gaffer.version || ! -f ../etc/gaffer.branch ]]; then
	echo "Unable to locate required configuration files!"
	exit 1
fi

CLUSTER_NAME=$(cat ../etc/cluster.name)
GAFFER_REQUESTED_VERSION=$(cat ../etc/gaffer.branch)
GAFFER_ACTUAL_VERSION=$(cat ../etc/gaffer.version)

if [ ! -f spark-accumulo-library-$GAFFER_ACTUAL_VERSION-full.jar ]; then
	if ! curl -fLO https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/spark-accumulo-library/$GAFFER_REQUESTED_VERSION/spark-accumulo-library-$GAFFER_REQUESTED_VERSION-full.jar; then
		echo "Building spark-accumulo-library-full.jar from branch $GAFFER_REQUESTED_VERSION..."
		curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_REQUESTED_VERSION.zip
		unzip $GAFFER_REQUESTED_VERSION.zip
		rm $GAFFER_REQUESTED_VERSION.zip
		cd Gaffer-$GAFFER_REQUESTED_VERSION

		source /etc/profile.d/maven.sh
		mvn clean install -Pquick -pl library/spark/spark-accumulo-library --also-make

		cp library/spark/spark-accumulo-library/target/spark-accumulo-library-$GAFFER_ACTUAL_VERSION-full.jar ../

		# Tidy up
		cd ..
		rm -rf Gaffer-$GAFFER_REQUESTED_VERSION
	fi
fi

if [ ! -f $GAFFER_USER.store.properties ]; then

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

	cat > $GAFFER_USER.store.properties <<-EOF
	gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore
	gaffer.store.properties.class=uk.gov.gchq.gaffer.accumulostore.AccumuloProperties
	accumulo.instance=$USER-$CLUSTER_NAME
	accumulo.zookeepers=$HOSTNAME
	accumulo.user=$GAFFER_USER
	accumulo.password=$PASSWORD
	gaffer.store.operation.declarations=sparkAccumuloOperationsDeclarations.json
	EOF
fi

export GRAPH_ID GAFFER_USER
spark-shell --jars ./spark-accumulo-library-$GAFFER_ACTUAL_VERSION-full.jar -i ./gaffer-spark-shell.scala
