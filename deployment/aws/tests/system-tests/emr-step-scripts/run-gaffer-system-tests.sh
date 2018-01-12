#!/bin/bash -xe

GAFFER_VERSION=""
HOST=""
PORT=80
WAIT_HANDLE_URL=""
SNS_ARN=""
SNS_REPORT_NAME="system-tests"
STACK_ID=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-h|--host)
			HOST=$2
			shift
			;;
		-p|--port)
			PORT=$2
			shift
			;;
		-s|--sns)
			if [ "$2" != "none" ]; then
				SNS_ARN=$2
			fi
			shift
			;;
		-r|--sns-report-name)
			SNS_REPORT_NAME=$2
			shift
			;;
		--stack-id)
			STACK_ID=$2
			shift
			;;
		-w|--wait-handle-url)
			WAIT_HANDLE_URL=$2
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
	echo "Usage: $0 <gafferVersion> -h <restApiHost> [-p <restApiPort>] [-s <snsTopicArn> --stack-id <stackId> [-r <snsReportName>] ] [-w <awsWaitHandleUrl>]"
	exit 1
}

if [[ "$GAFFER_VERSION" == "" || "$HOST" == "" ]]; then
	printUsage
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

GAFFER_POM_VERSION=$(xmllint --xpath '/*[local-name()="project"]/*[local-name()="version"]/text()' pom.xml)
echo "Detected Gaffer version as $GAFFER_POM_VERSION"

# Detect if we can download Gaffer dependencies from Maven Central, or if we will need to build them
if ! curl -fL -o /dev/null https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/gaffer2/$GAFFER_POM_VERSION/gaffer2-$GAFFER_POM_VERSION.pom; then
	echo "Building Gaffer from branch $GAFFER_VERSION..."
	mvn clean install -Pquick -pl example/road-traffic/road-traffic-rest/ --also-make
fi

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
REPORT_NAME = 'system-tests'

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
		python failsafe-report.py example/road-traffic/road-traffic-rest $STACK_ID $SNS_ARN $SNS_REPORT_NAME
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

# Run the Road Traffic REST API System Tests
mvn verify -Psystem-test -pl example/road-traffic/road-traffic-rest -Dgaffer.rest.host=$HOST -Dgaffer.rest.port=$PORT

trap awsSignal EXIT
reportTestResults

# Tidy up
cd ..
rm -rf Gaffer-*
