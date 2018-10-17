#!/bin/bash -e

if [[ $# -ne 4 && $# -ne 5 ]]; then
	echo "Usage: $0 <appName> <username> <kmsID> <ssmParameterName> [<WaitHandleUrl>]"
	exit 1
fi

CLUSTER_NAME=$1
USERNAME=$2
KMS_ID=$3
PARAM_NAME=$4

WAIT_HANDLE_URL=""
if [[ "$5" ]]; then
	WAIT_HANDLE_URL="$5"

	function awsSignal {
		/opt/aws/bin/cfn-signal -e $? "$WAIT_HANDLE_URL"
	}
	trap awsSignal EXIT
fi

SLIDER_APP_DIR=~/slider-$CLUSTER_NAME
if [ ! -d $SLIDER_APP_DIR ]; then
	echo "Expected to find a Slider application directory for $CLUSTER_NAME in $SLIDER_APP_DIR!"
	exit 2
fi

# Generate password for Accumulo
PASSWORD=$(openssl rand -base64 32)

# Encrypt password using AWS KMS
ENCRYPTED_PASSWORD=$(aws kms encrypt --region "$AWS_DEFAULT_REGION" --key-id "$KMS_ID" --plaintext "$PASSWORD" --output text --query CiphertextBlob)
if [ "$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to use AWS KMS: $KMS_ID to encrypt password!"
	exit 3
fi

# Put encrypted password into a SSM Parameter based Secret Store
aws ssm put-parameter --name "$PARAM_NAME" --value "$ENCRYPTED_PASSWORD" --type String --overwrite

GAFFER_INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $SLIDER_APP_DIR
$GAFFER_INSTALL_DIR/create-accumulo-user.sh $USERNAME <<ARGS
$PASSWORD
$PASSWORD
ARGS
