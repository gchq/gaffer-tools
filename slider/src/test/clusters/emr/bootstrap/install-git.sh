#!/bin/bash

set -e

# Only install on the master
if grep isMaster /mnt/var/lib/info/instance.json | grep false; then
	echo "isMaster = false, so skipping"
	exit
fi

sudo yum install -y git

