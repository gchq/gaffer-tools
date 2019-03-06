#!/usr/bin/env python

#
# Copyright 2017-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os
import shutil
from resource_management import *

class Gaffer (Script):

	PKG_JARS_PROPERTY = 'gaffer.deploy.package.jars'
	HDFS_JARS_PROPERTY = 'gaffer.deploy.hdfs.jars'

	def install (self, env):
		# Grab config
		config = Script.get_config()
		component = config['componentName']
		componentConfig = config['componentConfig'][component]

		# Parse and set config
		copyPackageJars = True
		copyHdfsJars = False

		if Gaffer.PKG_JARS_PROPERTY in componentConfig:
			copyPackageJars = bool(componentConfig[Gaffer.PKG_JARS_PROPERTY])

		if Gaffer.HDFS_JARS_PROPERTY in componentConfig:
			copyHdfsJars = True

		Logger.info("Copy JARs from inside add-on package: %s" % copyPackageJars)
		Logger.info("Copy JARs from a location in HDFS: %s" % copyHdfsJars)

		# Delete any existing additional JARs first
		dst = config['configurations']['global']['app_root'] + '/lib/ext/'
		Logger.info("Destination Directory: %s" % dst)
		shutil.rmtree(dst)

		# Copy additional JARs that have been bundled inside this add-on package
		if copyPackageJars:
			src = config['commandParams']['addonPackageRoot'] + '/package/files/'
			Logger.info("Copying additional JARS from add-on package: %s" % src)
			shutil.copytree(src, dst)

			files = os.listdir(dst)
			for f in files:
				Logger.info("\tCopied %s" % f)

		# Copy additional JARs from a location in HDFS
		if copyHdfsJars:
			hdfsSrc = format(componentConfig[Gaffer.HDFS_JARS_PROPERTY])
			hadoopConfDir = config['configurations']['accumulo-env']['hadoop_conf_dir']
			Logger.info("Copying additional JARs from HDFS: %s" % hdfsSrc)

			ExecuteHadoop(
				('fs', '-get', hdfsSrc + '/*', dst),
				logoutput = True,
				conf_dir = hadoopConfDir
			)

			newFiles = os.listdir(dst)
			for f in newFiles:
				if f not in files:
					Logger.info("\tCopied %s" % f)

if __name__ == "__main__":
	Gaffer().execute()
