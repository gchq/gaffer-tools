# README

Copyright 2016 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Schema Builder

This module contains a simple rest api for the schema builder UI.

There are two options for building and then running it:

## Option 1 - Deployable war file

If you wish to deploy the war file to a container of your choice, then use this option.

To build the war file along with all its dependencies then run the following command from the parent directory: 'mvn clean install'

To deploy it to a server of your choice, take target/schema-builder-rest-\[version\].war and deploy as per the usual deployment process for your server.

## Option 2 - Build using the standalone-schema-builder-rest profile

The application can be built and then run as a basic executable standalone war file from Maven.

To build it and its dependencies, use the following command from the parent directory:

```bash
mvn clean install -Pstandalone-schema-builder-rest -Pquick -pl :schema-builder-rest -am
```

This uses the 'standalone-schema-builder-rest' profile to run jetty with the schema-builder-rest project after it and its dependencies have been built.

This should launch an embedded jetty container, the base for the REST API is:

[http://localhost:8080/schema-builder-rest/v1](http://localhost:8080/schema-builder-rest/v1)

Endpoints:

/schema-builder-rest/v1/commonSchema - GET the standard base schema

/schema-builder-rest/v1/validate - POST a full schema, a validation result will return

/schema-builder-rest/v1/functions - POST a typeName and a typeClass, will return a list of valid functions.

