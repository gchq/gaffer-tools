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

# The version of Gaffer to deploy and test. Can be a branch name or version number.
GAFFER_VERSION="develop"

# The version of gaffer-tools to use to deploy Gaffer. Can be a branch name or version number.
GAFFER_TOOLS_VERSION="develop"

# The ID of the VPC that the EMR cluster should be deployed into
VPC_ID=""

# The ID of the subnet that the EMR cluster should be deployed into
SUBNET_ID=""

# The name of an existing KeyPair that can be used to SSH into the provisioned cluster
KEYNAME=""

# The id of any security groups to add to all EMR instances
# Usually used to allow SSH access to the cluster from your IP address
EXTRA_SECURITY_GROUPS=""

# EMR Cluster Config
CLUSTER_NAME="$KEYNAME-gaffer-tests-${GAFFER_VERSION//./-}"

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
	--stack-name $CLUSTER_NAME \
	--template-body file://cloudformation/gaffer-integration-tests.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--tags \
		Key=gaffer-version,Value=$GAFFER_VERSION \
		Key=gaffer-tools-version,Value=$GAFFER_TOOLS_VERSION \
	--parameters \
		ParameterKey=GafferVersion,ParameterValue=$GAFFER_VERSION \
		ParameterKey=GafferToolsVersion,ParameterValue=$GAFFER_TOOLS_VERSION \
		ParameterKey=VpcId,ParameterValue=$VPC_ID \
		ParameterKey=SubnetId,ParameterValue=$SUBNET_ID \
		ParameterKey=ExtraSecurityGroups,ParameterValue=\"$EXTRA_SECURITY_GROUPS\" \
		ParameterKey=KeyName,ParameterValue=$KEYNAME
