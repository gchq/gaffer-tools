#!/bin/bash -e

USERNAME=""
VISIBILITIES=""
KMS_ID=""
PARAM_NAME=""
WAIT_HANDLE_URL=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-k|--kms)
			KMS_ID=$2
			shift
			;;
		-p|--param)
			PARAM_NAME=$2
			shift
			;;
		-v|--visibilities)
			if [ "$2" != "none" ]; then
				VISIBILITIES=$2
			fi
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
			shift
			;;
		*)
			USERNAME=$1
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

function retry {
	local cmd="$@"
	local rc=-1
	local n=1
	local limit=60

	set +e
	until [[ $rc -eq 0 || $n -gt $limit ]]; do
		let n=n+1
		sleep 10
		eval $cmd
		rc=$?
	done

	set -e
	return $rc
}

if [[ "$USERNAME" == "" || "$KMS_ID" == "" || "$PARAM_NAME" == "" ]]; then
	echo "Usage: $0 <username> -k <kmsID> -p <ssmParameterName> [-v <visibilities>] [-w <WaitHandleUrl>]"
	exit 1
fi

# Generate password for Accumulo
PASSWORD=$(openssl rand -base64 32)

# Encrypt password using AWS KMS
ENCRYPTED_PASSWORD=$(aws kms encrypt --region "$AWS_DEFAULT_REGION" --key-id "$KMS_ID" --plaintext "$PASSWORD" --output text --query CiphertextBlob)
if [ "$ENCRYPTED_PASSWORD" == "" ]; then
	echo "Unable to use AWS KMS: $KMS_ID to encrypt password!"
	exit 1
fi

# Put encrypted password into a SSM Parameter based Secret Store
# Since emr-5.7.0 this next command has started to fail as AWS is eventually consistent so sometimes this command runs
# before the IAM policy that gives the EMR cluster access to the SSM Parameter has been applied, which causes an error
# and this script to fail. We need to retry it for a few minutes.
# @see https://stackoverflow.com/questions/20156043/how-long-should-i-wait-after-applying-an-aws-iam-policy-before-it-is-valid
retry aws ssm put-parameter --name "$PARAM_NAME" --value "$ENCRYPTED_PASSWORD" --type String --overwrite

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

if [[ "$VISIBILITIES" != "" ]]; then
	VISIBILITIES="-v $VISIBILITIES"
fi

./create-accumulo-user.sh $USERNAME $VISIBILITIES <<ARGS
$PASSWORD
$PASSWORD
ARGS

tee -a spark/gaffer-spark-shell-as-$USERNAME.sh <<EOF
#!/bin/bash -e

EXTRA_OPTS=""
if [ "\$1" != "" ]; then
	EXTRA_OPTS="-i \$1"
fi

DIR="\$( cd "\$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd \$DIR

./gaffer-spark-shell.sh -k $KMS_ID -p $PARAM_NAME -u $USERNAME \$EXTRA_OPTS

EOF

chmod +x spark/gaffer-spark-shell-as-$USERNAME.sh
