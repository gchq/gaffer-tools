#!/bin/bash

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

CLUSTER_NAME=gaffer-test
CLUSTER_TYPE="${test.cluster.type}"

SLIDER="${slider.output.directory}/slider-*/bin/slider"
ACCUMULO_PKG="${slider.accumulo.output.directory}/slider-accumulo-app-package-*.zip"
GAFFER_PKG="${project.build.directory}/${addon.pkg.file}.zip"

export SLIDER_CONF_DIR="${cluster.config.output.directory}/$CLUSTER_TYPE/slider/"
APPCONFIG="${cluster.config.output.directory}/$CLUSTER_TYPE/accumulo/appConfig-default.json"
RESOURCES="${cluster.config.output.directory}/$CLUSTER_TYPE/accumulo/resources.json"
CLIENT_DESTINATION="${project.build.directory}/accumulo-shell"

