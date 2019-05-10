# README

Copyright 2017 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Jar Shader

If deploying jars to a CDH cluster then the classpath will contain an old version of Jackson, that is not compatible with Gaffer. To avoid using this incorrect version of Jackson this utility will shade your jars relocating com.fasterxml.jackson to uk.gov.gchq.gaffer.shaded.com.fasterxml.jackson.

Usage:

```bash
 shade.sh <path to jar file> [<path to output jar>]
```

If an output path is not provided then the input jar will be overwritten with the shaded jar.

The script uses [jarjar](https://github.com/mike-hogan/jarjar-forkfork/tree/master/jarjar) to shade the jar so you must have java 8 installed.

