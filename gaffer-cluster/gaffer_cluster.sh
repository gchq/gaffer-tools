#!/bin/bash

#
# Gaffer cluster setup script
#




# Setup NameNode

ssh $NAMENODE_IP

yum update -y
yum install -y java-1.8.0-openjdk-devel wget

echo "$NAMENODE_IP NameNode" > /etc/hosts

cd /usr/local

wget http://www.us.apache.org/dist/hadoop/common/hadoop-$HADOOP_VERSION/hadoop-$HADOOP_VERSION.tar.gz

tar xzvf hadoop-$HADOOP_VERSION.tar.gz

mv hadoop-$HADOOP_VERSION hadoop

mkdir -p /usr/local/hadoop_work/hdfs/namenode

# setup /etc/profile/hadoop.sh

# setup core-site.xml

# setup hdfs-site.xml

# setup mapred-site.xml

# setup yarn-site.xml

# add secondary namenode information...........

hadoop namenode -format

# setup datanodes...........

