#!/usr/bin/env bash
# Simply utility for building jars with shaded jackson version

if [[ -z $1 ]]; then
  echo "Usage: build.sh <path to jar file>"
  exit 1
fi

jarShaderDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
jarPath=$1
filename="${jarPath##*/}"
java -jar $jarShaderDir/lib/jarjar-1.4.1.jar process $jarShaderDir/relocateJacksonRule.txt $jarPath $filename

