#!/bin/bash -e

#
# Copyright 2017-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# ----- CONFIG ----- #

GAFFER_USERNAME="gaffer_user"
GAFFER_PASSWORD="gaffer_passwd"
ACCUMULO_VISIBILITIES="none"

# The version of Gaffer to deploy. Can be a branch name or version number.
GAFFER_VERSION="0.7.8"

# The version of gaffer-tools to use to deploy Gaffer. Can be a branch name or version number.
GAFFER_TOOLS_VERSION="0.7.8"

# A location in S3 to store scripts and logs
S3_BUCKET=""

# The ID of the subnet that the EMR cluster should be deployed into
SUBNET_ID=""

# The name of an existing KeyPair that can be used to SSH into the provisioned cluster
KEYNAME=""

# The id of a security group to add to all EMR instances
# Usually used to allow SSH access to the cluster from your IP address
EXTRA_SECURITY_GROUP=""

EMR_VERSION="emr-5.11.0"
INSTANCE_TYPE="m3.xlarge"
INSTANCE_COUNT=3
CLUSTER_NAME="$KEYNAME-gaffer-$GAFFER_VERSION"
GAFFER_GRAPH_ID="gaffer"

# ----- CONFIG END ----- #


# Quick check to make sure the config is complete
if [[ -z "$S3_BUCKET" || -z "$SUBNET_ID" || -z "$KEYNAME" ]]; then
	echo "Please set \$S3_BUCKET, \$SUBNET_ID and \$KEYNAME" >&2
	exit 1
fi

# Switch to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Generate unique path in S3 to store scripts and logs
TSTAMP=$(date +"%s")
S3_PATH="$S3_BUCKET/$CLUSTER_NAME/$TSTAMP"

# Upload EMR step scripts into S3
aws s3 cp ./emr-step-scripts/deploy-gaffer-instance.sh s3://$S3_PATH/

# Deploy Cluster
aws emr create-cluster \
	--name $CLUSTER_NAME \
	--release-label $EMR_VERSION \
	--applications Name=Hadoop Name=ZooKeeper Name=Ganglia \
	--instance-type $INSTANCE_TYPE \
	--instance-count $INSTANCE_COUNT \
	--ec2-attributes SubnetId=$SUBNET_ID,KeyName=$KEYNAME,AdditionalMasterSecurityGroups=$EXTRA_SECURITY_GROUP,AdditionalSlaveSecurityGroups=$EXTRA_SECURITY_GROUP \
	--use-default-roles \
	--enable-debugging \
	--log-uri "s3n://$S3_PATH/emr-logs/" \
	--steps \
		Name=DeployGaffer,Type=CUSTOM_JAR,ActionOnFailure=TERMINATE_CLUSTER,Jar=s3://elasticmapreduce/libs/script-runner/script-runner.jar,Args=s3://$S3_PATH/deploy-gaffer-instance.sh,-g,$GAFFER_VERSION,-t,$GAFFER_TOOLS_VERSION,$GAFFER_GRAPH_ID \
		Name=CreateGafferUser,Type=CUSTOM_JAR,ActionOnFailure=TERMINATE_CLUSTER,Jar=s3://elasticmapreduce/libs/script-runner/script-runner.jar,Args=/home/hadoop/slider-$GAFFER_GRAPH_ID/create-accumulo-user.sh,$GAFFER_USERNAME,-p,$GAFFER_PASSWORD,-v,\"$ACCUMULO_VISIBILITIES\" \
	--tags "gaffer-cluster-id=$TSTAMP" "gaffer-version=$GAFFER_VERSION" "gaffer-tools-version=$GAFFER_TOOLS_VERSION"

echo "View Cluster Logs @ https://console.aws.amazon.com/s3/buckets/$S3_PATH/emr-logs/"
