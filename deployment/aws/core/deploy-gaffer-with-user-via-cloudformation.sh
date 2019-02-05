#!/bin/bash

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
ACCUMULO_VISIBILITIES="none"

# The version of Gaffer to deploy. Can be a branch name or version number.
GAFFER_VERSION="0.7.8"

# The version of gaffer-tools to use to deploy Gaffer. Can be a branch name or version number.
GAFFER_TOOLS_VERSION="0.7.8"

# The ID of the VPC that the EMR cluster should be deployed into
VPC_ID=""

# The ID of the subnet that the EMR cluster should be deployed into
SUBNET_ID=""

# The name of an existing KeyPair that can be used to SSH into the provisioned cluster
KEYNAME=""

# The id of any security groups to add to all EMR instances
# Usually used to allow SSH access to the cluster from your IP address
EXTRA_SECURITY_GROUPS=""

INSTANCE_TYPE="m3.xlarge"
INSTANCE_COUNT=3
GAFFER_GRAPH_ID="gaffer"

# ----- CONFIG END ----- #

# Quick check to make sure the config is complete
if [[ -z "$VPC_ID" || -z "$SUBNET_ID" || -z "$KEYNAME" ]]; then
	echo "Please set \$VPC_ID, \$SUBNET_ID and \$KEYNAME" >&2
	exit 1
fi

# Switch to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Deploy cluster via CloudFormation
aws cloudformation create-stack \
	--stack-name $KEYNAME-gaffer \
	--template-body file://cloudformation/gaffer-with-user.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--tags \
		Key=gaffer-version,Value=$GAFFER_VERSION \
		Key=gaffer-tools-version,Value=$GAFFER_TOOLS_VERSION \
	--parameters \
		ParameterKey=GafferVersion,ParameterValue=$GAFFER_VERSION \
		ParameterKey=GafferToolsVersion,ParameterValue=$GAFFER_TOOLS_VERSION \
		ParameterKey=EmrInstanceType,ParameterValue=$INSTANCE_TYPE \
		ParameterKey=EmrCoreInstanceCount,ParameterValue=$INSTANCE_COUNT \
		ParameterKey=VpcId,ParameterValue=$VPC_ID \
		ParameterKey=SubnetId,ParameterValue=$SUBNET_ID \
		ParameterKey=ExtraEmrSecurityGroups,ParameterValue=\"$EXTRA_SECURITY_GROUPS\" \
		ParameterKey=KeyName,ParameterValue=$KEYNAME \
		ParameterKey=GafferInstanceName,ParameterValue=$GAFFER_GRAPH_ID \
		ParameterKey=UserName,ParameterValue=$GAFFER_USERNAME \
		ParameterKey=AccumuloVisibilities,ParameterValue=\"$ACCUMULO_VISIBILITIES\"
