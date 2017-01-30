#!/bin/bash

#
# SecondaryNameNode setup script
#

echo "Applying cluster properties..."
sudo mv /tmp/cluster.sh /etc/profile.d/cluster.sh
source /etc/profile.d/cluster.sh

echo "Creating SecondaryNameNode at $SECONDARY_NAMENODE_IP"
echo "Hadoop v$HADOOP_VERSION"

echo "Applying YUM updates..."
sudo yum update -y
sudo yum install -y java-1.8.0-openjdk-devel wget tomcat

echo "Updating hosts file..."
echo "$NAMENODE_IP NameNode" | sudo tee /etc/hosts

COUNTER=1

# Add SecondaryNameNode and DataNodes to hosts file
while IFS='=' read -r name value ; do
  if [[ $name == DATANODE*IP ]]; then
    echo "$value DataNode$COUNTER" | sudo tee --append /etc/hosts
    COUNTER=$((COUNTER+1))
  fi
  if [[ $name == SECONDARY* ]]; then
    echo "$value SecondaryNameNode" | sudo tee --append /etc/hosts
  fi
done < <(env | sort)

# setup /etc/profile/hadoop.sh
sudo mv /tmp/hadoop.sh /etc/profile.d/hadoop.sh
source /etc/profile.d/hadoop.sh

echo "Installing Hadoop v$HADOOP_VERSION"
sudo mkdir -p /usr/local/hadoop_work/hdfs

scp -r $NAMENODE_IP:/usr/local/hadoop /tmp
sudo rm -rf /usr/local/hadoop
sudo mv /tmp/hadoop /usr/local/

# Clean hadoop_work directory
sudo rm -rf /usr/local/hadoop_work/*

sudo chown -R $USER /usr/local/hadoop
sudo chown -R $USER /usr/local/hadoop_work

exit
