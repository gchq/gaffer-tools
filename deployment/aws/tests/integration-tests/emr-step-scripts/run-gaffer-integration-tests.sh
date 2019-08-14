#!/bin/bash -xe

GAFFER_VERSION=""
ACCUMULO_INSTANCE=""
KMS_ID=""
PARAM_NAME=""
PASSWORD=""
SNS_ARN=""
STACK_ID=""
ACCUMULO_USER=""
WAIT_HANDLE_URL=""
ZOOKEEPERS="$HOSTNAME:2181"

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
		-s|--sns)
			if [ "$2" != "none" ]; then
				SNS_ARN=$2
			fi
			shift
			;;
		--stack-id)
			STACK_ID=$2
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
		--ignore)
			shift
			;;
		*)
			GAFFER_VERSION=$1
			;;
	esac
	shift
done

function awsSignal {
	rc=$?
	if [[ "$WAIT_HANDLE_URL" ]]; then
		/opt/aws/bin/cfn-signal -e $rc "$WAIT_HANDLE_URL"
	fi
}
trap awsSignal EXIT

function printUsage {
	echo "Usage: $0 <gafferVersion> -i <accumuloInstance> -k <kmsID> -p <ssmParameterName> -u <user> -z <zookeepers> [-s <snsTopicArn> --stack-id <stackId>] [-w <awsWaitHandleUrl>]"
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

source /etc/profile.d/maven.sh

if curl -fLO https://github.com/gchq/Gaffer/archive/gaffer2-$GAFFER_VERSION.zip; then
	unzip gaffer2-$GAFFER_VERSION.zip
	rm gaffer2-$GAFFER_VERSION.zip
	cd Gaffer-gaffer2-$GAFFER_VERSION
else
	curl -fLO https://github.com/gchq/Gaffer/archive/$GAFFER_VERSION.zip
	unzip $GAFFER_VERSION.zip
	rm $GAFFER_VERSION.zip
	cd Gaffer-$GAFFER_VERSION
fi

# Configure Gaffer to test against the Gaffer instance deployed on the EMR cluster
for file in ./store-implementation/accumulo-store/src/test/resources/*.properties; do
	sed -i "s|^gaffer.store.class=.*SingleUseMockAccumuloStore.*$|gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.SingleUseAccumuloStore|" $file
	sed -i "s|^gaffer.store.class=.*MockAccumuloStore.*$|gaffer.store.class=uk.gov.gchq.gaffer.accumulostore.AccumuloStore|" $file
	sed -i "s|^accumulo.instance=.*$|accumulo.instance=$ACCUMULO_INSTANCE|" $file
	sed -i "s|^accumulo.zookeepers=.*$|accumulo.zookeepers=$ZOOKEEPERS|" $file
	sed -i "s|^accumulo.user=.*$|accumulo.user=$ACCUMULO_USER|" $file
	sed -i "s|^accumulo.password=.*$|accumulo.password=$PASSWORD|" $file
	sed -i "s|^accumulo.file.replication=.*$|accumulo.file.replication=3|" $file
done

# Add the core-site.xml to make Gaffer use hdfs
cp /etc/hadoop/conf/core-site.xml ./store-implementation/accumulo-store/src/test/resources
# Remove LZO codec to avoid class not found exceptions
sed -i 's|<value>.*com\.hadoop\.compression\.lzo\.LzoCodec,com\.hadoop\.compression\.lzo\.LzopCodec.*</value>$|<value>org.apache.hadoop.io.compress.GzipCodec,org.apache.hadoop.io.compress.DefaultCodec,org.apache.hadoop.io.compress.BZip2Codec,org.apache.hadoop.io.compress.SnappyCodec</value>|' ./store-implementation/accumulo-store/src/test/resources/core-site.xml

# Report test results script
tee -a failsafe-report.py <<EOF
#!/usr/bin/python

import boto3
import datetime
import glob
import json
import sys
import xml.etree.ElementTree as ET

PROJECT_ROOT = None
STACK_ID = None
SNS_ARN = None
REPORT_NAME = 'accumulo-store-integration-tests'

if len(sys.argv) < 3:
	print('Usage: ' + __file__ + ' <project> <stackId> [<snsARN> [<snsReportName>]]')
	sys.exit(1)

PROJECT_ROOT = sys.argv[1]
STACK_ID = sys.argv[2]

if len(sys.argv) > 3:
	SNS_ARN = sys.argv[3]

if len(sys.argv) > 4:
	REPORT_NAME = sys.argv[4]

tree = ET.parse(PROJECT_ROOT + '/target/failsafe-reports/failsafe-summary.xml')
root = tree.getroot()

completedCount = int(root.findtext('completed'))
failureCount = int(root.findtext('failures'))
errorCount = int(root.findtext('errors'))
skippedCount = int(root.findtext('skipped'))

failures = []
errors = []

if failureCount is not None and errorCount is not None and (failureCount > 0 or errorCount > 0):
	for f in glob.glob(PROJECT_ROOT + '/target/failsafe-reports/TEST-*.xml'):
		report = ET.parse(f)
		if int(report.getroot().get('failures', 0)) > 0 or int(report.getroot().get('errors', 0)) > 0:
			for test in report.getroot().findall('testcase'):
				classname = test.get('classname')
				testname = test.get('name')

				error = test.find('error')
				fail = test.find('failure')

				if error is not None:
					errors.append({
						'ClassName': classname,
						'TestName': testname,
						'Type': error.get('type', ''),
						'Message': error.get('message', ' ')
					})

				if fail is not None:
					failures.append({
						'ClassName': classname,
						'TestName': testname,
						'Type': fail.get('type', ''),
						'Message': fail.get('message', '')
					})

report = {
	'StackId': STACK_ID,
	'ReportName': REPORT_NAME,
	'Summary': {
		'Completed': completedCount,
		'Failures': failureCount,
		'Errors': errorCount,
		'Skipped': skippedCount
	},
	'Failures': failures,
	'Errors': errors,
	'Timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
}

print(json.dumps(report, indent=2))

if SNS_ARN is not None:
	sns = boto3.client('sns')
	response = sns.publish(
		TopicArn=SNS_ARN,
		Subject='mvn-failsafe-report',
		Message=json.dumps(report)
	)
	print(json.dumps(response))

EOF

function reportTestResults {
	if [[ "$SNS_ARN" ]]; then
		sudo pip install boto3
		python failsafe-report.py store-implementation/accumulo-store $STACK_ID $SNS_ARN
	fi
}

function reportTestResultsAndSignal {
	rc=$?

	reportTestResults

	if [[ "$WAIT_HANDLE_URL" ]]; then
		/opt/aws/bin/cfn-signal -e $rc "$WAIT_HANDLE_URL"
	fi
}

trap reportTestResultsAndSignal EXIT

# Run integration tests for Accumulo store
mvn verify -Pintegration-test -pl store-implementation/accumulo-store --also-make

trap awsSignal EXIT
reportTestResults

# Clean up
cd ..
rm -rf Gaffer-*
