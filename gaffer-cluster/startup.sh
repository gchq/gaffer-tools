#!/bin/bash

#
# Start the Hadoop cluster
#

source /etc/profile.d/hadoop.sh

start-dfs.sh

start-yarn.sh

zkServer.sh start $ZOOKEEPER_HOME/conf/zoo.cfg

mr-jobhistory-daemon.sh start historyserver

exit
