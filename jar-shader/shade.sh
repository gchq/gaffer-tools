#!/usr/bin/env bash
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

# Simply utility for building jars with shaded jackson version

if [[ -z $1 ]]; then
  echo "Usage: shade.sh <path to jar file> [<path to output jar>]"
  exit 1
fi

jarShaderDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
jarPath=$1
filename=$jarPath

if [[ ! -z "$2" ]]; then
	filename="$2"
fi

java -jar $jarShaderDir/lib/jarjar-1.4.1.jar process $jarShaderDir/shadeRules.txt $jarPath $filename

