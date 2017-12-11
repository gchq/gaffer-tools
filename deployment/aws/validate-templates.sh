#!/bin/bash -e

# Change to the script dir
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# Find all CloudFormation templates
TPLS=$(find . -name "*.yaml")

# Validate each in turn
for tpl in $TPLS; do
	echo "Validating $tpl"
	aws cloudformation validate-template --template-body file://$tpl
done

