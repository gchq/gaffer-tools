#!/usr/bin/env python

#
# Copyright 2017 Crown Copyright
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
		configs = config['configurations']
		component = config['componentName']
		componentConfig = config['componentConfig'][component]

		dst = os.path.join(configs['global']['app_root'], 'lib')
		hadoopConfDir = os.path.join('etc', 'hadoop', 'conf')

		# Detect base application that Gaffer is being deployed onto
		appType = 'unknown'

		if 'accumulo-site' in configs or 'accumulo-env' in configs:
			appType = 'accumulo'
			dst = os.path.join(dst, 'ext')
			hadoopConfDir = configs['accumulo-env']['hadoop_conf_dir']
		elif 'hbase-site' in configs or 'hbase-env' in configs:
			appType = 'hbase'

		Logger.info("Detected AppType: %s" % appType)
		Logger.info("Destination Directory: %s" % dst)
		Logger.info("Hadoop Config Directory: %s" % hadoopConfDir)

		# Parse and set config
		copyPackageJars = True
		copyHdfsJars = False

		if Gaffer.PKG_JARS_PROPERTY in componentConfig:
			copyPackageJars = bool(componentConfig[Gaffer.PKG_JARS_PROPERTY])

		if Gaffer.HDFS_JARS_PROPERTY in componentConfig:
			copyHdfsJars = True

		Logger.info("Copy JARs from inside add-on package: %s" % copyPackageJars)
		Logger.info("Copy JARs from a location in HDFS: %s" % copyHdfsJars)

		originalFiles = os.listdir(dst)

		# Copy additional JARs that have been bundled inside this add-on package
		if copyPackageJars:
			src = os.path.join(config['commandParams']['addonPackageRoot'], 'package', 'files')
			Logger.info("Copying additional JARs from add-on package: %s" % src)

			if appType == 'accumulo' or appType == 'unknown':
				accumuloSrc = os.path.join(src, 'accumulo')
				for f in os.listdir(accumuloSrc):
					shutil.copy2(os.path.join(accumuloSrc, f), dst)
			if appType == 'hbase' or appType == 'unknown':
				hbaseSrc = os.path.join(src, 'hbase')
				for f in os.listdir(hbaseSrc):
					shutil.copy2(os.path.join(hbaseSrc, f), dst)

			newFiles = os.listdir(dst)
			for f in newFiles:
				if f not in originalFiles:
					Logger.info("\tCopied %s" % f)
			originalFiles = newFiles

		# Copy additional JARs from a location in HDFS
		if copyHdfsJars:
			hdfsSrc = format(componentConfig[Gaffer.HDFS_JARS_PROPERTY])
			Logger.info("Copying additional JARs from HDFS: %s" % hdfsSrc)

			ExecuteHadoop(
				('fs', '-get', hdfsSrc + '/*', dst),
				logoutput = True,
				conf_dir = hadoopConfDir
			)

			newFiles = os.listdir(dst)
			for f in newFiles:
				if f not in originalFiles:
					Logger.info("\tCopied %s" % f)

if __name__ == "__main__":
	Gaffer().execute()
