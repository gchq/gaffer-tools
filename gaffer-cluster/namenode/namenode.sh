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

if [[ "$NAMENODE_IP" = ""  ]]; then
    echo "NameNode IP address not set - exiting."
    exit
fi

echo "Creating NameNode at $NAMENODE_IP"
echo "Hadoop v$HADOOP_VERSION"

# Copy across required files
scp hadoop.sh $NAMENODE_IP:/tmp
scp core-site.xml $NAMENODE_IP:/tmp
scp hdfs-site.xml $NAMENODE_IP:/tmp
scp mapred-site.xml $NAMENODE_IP:/tmp
scp yarn-site.xml $NAMENODE_IP:/tmp

ssh $NAMENODE_IP

echo "Applying YUM updates..."
yum update -y > /dev/null
yum install -y java-1.8.0-openjdk-devel wget > /dev/null
echo "Done"

echo "$NAMENODE_IP NameNode" > /etc/hosts

cd /usr/local

wget http://www.us.apache.org/dist/hadoop/common/hadoop-$HADOOP_VERSION/hadoop-$HADOOP_VERSION.tar.gz

tar xzvf hadoop-$HADOOP_VERSION.tar.gz

mv hadoop-$HADOOP_VERSION hadoop

mkdir -p /usr/local/hadoop_work/hdfs/namenode

# setup /etc/profile/hadoop.sh
mv /tmp/hadoop.sh /etc/profile.d/
source /etc/profile.d/hadoop.sh

# setup core-site.xml
mv /tmp/core-site.xml $HADOOP_HOME/etc/hadoop/core-site.xml
#sed -i.bak s///g $HADOOP_HOME/etc/hadoop/core-site.xml

# setup hdfs-site.xml
mv /tmp/hdfs-site.xml $HADOOP_HOME/etc/hadoop/hdfs-site.xml
#sed -i.bak s///g $HADOOP_HOME/etc/hadoop/hdfs-site.xml

# setup mapred-site.xml
mv /tmp/mapred-site.xml $HADOOP_HOME/etc/hadoop/mapred-site.xml
#sed -i.bak s///g $HADOOP_HOME/etc/hadoop/ampred-site.xml

# setup yarn-site.xml
mv /tmp/yarn-site.xml $HADOOP_HOME/etc/hadoop/yarn-site.xml
#sed -i.bak s///g $HADOOP_HOME/etc/hadoop/yarn-site.xml

#hadoop namenode -format

