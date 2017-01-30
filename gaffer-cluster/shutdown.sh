#!/bin/bash

#
# Shutdown a running cluster
#

if [ -d "$HADOOP_HOME" ]; then
  $HADOOP_HOME/sbin/stop-dfs.sh
  $HADOOP_HOME/sbin/stop-yarn.sh
fi

if [ -d "$ZOOKEEPER_HOME" ]; then
  $ZOOKEEPER_HOME/bin/zkServer.sh stop
fi

exit
