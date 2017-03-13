Copyright 2016-2017 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


Federated REST API
==================
This module federates queries over multiple different Gaffer REST APIs.

This REST API is designed to be a copy of Gaffer's REST API, however, there are some slight differences in the response types to some methods.

Delegate REST URLs can be added via this REST API with PUT method /graph/urls.
In additional they can be provided as a system property 'gaffer.federated-rest.urls'. E.g gaffer.federated-rest.urls=name,url,rest1,http://pathToRest1:8080/rest/v1,rest2,http://pathToRest2:8080/rest/v1

It is recommended that each delegate Gaffer graph has different entity and edge groups - this will prevent duplication. Results from different graphs are not aggregated/summarised or deduplicated.
Please note that when adding elements over the REST API, all elements will be sent to all URLs. Any elements that are invalid for a particular URL will be ignored and skipped. So it is possible for elements to be successfully added to none, one or many Gaffer graphs. When querying for these elements they will come back duplicated.

There are two options for building and then running it:

Option 1 - Deployable war file
==============================

If you wish to deploy the war file to a container of your choice, then use this option.

To build the war file along with all its dependencies then run the following command from the parent directory:
'mvn clean install -Pquick'

To deploy it to a server of your choice, take target/federated-rest-[version].war and deploy as per the usual deployment process for your server.


The above System Property will need to be configured on your server. An example of doing this in Tomcat would be to add the lines above to the end of ${CATALINA_HOME}/conf/catalina.properties and then to ensure that the files are resolvable via the configured paths.


Option 2 - Build using the standalone-federated profile
=============================================

The application can be built and then run as a basic executable standalone war file from Maven.

To build it and its dependencies, use the following command from the parent directory:

'mvn clean install -Pquick -Pstandalone-federated'
This uses the 'standalone-federated' profile to start the rest service in tomcat.

This should launch an embedded tomcat container, which can then be accessed via your browser pointing to the following url:
http://localhost:8081/rest/

If you need to change the port there is a 'port' property in the pom, in the standalone-federated profile section.