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

GAFFER_VERSION_A="1.0.0"
GAFFER_TOOLS_VERSION_A="develop"

GAFFER_VERSION_B="develop"
GAFFER_TOOLS_VERSION_B="develop"

# The IDs of the VPC and subnet that the EMR cluster should be deployed into
VPC_ID=""
SUBNET_ID=""

# The name of an existing KeyPair that can be used to SSH into the provisioned cluster
KEYNAME=""

# The id of any security groups to add to all EMR instances
# Usually used to allow SSH access to the cluster from your IP address
EXTRA_SECURITY_GROUPS=""

CLUSTER_NAME="$KEYNAME-gaffer-migration-${GAFFER_VERSION_A//./}-${GAFFER_VERSION_B//./}"

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
	--template-body file://cloudformation/gaffer-migration-tests.yaml \
	--capabilities CAPABILITY_NAMED_IAM \
	--on-failure DO_NOTHING \
	--tags \
		Key=gaffer-version-a,Value=$GAFFER_VERSION_A \
		Key=gaffer-tools-version-a,Value=$GAFFER_TOOLS_VERSION_A \
		Key=gaffer-version-b,Value=$GAFFER_VERSION_B \
		Key=gaffer-tools-version-b,Value=$GAFFER_TOOLS_VERSION_B \
	--parameters \
		ParameterKey=GafferVersionA,ParameterValue=$GAFFER_VERSION_A \
		ParameterKey=GafferToolsVersionA,ParameterValue=$GAFFER_TOOLS_VERSION_A \
		ParameterKey=GafferVersionB,ParameterValue=$GAFFER_VERSION_B \
		ParameterKey=GafferToolsVersionB,ParameterValue=$GAFFER_TOOLS_VERSION_B \
		ParameterKey=AccumuloVersion,ParameterValue=1.8.1 \
		ParameterKey=VpcId,ParameterValue=$VPC_ID \
		ParameterKey=SubnetId,ParameterValue=$SUBNET_ID \
		ParameterKey=ExtraSecurityGroups,ParameterValue=\"$EXTRA_SECURITY_GROUPS\" \
		ParameterKey=KeyName,ParameterValue=$KEYNAME
