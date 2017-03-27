#!/usr/bin/env python

# The version of Gaffer to test. Can be a branch name or version number.
GAFFER_BRANCH="develop"

# Which version of the gaffer-tools repo to use to deploy and test Gaffer
GAFFER_TOOLS_BRANCH="develop"

# Location in S3 to store scripts and logs
S3_BUCKET=""

# The ID of the subnet that the EMR cluster should be deployed into
SUBNET_ID=""

EMR_VERSION="emr-5.4.0"
INSTANCE_TYPE="m3.xlarge"
INSTANCE_COUNT=3
CLUSTER_NAME="gaffer-test-" + GAFFER_BRANCH

import sys
import time

import boto3

emr = boto3.client('emr')
s3 = boto3.client('s3')

if S3_BUCKET == "" or SUBNET_ID == "":
	print('Please set S3_BUCKET and SUBNET_ID')
	sys.exit(1)

# Generate unique path in S3 to store scripts and logs
TSTAMP=str(int(time.time()))
S3_PATH=CLUSTER_NAME + '/' + TSTAMP

# Upload Bootstrap Actions to S3
s3.upload_file('bootstrap/install-maven-3.3.9.sh', S3_BUCKET, S3_PATH + '/bootstrap/install-maven-3.3.9.sh')
s3.upload_file('bootstrap/install-git.sh', S3_BUCKET, S3_PATH + '/bootstrap/install-git.sh')

# Upload Step script to S3
s3.upload_file('step/run-gaffer-slider-funtests.sh', S3_BUCKET, S3_PATH + '/step/run-gaffer-slider-funtests.sh')

# Deploy Cluster
print('Attempting to deploy an ' + EMR_VERSION + ' cluster comprising of ' + str(INSTANCE_COUNT) + 'x' + INSTANCE_TYPE + ' into ' + SUBNET_ID)
print('Cluster will test gaffer branch: ' + GAFFER_BRANCH + ' using gaffer-tools branch: ' + GAFFER_TOOLS_BRANCH)

cluster = emr.run_job_flow(
	Name=CLUSTER_NAME,
	ReleaseLabel=EMR_VERSION,
	Applications=[{ 'Name': 'Hadoop' }, { 'Name': 'ZooKeeper' }],
	Instances={
		'MasterInstanceType': INSTANCE_TYPE,
		'SlaveInstanceType': INSTANCE_TYPE,
		'InstanceCount': INSTANCE_COUNT,
		'KeepJobFlowAliveWhenNoSteps': False,
		'Ec2SubnetId': SUBNET_ID,
	},
	VisibleToAllUsers=True,
	JobFlowRole='EMR_EC2_DefaultRole',
	ServiceRole='EMR_DefaultRole',
	LogUri='s3n://' + S3_BUCKET + '/' + S3_PATH + '/logs',
	BootstrapActions=[
		{
			'Name': 'InstallMaven',
			'ScriptBootstrapAction': {
				'Path': 's3://' + S3_BUCKET + '/' + S3_PATH + '/bootstrap/install-maven-3.3.9.sh'
			}
		},
		{
			'Name': 'InstallGit',
			'ScriptBootstrapAction': {
				'Path': 's3://' + S3_BUCKET + '/' + S3_PATH + '/bootstrap/install-git.sh'
			}
		}
	],
	Steps=[
		{
			'Name': 'RunGafferTests',
			'ActionOnFailure': 'TERMINATE_CLUSTER',
			'HadoopJarStep': {
				'Jar': 's3://elasticmapreduce/libs/script-runner/script-runner.jar',
				'Args': [
					's3://' + S3_BUCKET + '/' + S3_PATH + '/step/run-gaffer-slider-funtests.sh',
					GAFFER_BRANCH,
					GAFFER_TOOLS_BRANCH
				]
			}
		}
	],
	Tags=[
		{ 'Key': 'gaffer-cluster-id', 'Value': TSTAMP },
		{ 'Key': 'gaffer-branch', 'Value': GAFFER_BRANCH },
		{ 'Key': 'gaffer-tools-branch', 'Value': GAFFER_TOOLS_BRANCH }
	]
)

if not 'JobFlowId' in cluster:
	print(cluster)
	sys.exit(1)

clusterId = cluster['JobFlowId']
print('Deployed Cluster: ' + clusterId)

lastStatusLine = ''
while True:

	status = emr.describe_cluster(ClusterId=clusterId)

	if 'Cluster' in status and 'Status' in status['Cluster'] and 'State' in status['Cluster']['Status']:
		state = status['Cluster']['Status']['State']
		code = ''
		msg = ''

		if 'StateChangeReason' in status['Cluster']['Status']:
			if 'Code' in status['Cluster']['Status']['StateChangeReason']:
				code = status['Cluster']['Status']['StateChangeReason']['Code']
			if 'Message' in status['Cluster']['Status']['StateChangeReason']:
				msg = status['Cluster']['Status']['StateChangeReason']['Message']

		statusLine = state + ' ' + code + ' ' + msg

		if statusLine != lastStatusLine:
			print(time.strftime("%H:%M:%S") + ' ' + statusLine)

		lastStatusLine = statusLine

		if state == 'TERMINATED' or state == 'TERMINATED_WITH_ERRORS':
			break

	else:
		print(time.strftime("%H:%M:%S"))
		print(status)

	time.sleep(1)

print('View Cluster Logs @ https://console.aws.amazon.com/s3/buckets/' + S3_BUCKET + '/' + S3_PATH + '/logs')

