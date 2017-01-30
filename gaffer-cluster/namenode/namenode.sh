#!/bin/bash

#
# NameNode setup script
#

while [[ $# -gt 1 ]]
do
    key="$1"

    case $key in
        -h|--hadoop-version)
            HADOOP_VERSION="$2"
            shift
            ;;
        -z|--zookeeper-version)
            ZOOKEEPER_VERSION="$2"
            shift
            ;;
        -ip|-ip-address)
            NAMENODE_IP="$2"
            shift
            ;;
        *)
            # unknown option
        ;;
esac
shift
done

if [[ "$HADOOP_VERSION" = ""  ]]; then
    echo "Hadoop version not set - exiting."
    exit
fi

if [[ "$ZOOKEEPER_VERSION" = ""  ]]; then
    echo "Zookeeper version not set - exiting."
    exit
fi

if [[ "$NAMENODE_IP" = ""  ]]; then
    echo "NameNode IP address not set - exiting."
    exit
fi

echo "Creating NameNode at $NAMENODE_IP"
echo "Hadoop v$HADOOP_VERSION"
echo "Zookeeper v$ZOOKEEPER_VERSION"

echo "Applying cluster properties..."
sudo mv /tmp/cluster.sh /etc/profile.d/cluster.sh
source /etc/profile.d/cluster.sh

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

echo "Downloading and installing Hadoop v$HADOOP_VERSION"
sudo rm -rf /usr/local/hadoop /usr/local/hadoop_work

wget http://www.us.apache.org/dist/hadoop/common/hadoop-$HADOOP_VERSION/hadoop-$HADOOP_VERSION.tar.gz
sudo tar xzvf hadoop-$HADOOP_VERSION.tar.gz -C /usr/local
sudo mv /usr/local/hadoop-$HADOOP_VERSION /usr/local/hadoop

rm -f hadoop-*.tar.gz

sudo mkdir -p /usr/local/hadoop/tmp
sudo mkdir -p /usr/local/hadoop_work/hdfs/namenode

echo "Downloading and installing Zookeeper v$ZOOKEEPER_VERSION"
sudo rm -rf /usr/local/zookeeper

wget http://www.us.apache.org/dist/zookeeper/zookeeper-$ZOOKEEPER_VERSION/zookeeper-$ZOOKEEPER_VERSION.tar.gz
sudo tar xzvf zookeeper-$ZOOKEEPER_VERSION.tar.gz -C /usr/local
sudo mv /usr/local/zookeeper-$ZOOKEEPER_VERSION /usr/local/zookeeper

rm -rf zookeeper-*.tar.gz

sudo mv /tmp/zoo.cfg $ZOOKEEPER_HOME/conf/

# set permissions for hadoop directories to match current user
sudo chown -R $USER /usr/local/hadoop
sudo chown -R $USER /usr/local/zookeeper
sudo chown -R $USER /usr/local/hadoop_work

# setup core-site.xml
sudo mv /tmp/core-site.xml $HADOOP_HOME/etc/hadoop/core-site.xml

# setup hdfs-site.xml
sudo mv /tmp/hdfs-site.xml $HADOOP_HOME/etc/hadoop/hdfs-site.xml

# setup mapred-site.xml
sudo mv /tmp/mapred-site.xml $HADOOP_HOME/etc/hadoop/mapred-site.xml

# setup yarn-site.xml
sudo mv /tmp/yarn-site.xml $HADOOP_HOME/etc/hadoop/yarn-site.xml

# setup hadoop-env.sh
sudo mv /tmp/hadoop-env.sh $HADOOP_HOME/etc/hadoop/hadoop-env.sh

# setup masters
echo "Setting Hadoop master configuration"
echo "NameNode" > $HADOOP_HOME/etc/hadoop/masters
echo "SecondaryNameNode" > $HADOOP_HOME/etc/hadoop/masters

# setup slaves
echo "Setting Hadoop slave configuration"

COUNTER=1
while IFS='=' read -r name value ; do
  if [[ $name == DATANODE*IP ]]; then
    echo "DataNode"$COUNTER >> $HADOOP_HOME/etc/hadoop/slaves
    COUNTER=$((COUNTER+1))
  fi
done < <(env | sort)

# Format namenode
hdfs namenode -format

exit
