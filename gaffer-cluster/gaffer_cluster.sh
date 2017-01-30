#!/bin/bash

#
# Gaffer cluster setup script
#

source common/cluster.sh

# Shutdown any currently running nodes

echo ""
echo "Searching for previous cluster instances"
echo ""
ssh -tt $NAMENODE_IP 'bash -s' < ./shutdown.sh

# Setup NameNode

echo ""
echo "Setting up NameNode with Hadoop $HADOOP_VERSION at $NAMENODE_IP"
echo ""

scp namenode/namenode.tar.gz $NAMENODE_IP:/tmp
scp common/cluster.sh $NAMENODE_IP:/tmp
scp common/hadoop.sh $NAMENODE_IP:/tmp
ssh -tt $NAMENODE_IP 'tar xzvf /tmp/namenode.tar.gz -C /tmp'

ssh -tt $NAMENODE_IP 'bash -s' < ./namenode/namenode.sh - -h $HADOOP_VERSION -ip $NAMENODE_IP -z $ZOOKEEPER_VERSION

echo ""
echo "Setting up SecondaryNameNode with Hadoop $HADOOP_VERSION at $SECONDARY_NAMENODE_IP"
echo ""

ssh-copy-id $SECONDARY_NAMENODE_IP
scp common/cluster.sh $SECONDARY_NAMENODE_IP:/tmp

ssh -tt $SECONDARY_NAMENODE_IP 'bash -s' < ./secondary_namenode/secondary_namenode.sh

echo ""
echo "Setting up DataNodes with Hadoop $HADOOP_VERSION"
echo ""

# parallelise?
while IFS='=' read -r name value ; do
  if [[ $name == DATANODE*IP ]]; then

    echo "Setting up data node at " $value

    ssh-copy-id $value

    scp common/cluster.sh $value:/tmp
    scp common/hadoop.sh $value:/tmp

    ssh -tt $value 'bash -s' < ./datanode/datanode.sh - -ip $value
  fi
done < <(env | sort)

# Start the cluster

echo ""
echo "Starting the Hadoop cluster"
echo ""

ssh -tt $NAMENODE_IP 'bash -s' < startup.sh
ssh -tt $NAMENODE_IP 'bash -s' < initialise.sh
