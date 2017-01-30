#!/bin/bash

#
# Initialise the Hadoop cluster
#

# Create directories
hadoop fs -mkdir -p /tmp
hadoop fs -mkdir -p /user
hadoop fs -mkdir -p /user/app
hadoop fs -mkdir -p /var/log/hadoop-yarn
hadoop fs -mkdir -p /var/log/hadoop-yarn/apps

# Set permissions
hadoop fs -chmod -R 1777 /tmp
hadoop fs -chmod -R 1777 /user
hadoop fs -chmod -R 1777 /user/app
hadoop fs -chmod -R 1777 /var/log/hadoop-yarn
hadoop fs -chmod -R 1777 /var/log/hadoop-yarn/apps

exit
