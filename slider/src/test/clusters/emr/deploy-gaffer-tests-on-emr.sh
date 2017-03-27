#!/bin/bash

set -e

# CONFIG STARTS

# The version of Gaffer to test. Can be a branch name or version number.
GAFFER_BRANCH=develop

# Which version of the gaffer-tools repo to use to deploy and test Gaffer
GAFFER_TOOLS_BRANCH=develop

# Location in S3 to store scripts and logs
S3_BUCKET=

# The ID of the subnet that the EMR cluster should be deployed into
SUBNET_ID=

EMR_VERSION=emr-5.4.0
INSTANCE_TYPE=m3.xlarge
INSTANCE_COUNT=3
CLUSTER_NAME="gaffer-test-$GAFFER_BRANCH"

# CONFIG ENDS

# Quick checks to make sure the config section above has been reviewed and completed
if [[ -z "$S3_BUCKET" || -z "$SUBNET_ID" ]]; then
	echo "Please set \$S3_BUCKET and \$SUBNET_ID" >&2
	exit 1
fi

# Change cwd to directory of script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Generate unique path in S3 to store scripts and logs
TSTAMP=$(date +"%s")
S3_PATH="$S3_BUCKET/$CLUSTER_NAME/$TSTAMP"

# Upload Bootstrap Actions to S3
aws s3 cp bootstrap/install-maven-3.3.9.sh "s3://$S3_PATH/bootstrap/"
aws s3 cp bootstrap/install-git.sh "s3://$S3_PATH/bootstrap/"

# Upload Step script to S3
aws s3 cp step/run-gaffer-slider-funtests.sh "s3://$S3_PATH/step/"

# Deploy Cluster
aws emr create-cluster \
	--name $CLUSTER_NAME \
	--release-label $EMR_VERSION \
	--applications Name=Hadoop Name=ZooKeeper \
	--instance-type $INSTANCE_TYPE \
	--instance-count $INSTANCE_COUNT \
	--ec2-attributes SubnetId=$SUBNET_ID \
	--use-default-roles \
	--auto-terminate \
	--enable-debugging \
	--log-uri "s3n://$S3_PATH/logs/" \
	--bootstrap-actions \
		Name=InstallMaven,Path=s3://$S3_PATH/bootstrap/install-maven-3.3.9.sh \
		Name=InstallGit,Path=s3://$S3_PATH/bootstrap/install-git.sh \
	--steps \
		Name=RunGafferTests,Type=CUSTOM_JAR,ActionOnFailure=TERMINATE_CLUSTER,Jar=s3://elasticmapreduce/libs/script-runner/script-runner.jar,Args=s3://$S3_PATH/step/run-gaffer-slider-funtests.sh,$GAFFER_BRANCH,$GAFFER_TOOLS_BRANCH \
	--tags "gaffer-cluster-id=$TSTAMP" "gaffer-branch=$GAFFER_BRANCH" "gaffer-tools-branch=$GAFFER_TOOLS_BRANCH"

echo "View Cluster Logs @ https://console.aws.amazon.com/s3/buckets/$S3_PATH/logs/"

