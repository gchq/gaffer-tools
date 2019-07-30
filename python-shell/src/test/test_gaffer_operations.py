#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import json
import unittest

from gafferpy import gaffer as g


class GafferOperationsTest(unittest.TestCase):
    examples = [
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElements",
              "validate" : true,
              "skipInvalidElements" : false,
              "input" : [ {
                "group" : "entity",
                "vertex" : 6,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Entity"
              }, {
                "group" : "edge",
                "source" : 5,
                "destination" : 6,
                "directed" : true,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Edge"
              } ]
            }
            ''',
            g.AddElements(
                skip_invalid_elements=False,
                input=[
                    g.Entity(
                        vertex=6,
                        properties={'count': 1},
                        group="entity"
                    ),
                    g.Edge(
                        destination=6,
                        source=5,
                        group="edge",
                        properties={'count': 1},
                        directed=True
                    )
                ],
                validate=True
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromFile",
              "filename" : "filename",
              "elementGenerator" : "uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
              "parallelism" : 1,
              "validate" : true,
              "skipInvalidElements" : false
            }
            ''',
            g.AddElementsFromFile(
                parallelism=1,
                validate=True,
                element_generator="uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
                filename="filename",
                skip_invalid_elements=False
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromKafka",
              "topic" : "topic1",
              "groupId" : "groupId1",
              "bootstrapServers" : [ "hostname1:8080,hostname2:8080" ],
              "elementGenerator" : "uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
              "parallelism" : 1,
              "validate" : true,
              "skipInvalidElements" : false
            }
            ''',
            g.AddElementsFromKafka(
                topic="topic1",
                parallelism=1,
                skip_invalid_elements=False,
                validate=True,
                bootstrap_servers=[
                    "hostname1:8080,hostname2:8080"
                ],
                element_generator="uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
                group_id="groupId1"
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromSocket",
              "hostname" : "localhost",
              "port" : 8080,
              "elementGenerator" : "uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
              "parallelism" : 1,
              "validate" : true,
              "skipInvalidElements" : false,
              "delimiter" : ","
            }
            ''',
            g.AddElementsFromSocket(
                validate=True,
                element_generator="uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator",
                parallelism=1,
                delimiter=",",
                hostname="localhost",
                skip_invalid_elements=False,
                port=8080
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.CountGroups"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.CountGroups()
                ]
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.CountGroups",
                "limit" : 5
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.CountGroups(
                        limit=5
                    )
                ]
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                "key" : "ALL"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(),
                    g.DiscardOutput(),
                    g.GetGafferResultCacheExport(
                        key="ALL"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(),
                    g.DiscardOutput(),
                    g.GetJobDetails()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                "jobId" : "0f47bc2a-547d-4990-9104-04a8dd64e588",
                "key" : "ALL"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetGafferResultCacheExport(
                        job_id="0f47bc2a-547d-4990-9104-04a8dd64e588",
                        key="ALL"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
                "key" : "edges"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
                "key" : "entities"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.GetExports",
                "getExports" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                  "key" : "edges"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                  "key" : "entities"
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(
                        key="edges"
                    ),
                    g.DiscardOutput(),
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(
                        key="entities"
                    ),
                    g.DiscardOutput(),
                    g.GetExports(
                        get_exports=[
                            g.GetGafferResultCacheExport(
                                key="edges"
                            ),
                            g.GetGafferResultCacheExport(
                                key="entities"
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph",
                "graphId" : "graph2"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ],
                            entities=[
                            ]
                        )
                    ),
                    g.ExportToOtherAuthorisedGraph(
                        graph_id="graph2"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph",
                "graphId" : "newGraphId",
                "parentSchemaIds" : [ "schemaId1" ],
                "parentStorePropertiesId" : "storePropsId1"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ]
                        )
                    ),
                    g.ExportToOtherAuthorisedGraph(
                        parent_schema_ids=[
                            "schemaId1"
                        ],
                        graph_id="newGraphId",
                        parent_store_properties_id="storePropsId1"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
                "graphId" : "newGraphId"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ]
                        )
                    ),
                    g.ExportToOtherGraph(
                        graph_id="newGraphId"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
                "graphId" : "newGraphId",
                "schema" : {
                  "edges" : {
                    "edge" : {
                      "properties" : {
                        "count" : "int"
                      },
                      "groupBy" : [ ],
                      "directed" : "true",
                      "source" : "int",
                      "destination" : "int"
                    }
                  },
                  "entities" : {
                    "entity" : {
                      "properties" : {
                        "count" : "int"
                      },
                      "groupBy" : [ ],
                      "vertex" : "int"
                    }
                  },
                  "types" : {
                    "int" : {
                      "aggregateFunction" : {
                        "class" : "uk.gov.gchq.koryphe.impl.binaryoperator.Sum"
                      },
                      "class" : "java.lang.Integer"
                    },
                    "true" : {
                      "validateFunctions" : [ {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsTrue"
                      } ],
                      "class" : "java.lang.Boolean"
                    }
                  }
                },
                "storeProperties" : {
                  "accumulo.instance" : "someInstanceName",
                  "gaffer.cache.service.class" : "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService",
                  "accumulo.password" : "password",
                  "accumulo.zookeepers" : "aZookeeper",
                  "gaffer.store.class" : "uk.gov.gchq.gaffer.accumulostore.MockAccumuloStore",
                  "gaffer.store.job.tracker.enabled" : "true",
                  "gaffer.store.operation.declarations" : "ExportToOtherGraphOperationDeclarations.json",
                  "gaffer.store.properties.class" : "uk.gov.gchq.gaffer.accumulostore.AccumuloProperties",
                  "accumulo.user" : "user01"
                }
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ],
                            entities=[
                            ]
                        )
                    ),
                    g.ExportToOtherGraph(
                        schema={'edges': {
                            'edge': {'groupBy': [], 'directed': 'true',
                                     'properties': {'count': 'int'},
                                     'destination': 'int', 'source': 'int'}},
                            'entities': {
                                'entity': {'groupBy': [], 'vertex': 'int',
                                           'properties': {'count': 'int'}}},
                            'types': {'true': {'validateFunctions': [{
                                'class': 'uk.gov.gchq.koryphe.impl.predicate.IsTrue'}],
                                'class': 'java.lang.Boolean'},
                                'int': {'aggregateFunction': {
                                    'class': 'uk.gov.gchq.koryphe.impl.binaryoperator.Sum'},
                                    'class': 'java.lang.Integer'}}},
                        store_properties={
                            'gaffer.store.job.tracker.enabled': 'true',
                            'gaffer.cache.service.class': 'uk.gov.gchq.gaffer.cache.impl.HashMapCacheService',
                            'gaffer.store.properties.class': 'uk.gov.gchq.gaffer.accumulostore.AccumuloProperties',
                            'accumulo.instance': 'someInstanceName',
                            'accumulo.zookeepers': 'aZookeeper',
                            'accumulo.password': 'password',
                            'gaffer.store.operation.declarations': 'ExportToOtherGraphOperationDeclarations.json',
                            'accumulo.user': 'user01',
                            'gaffer.store.class': 'uk.gov.gchq.gaffer.accumulostore.MockAccumuloStore'},
                        graph_id="newGraphId"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
                "graphId" : "otherGafferRestApiGraphId",
                "storeProperties" : {
                  "gaffer.host" : "localhost",
                  "gaffer.context-root" : "/rest/v1",
                  "gaffer.store.class" : "uk.gov.gchq.gaffer.proxystore.ProxyStore",
                  "gaffer.port" : "8081",
                  "gaffer.store.properties.class" : "uk.gov.gchq.gaffer.proxystore.ProxyProperties"
                }
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ]
                        )
                    ),
                    g.ExportToOtherGraph(
                        graph_id="otherGafferRestApiGraphId",
                        store_properties={'gaffer.context-root': '/rest/v1',
                                          'gaffer.store.class': 'uk.gov.gchq.gaffer.proxystore.ProxyStore',
                                          'gaffer.host': 'localhost',
                                          'gaffer.store.properties.class': 'uk.gov.gchq.gaffer.proxystore.ProxyProperties',
                                          'gaffer.port': '8081'}
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
                "graphId" : "exportGraphId"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ],
                            entities=[
                            ]
                        )
                    ),
                    g.ExportToOtherGraph(
                        graph_id="exportGraphId"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                }
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
                "graphId" : "newGraphId",
                "parentSchemaIds" : [ "exportSchemaId" ],
                "parentStorePropertiesId" : "exportStorePropertiesId"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ],
                            entities=[
                            ]
                        )
                    ),
                    g.ExportToOtherGraph(
                        parent_schema_ids=[
                            "exportSchemaId"
                        ],
                        graph_id="newGraphId",
                        parent_store_properties_id="exportStorePropertiesId"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                "start" : 0
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(),
                    g.DiscardOutput(),
                    g.GetSetExport(
                        start=0
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                "start" : 2,
                "end" : 4
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(),
                    g.DiscardOutput(),
                    g.GetSetExport(
                        end=4,
                        start=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
                "key" : "edges"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
                "key" : "entities"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.GetExports",
                "getExports" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                  "key" : "edges",
                  "start" : 0
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                  "key" : "entities",
                  "start" : 0
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(
                        key="edges"
                    ),
                    g.DiscardOutput(),
                    g.GetAllElements(),
                    g.ExportToSet(
                        key="entities"
                    ),
                    g.DiscardOutput(),
                    g.GetExports(
                        get_exports=[
                            g.GetSetExport(
                                start=0,
                                key="edges"
                            ),
                            g.GetSetExport(
                                start=0,
                                key="entities"
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements",
              "elementGenerator" : {
                "class" : "uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator"
              },
              "input" : [ "1,1", "1,2,1" ]
            }
            ''',
            g.GenerateElements(
                element_generator=g.ElementGenerator(
                    fields={},
                    class_name="uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator"
                ),
                input=[
                    "1,1",
                    "1,2,1"
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements",
              "elementGenerator" : {
                "class" : "uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObjectGenerator"
              },
              "input" : [ {
                "class" : "uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObject1",
                "a" : 1,
                "c" : 1
              }, {
                "class" : "uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObject2",
                "a" : 1,
                "b" : 2,
                "c" : 1
              } ]
            }
            ''',
            g.GenerateElements(
                element_generator=g.ElementGenerator(
                    class_name="uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObjectGenerator",
                    fields={}
                ),
                input=[
                    {'c': 1,
                     'class': 'uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObject1',
                     'a': 1},
                    {'b': 2, 'c': 1,
                     'class': 'uk.gov.gchq.gaffer.doc.operation.GenerateElementsExample$DomainObject2',
                     'a': 1}
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects",
              "elementGenerator" : {
                "class" : "uk.gov.gchq.gaffer.doc.operation.generator.ObjectGenerator"
              },
              "input" : [ {
                "group" : "entity",
                "vertex" : 6,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Entity"
              }, {
                "group" : "edge",
                "source" : 5,
                "destination" : 6,
                "directed" : true,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Edge"
              } ]
            }
            ''',
            g.GenerateObjects(
                input=[
                    g.Entity(
                        properties={'count': 1},
                        vertex=6,
                        group="entity"
                    ),
                    g.Edge(
                        directed=True,
                        source=5,
                        properties={'count': 1},
                        group="edge",
                        destination=6
                    )
                ],
                element_generator=g.ElementGenerator(
                    fields={},
                    class_name="uk.gov.gchq.gaffer.doc.operation.generator.ObjectGenerator"
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects",
              "elementGenerator" : {
                "class" : "uk.gov.gchq.gaffer.doc.operation.GenerateObjectsExample$DomainObjectGenerator"
              },
              "input" : [ {
                "group" : "entity",
                "vertex" : 6,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Entity"
              }, {
                "group" : "edge",
                "source" : 5,
                "destination" : 6,
                "directed" : true,
                "properties" : {
                  "count" : 1
                },
                "class" : "uk.gov.gchq.gaffer.data.element.Edge"
              } ]
            }
            ''',
            g.GenerateObjects(
                element_generator=g.ElementGenerator(
                    class_name="uk.gov.gchq.gaffer.doc.operation.GenerateObjectsExample$DomainObjectGenerator",
                    fields={}
                ),
                input=[
                    g.Entity(
                        properties={'count': 1},
                        vertex=6,
                        group="entity"
                    ),
                    g.Edge(
                        directed=True,
                        group="edge",
                        properties={'count': 1},
                        source=5,
                        destination=6
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetAdjacentIds(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
              "includeIncomingOutGoing" : "OUTGOING",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetAdjacentIds(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                include_incoming_out_going="OUTGOING"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
              "view" : {
                "edges" : {
                  "edge" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 1
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                },
                "entities" : { }
              },
              "includeIncomingOutGoing" : "OUTGOING",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetAdjacentIds(
                view=g.View(
                    entities=[
                    ],
                    edges=[
                        g.ElementDefinition(
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(
                                        value=1,
                                        or_equal_to=False
                                    )
                                )
                            ],
                            group="edge"
                        )
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                include_incoming_out_going="OUTGOING"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
            }
            ''',
            g.GetAllElements()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 2
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                },
                "entities" : {
                  "entity" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 2
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                }
              }
            }
            ''',
            g.GetAllElements(
                view=g.View(
                    entities=[
                        g.ElementDefinition(
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(value=2,
                                                           or_equal_to=False)
                                )
                            ],
                            group="entity"
                        )
                    ],
                    edges=[
                        g.ElementDefinition(
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(value=2,
                                                           or_equal_to=False)
                                )
                            ],
                            group="edge"
                        )
                    ]
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetAllJobDetails"
            }
            ''',
            g.GetAllJobDetails()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }, {
                "source" : 2,
                "destination" : 3,
                "directedType" : "EITHER",
                "matchedVertex" : "SOURCE",
                "class" : "uk.gov.gchq.gaffer.operation.data.EdgeSeed"
              } ],
              "seedMatching": "EQUAL"
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=2
                    ),
                    g.EdgeSeed(
                        directed_type="EITHER",
                        source=2,
                        destination=3,
                        matched_vertex="SOURCE"
                    )
                ],
                seed_matching=g.SeedMatchingType.EQUAL
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }],
              "view": {
                  "allEdges": true,
                  "allEntities": true
              }
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                view=g.View(
                    all_edges=True,
                    all_entities=True
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }],
              "view": {
                  "allEdges": true
              }
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                view=g.View(
                    all_edges=True,
                    all_entities=False
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }],
              "view": {
                  "allEntities": true
              }
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                view=g.View(
                    all_entities=True
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 1
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                },
                "entities" : {
                  "entity" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 1
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                }
              },
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }, {
                "source" : 2,
                "destination" : 3,
                "directedType" : "EITHER",
                "matchedVertex" : "SOURCE",
                "class" : "uk.gov.gchq.gaffer.operation.data.EdgeSeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group="edge",
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(value=1,
                                                           or_equal_to=False)
                                )
                            ]
                        )
                    ],
                    entities=[
                        g.ElementDefinition(
                            group="entity",
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(value=1,
                                                           or_equal_to=False)
                                )
                            ]
                        )
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    ),
                    g.EdgeSeed(
                        source=2,
                        matched_vertex="SOURCE",
                        directed_type="EITHER",
                        destination=3
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "source" : 1,
                "destination" : 2,
                "directedType" : "EITHER",
                "matchedVertex" : "SOURCE",
                "class" : "uk.gov.gchq.gaffer.operation.data.EdgeSeed"
              } ]
            }
            ''',
            g.GetElements(
                input=[
                    g.EdgeSeed(
                        source=1,
                        directed_type="EITHER",
                        matched_vertex="SOURCE",
                        destination=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 1
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                },
                "entities" : {
                  "entity" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo" : false,
                        "value" : 1
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                }
              },
              "input" : [ {
                "source" : 1,
                "destination" : 2,
                "directedType" : "EITHER",
                "matchedVertex" : "SOURCE",
                "class" : "uk.gov.gchq.gaffer.operation.data.EdgeSeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group="edge",
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    predicate=g.IsMoreThan(
                                        value=1,
                                        or_equal_to=False
                                    ),
                                    selection=[
                                        "count"
                                    ]
                                )
                            ]
                        )
                    ],
                    entities=[
                        g.ElementDefinition(
                            group="entity",
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.IsMoreThan(value=1,
                                                           or_equal_to=False)
                                )
                            ]
                        )
                    ]
                ),
                input=[
                    g.EdgeSeed(
                        matched_vertex="SOURCE",
                        source=1,
                        directed_type="EITHER",
                        destination=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : { },
                "entities" : {
                  "entity" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.Or",
                        "predicates" : [ {
                          "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                          "orEqualTo" : false,
                          "value" : 2
                        }, {
                          "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                          "orEqualTo" : false,
                          "value" : 5
                        } ]
                      },
                      "selection" : [ "count" ]
                    } ]
                  }
                }
              },
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }, {
                "source" : 2,
                "destination" : 3,
                "directedType" : "EITHER",
                "matchedVertex" : "SOURCE",
                "class" : "uk.gov.gchq.gaffer.operation.data.EdgeSeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    edges=[
                    ],
                    entities=[
                        g.ElementDefinition(
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=[
                                        "count"
                                    ],
                                    predicate=g.Or(
                                        predicates=[
                                            g.IsLessThan(
                                                or_equal_to=False,
                                                value=2
                                            ),
                                            g.IsMoreThan(
                                                or_equal_to=False,
                                                value=5
                                            )
                                        ]
                                    )
                                )
                            ],
                            group="entity"
                        )
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    ),
                    g.EdgeSeed(
                        directed_type="EITHER",
                        matched_vertex="SOURCE",
                        source=2,
                        destination=3
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "preAggregationFilterFunctions" : [ {
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.Or",
                        "predicates" : [ {
                          "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                          "predicate" : {
                            "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                            "orEqualTo" : false,
                            "value" : 2
                          },
                          "selection" : [ 0 ]
                        }, {
                          "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                          "predicate" : {
                            "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                            "orEqualTo" : false,
                            "value" : 3
                          },
                          "selection" : [ 1 ]
                        } ]
                      },
                      "selection" : [ "SOURCE", "DESTINATION" ]
                    } ]
                  }
                },
                "entities" : { }
              },
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    predicate=g.Or(
                                        predicates=[
                                            g.NestedPredicate(
                                                predicate=g.IsLessThan(
                                                    or_equal_to=False,
                                                    value=2
                                                ),
                                                selection=[
                                                    0
                                                ]
                                            ),
                                            g.NestedPredicate(
                                                predicate=g.IsMoreThan(
                                                    or_equal_to=False,
                                                    value=3
                                                ),
                                                selection=[
                                                    1
                                                ]
                                            )
                                        ]
                                    ),
                                    selection=[
                                        "SOURCE",
                                        "DESTINATION"
                                    ]
                                )
                            ],
                            group="edge"
                        )
                    ],
                    entities=[
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "properties" : [ "vertex|count" ],
                    "transientProperties" : {
                      "vertex|count" : "java.lang.String"
                    },
                    "transformFunctions" : [ {
                      "function" : {
                        "class" : "uk.gov.gchq.koryphe.impl.function.Concat",
                        "separator" : "|"
                      },
                      "selection" : [ "SOURCE", "count" ],
                      "projection" : [ "vertex|count" ]
                    } ]
                  }
                },
                "entities" : { }
              },
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            transform_functions=[
                                g.FunctionContext(
                                    projection=[
                                        "vertex|count"
                                    ],
                                    function=g.Concat(separator='|'),
                                    selection=[
                                        "SOURCE",
                                        "count"
                                    ]
                                )
                            ],
                            group="edge",
                            properties=[
                                "vertex|count"
                            ],
                            transient_properties={
                                'vertex|count': 'java.lang.String'}
                        )
                    ],
                    entities=[
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "view" : {
                "edges" : {
                  "edge" : {
                    "excludeProperties" : [ "count" ],
                    "transientProperties" : {
                      "vertex|count" : "java.lang.String"
                    },
                    "transformFunctions" : [ {
                      "function" : {
                        "class" : "uk.gov.gchq.koryphe.impl.function.Concat",
                        "separator" : "|"
                      },
                      "selection" : [ "SOURCE", "count" ],
                      "projection" : [ "vertex|count" ]
                    } ]
                  }
                },
                "entities" : { }
              },
              "input" : [ {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetElements(
                view=g.View(
                    entities=[
                    ],
                    edges=[
                        g.ElementDefinition(
                            exclude_properties=[
                                "count"
                            ],
                            transient_properties={
                                'vertex|count': 'java.lang.String'},
                            transform_functions=[
                                g.FunctionContext(
                                    selection=[
                                        "SOURCE",
                                        "count"
                                    ],
                                    function=g.Concat(separator='|'),
                                    projection=[
                                        "vertex|count"
                                    ]
                                )
                            ],
                            group="edge"
                        )
                    ]
                ),
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.get.GetFromEndpoint",
                "endpoint": "http://mydata.io"
            }
            ''',
            g.GetFromEndpoint(endpoint="http://mydata.io")
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                "key" : "ALL"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(),
                    g.DiscardOutput(),
                    g.GetGafferResultCacheExport(
                        key="ALL"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(),
                    g.DiscardOutput(),
                    g.GetJobDetails()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                "jobId" : "675c6d4a-fba0-410b-8b84-6b40d0415555",
                "key" : "ALL"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetGafferResultCacheExport(
                        key="ALL",
                        job_id="675c6d4a-fba0-410b-8b84-6b40d0415555"
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
                "key" : "edges"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
                "key" : "entities"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.GetExports",
                "getExports" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                  "key" : "edges"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                  "key" : "entities"
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(
                        key="edges"
                    ),
                    g.DiscardOutput(),
                    g.GetAllElements(),
                    g.ExportToGafferResultCache(
                        key="entities"
                    ),
                    g.DiscardOutput(),
                    g.GetExports(
                        get_exports=[
                            g.GetGafferResultCacheExport(
                                key="edges"
                            ),
                            g.GetGafferResultCacheExport(
                                key="entities"
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails",
              "jobId" : "18be2a20-5f36-4598-b522-1efc409b6b39"
            }
            ''',
            g.GetJobDetails(
                job_id="18be2a20-5f36-4598-b522-1efc409b6b39"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults",
              "jobId" : "92932856-be96-41b3-85d8-bba7b6886284"
            }
            ''',
            g.GetJobResults(
                job_id="92932856-be96-41b3-85d8-bba7b6886284"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                "start" : 0
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(),
                    g.DiscardOutput(),
                    g.GetSetExport(
                        start=0
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                "start" : 2,
                "end" : 4
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(),
                    g.DiscardOutput(),
                    g.GetSetExport(
                        start=2,
                        end=4
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
                "key" : "edges"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
                "key" : "entities"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.export.GetExports",
                "getExports" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                  "key" : "edges",
                  "start" : 0
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
                  "key" : "entities",
                  "start" : 0
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.ExportToSet(
                        key="edges"
                    ),
                    g.DiscardOutput(),
                    g.GetAllElements(),
                    g.ExportToSet(
                        key="entities"
                    ),
                    g.DiscardOutput(),
                    g.GetExports(
                        get_exports=[
                            g.GetSetExport(
                                start=0,
                                key="edges"
                            ),
                            g.GetSetExport(
                                start=0,
                                key="entities"
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                "resultLimit" : 3,
                "truncate" : true
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.Limit(
                        truncate=True,
                        result_limit=3
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                "resultLimit" : 3,
                "truncate" : false
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.Limit(
                        truncate=False,
                        result_limit=3
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                "resultLimit" : 3,
                "truncate" : true
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetAllElements(),
                    g.Limit(
                        result_limit=3,
                        truncate=True
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Max",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.Max(
                        comparators=[
                            g.ElementPropertyComparator(
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                property="count",
                                reversed=False
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "DESTINATION", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  },
                  "entities" : {
                    "entity" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "VERTEX", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  }
                },
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Max",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                }, {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "score",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ],
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            selection=[
                                                "DESTINATION",
                                                "count"
                                            ],
                                            function=g.Function(
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction",
                                                fields={}
                                            ),
                                            projection=[
                                                "score"
                                            ]
                                        )
                                    ],
                                    group="edge",
                                    transient_properties={
                                        'score': 'java.lang.Integer'}
                                )
                            ],
                            entities=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            selection=[
                                                "VERTEX",
                                                "count"
                                            ],
                                            function=g.Function(
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction",
                                                fields={}
                                            ),
                                            projection=[
                                                "score"
                                            ]
                                        )
                                    ],
                                    group="entity",
                                    transient_properties={
                                        'score': 'java.lang.Integer'}
                                )
                            ]
                        )
                    ),
                    g.Max(
                        comparators=[
                            g.ElementPropertyComparator(
                                reversed=False,
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                property="count"
                            ),
                            g.ElementPropertyComparator(
                                reversed=False,
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                property="score"
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Min",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.Min(
                        comparators=[
                            g.ElementPropertyComparator(
                                property="count",
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                reversed=False
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "DESTINATION", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  },
                  "entities" : {
                    "entity" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "VERTEX", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  }
                },
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Min",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                }, {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "score",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ]
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ],
                        view=g.View(
                            entities=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            function=g.Function(
                                                fields={},
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                                            ),
                                            selection=[
                                                "VERTEX",
                                                "count"
                                            ],
                                            projection=[
                                                "score"
                                            ]
                                        )
                                    ],
                                    transient_properties={
                                        'score': 'java.lang.Integer'},
                                    group="entity"
                                )
                            ],
                            edges=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            function=g.Function(
                                                fields={},
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                                            ),
                                            selection=[
                                                "DESTINATION",
                                                "count"
                                            ],
                                            projection=[
                                                "score"
                                            ]
                                        )
                                    ],
                                    transient_properties={
                                        'score': 'java.lang.Integer'},
                                    group="edge"
                                )
                            ]
                        )
                    ),
                    g.Min(
                        comparators=[
                            g.ElementPropertyComparator(
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                property="count",
                                reversed=False
                            ),
                            g.ElementPropertyComparator(
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                property="score",
                                reversed=False
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
              "operationName" : "2-hop",
              "description" : "2 hop query",
              "readAccessRoles" : [ "read-user" ],
              "writeAccessRoles" : [ "write-user" ],
              "overwriteFlag" : true,
              "operationChain" : {
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                } ]
              }
            }
            ''',
            g.AddNamedOperation(
                operation_chain=g.OperationChainDAO(
                    operations=[
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        )
                    ]
                ),
                overwrite_flag=True,
                write_access_roles=[
                    "write-user"
                ],
                description="2 hop query",
                read_access_roles=[
                    "read-user"
                ],
                operation_name="2-hop"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
              "operationName" : "2-hop-with-score",
              "description" : "2 hop query",
              "readAccessRoles" : [ "read-user" ],
              "writeAccessRoles" : [ "write-user" ],
              "overwriteFlag" : true,
              "score" : 3,
              "operationChain" : {
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                } ]
              }
            }
            ''',
            g.AddNamedOperation(
                operation_chain=g.OperationChainDAO(
                    operations=[
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        )
                    ]
                ),
                overwrite_flag=True,
                write_access_roles=[
                    "write-user"
                ],
                description="2 hop query",
                read_access_roles=[
                    "read-user"
                ],
                score=3,
                operation_name="2-hop-with-score"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
              "operationName" : "2-hop-with-limit",
              "description" : "2 hop query with settable limit",
              "readAccessRoles" : [ "read-user" ],
              "writeAccessRoles" : [ "write-user" ],
              "overwriteFlag" : true,
              "parameters" : {
                "param1" : {
                  "description" : "Limit param",
                  "defaultValue" : 1,
                  "valueClass" : "java.lang.Long",
                  "required" : false
                }
              },
              "operationChain" : {
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                  "resultLimit" : "${param1}"
                } ]
              }
            }
            ''',
            g.AddNamedOperation(
                description="2 hop query with settable limit",
                parameters=[
                    g.NamedOperationParameter(
                        value_class="java.lang.Long",
                        description="Limit param",
                        required=False,
                        default_value=1,
                        name="param1"
                    )
                ],
                operation_name="2-hop-with-limit",
                overwrite_flag=True,
                read_access_roles=[
                    "read-user"
                ],
                write_access_roles=[
                    "write-user"
                ],
                operation_chain=g.OperationChainDAO(
                    operations=[
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.Limit(
                            result_limit="${param1}"
                        )
                    ]
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
              "operationName" : "2-hop-with-limit",
              "description" : "2 hop query with settable limit",
              "readAccessRoles" : [ "read-user" ],
              "writeAccessRoles" : [ "write-user" ],
              "overwriteFlag" : true,
              "parameters" : {
                "param1" : {
                  "description" : "Limit param",
                  "defaultValue" : 1,
                  "valueClass" : "java.lang.Long",
                  "required" : false
                }
              },
              "operationChain" : {
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                  "includeIncomingOutGoing" : "OUTGOING"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                  "resultLimit" : "${param1}"
                } ]
              }
            }
            ''',
            g.AddNamedOperation(
                read_access_roles=[
                    "read-user"
                ],
                operation_chain=g.OperationChainDAO(
                    operations=[
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.GetAdjacentIds(
                            include_incoming_out_going="OUTGOING"
                        ),
                        g.Limit(
                            result_limit="${param1}"
                        )
                    ]
                ),
                write_access_roles=[
                    "write-user"
                ],
                parameters=[
                    g.NamedOperationParameter(
                        required=False,
                        value_class="java.lang.Long",
                        name="param1",
                        default_value=1,
                        description="Limit param"
                    )
                ],
                operation_name="2-hop-with-limit",
                overwrite_flag=True,
                description="2 hop query with settable limit"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
            }
            ''',
            g.GetAllNamedOperations()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.NamedOperation",
              "operationName" : "2-hop",
              "input" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                "vertex" : 1,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.NamedOperation(
                operation_name="2-hop",
                input=[
                    g.EntitySeed(
                        vertex=1
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.NamedOperation",
              "operationName" : "2-hop-with-limit",
              "parameters" : {
                "param1" : 2
              },
              "input" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                "vertex" : 1,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.NamedOperation(
                parameters={'param1': 2},
                input=[
                    g.EntitySeed(
                        vertex=1
                    )
                ],
                operation_name="2-hop-with-limit"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation",
              "operationName" : "2-hop"
            }
            ''',
            g.DeleteNamedOperation(
                operation_name="2-hop"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Sort",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ],
                "resultLimit" : 10,
                "deduplicate" : true
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.Sort(
                        comparators=[
                            g.ElementPropertyComparator(
                                property="count",
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                reversed=False
                            )
                        ],
                        result_limit=10,
                        deduplicate=True
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Sort",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ],
                "resultLimit" : 10,
                "deduplicate" : false
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.Sort(
                        result_limit=10,
                        deduplicate=False,
                        comparators=[
                            g.ElementPropertyComparator(
                                property="count",
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                reversed=False
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "DESTINATION", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  },
                  "entities" : {
                    "entity" : {
                      "transientProperties" : {
                        "score" : "java.lang.Integer"
                      },
                      "transformFunctions" : [ {
                        "function" : {
                          "class" : "uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction"
                        },
                        "selection" : [ "VERTEX", "count" ],
                        "projection" : [ "score" ]
                      } ]
                    }
                  }
                },
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.compare.Sort",
                "comparators" : [ {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "count",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                }, {
                  "class" : "uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator",
                  "property" : "score",
                  "groups" : [ "entity", "edge" ],
                  "reversed" : false
                } ],
                "resultLimit" : 4,
                "deduplicate" : true
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ],
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            projection=[
                                                "score"
                                            ],
                                            selection=[
                                                "DESTINATION",
                                                "count"
                                            ],
                                            function=g.Function(
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction",
                                                fields={}
                                            )
                                        )
                                    ],
                                    group="edge",
                                    transient_properties={
                                        'score': 'java.lang.Integer'}
                                )
                            ],
                            entities=[
                                g.ElementDefinition(
                                    transform_functions=[
                                        g.FunctionContext(
                                            projection=[
                                                "score"
                                            ],
                                            selection=[
                                                "VERTEX",
                                                "count"
                                            ],
                                            function=g.Function(
                                                class_name="uk.gov.gchq.gaffer.doc.operation.function.ExampleScoreFunction",
                                                fields={}
                                            )
                                        )
                                    ],
                                    group="entity",
                                    transient_properties={
                                        'score': 'java.lang.Integer'}
                                )
                            ]
                        )
                    ),
                    g.Sort(
                        result_limit=4,
                        comparators=[
                            g.ElementPropertyComparator(
                                property="count",
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                reversed=False
                            ),
                            g.ElementPropertyComparator(
                                property="score",
                                groups=[
                                    "entity",
                                    "edge"
                                ],
                                reversed=False
                            )
                        ],
                        deduplicate=True
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToArray"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToArray()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToCsv",
                "elementGenerator" : {
                  "class" : "uk.gov.gchq.gaffer.data.generator.CsvGenerator",
                  "fields" : {
                    "GROUP" : "Edge group",
                    "VERTEX" : "vertex",
                    "SOURCE" : "source",
                    "count" : "total count"
                  },
                  "quoted" : false
                },
                "includeHeader" : true
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToCsv(
                        include_header=True,
                        element_generator=g.CsvGenerator(
                            fields={
                                'GROUP': 'Edge group',
                                'VERTEX': 'vertex',
                                'count': 'total count',
                                'SOURCE': 'source'
                            },
                            quoted=False
                        )
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToEntitySeeds()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToList"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToList()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToMap",
                "elementGenerator" : {
                  "class" : "uk.gov.gchq.gaffer.data.generator.MapGenerator",
                  "fields" : {
                    "GROUP" : "group",
                    "VERTEX" : "vertex",
                    "SOURCE" : "source",
                    "count" : "total count"
                  }
                }
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToMap(
                        element_generator=g.MapGenerator(
                            fields={
                                'SOURCE': 'source',
                                'count': 'total count',
                                'VERTEX': 'vertex',
                                'GROUP': 'group'
                            }
                        )
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
              "input" : [ {
                "vertex" : 1,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              }, {
                "vertex" : 2,
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
              } ]
            }
            ''',
            g.GetElements(
                input=[
                    g.EntitySeed(
                        vertex=1
                    ),
                    g.EntitySeed(
                        vertex=2
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToStream"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToStream()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : { },
                  "entities" : {
                    "entity" : { }
                  }
                },
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
                "edgeVertices" : "NONE"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        view=g.View(
                            edges=[
                            ],
                            entities=[
                                g.ElementDefinition(
                                    group="entity"
                                )
                            ]
                        ),
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToVertices(
                        edge_vertices="NONE"
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                },
                "includeIncomingOutGoing" : "OUTGOING",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
                "edgeVertices" : "DESTINATION"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ]
                        ),
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ],
                        include_incoming_out_going="OUTGOING"
                    ),
                    g.ToVertices(
                        edge_vertices="DESTINATION"
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                },
                "includeIncomingOutGoing" : "OUTGOING",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
                "edgeVertices" : "BOTH"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ]
                        ),
                        include_incoming_out_going="OUTGOING",
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ]
                    ),
                    g.ToVertices(
                        edge_vertices="BOTH"
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "view" : {
                  "edges" : {
                    "edge" : { }
                  },
                  "entities" : { }
                },
                "includeIncomingOutGoing" : "OUTGOING",
                "input" : [ {
                  "vertex" : 1,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                }, {
                  "vertex" : 2,
                  "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
                "useMatchedVertex" : "EQUAL"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetElements(
                        view=g.View(
                            edges=[
                                g.ElementDefinition(
                                    group="edge"
                                )
                            ],
                            entities=[
                            ]
                        ),
                        input=[
                            g.EntitySeed(
                                vertex=1
                            ),
                            g.EntitySeed(
                                vertex=2
                            )
                        ],
                        include_incoming_out_going="OUTGOING"
                    ),
                    g.ToVertices(
                        use_matched_vertex="EQUAL"
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
              "operations" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults",
                "jobId" : "job1"
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.impl.function.Filter",
                "globalEdges" : {
                  "predicates" : [ {
                    "predicate" : {
                      "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                      "orEqualTo" : false,
                      "value" : 2
                    },
                    "selection" : [ "count" ]
                  } ]
                }
              } ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetJobResults(
                        job_id="job1"
                    ),
                    g.Filter(
                        global_edges=g.GlobalElementFilterDefinition(
                            predicates=[
                                g.PredicateContext(
                                    selection=["count"],
                                    predicate=g.IsMoreThan(
                                        value=2,
                                        or_equal_to=False
                                    )
                                )
                            ]
                        )
                    )
                ]
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.function.Filter",
                "globalElements": {
                    "predicates": [
                        {
                            "selection": [
                                "timestamp"
                            ],
                            "predicate": {
                                "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                                "value": 1,
                                "orEqualTo": true
                            }
                        },
                        {
                            "selection": [
                                "timestamp"
                            ],
                            "predicate": {
                                "class": "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                                "value": 10,
                                "orEqualTo": true
                            }
                        }
                    ]
                },
                "edges": {
                    "edge2": {
                        "predicates": [
                            {
                                "selection": [
                                    "prop2"
                                ],
                                "predicate": {
                                    "class": "uk.gov.gchq.koryphe.impl.predicate.Regex",
                                    "value": "a.*"
                                }
                            }
                        ]
                    },
                    "edge1": {
                        "predicates": [
                            {
                                "selection": [
                                    "prop2"
                                ],
                                "predicate": {
                                    "class": "uk.gov.gchq.koryphe.impl.predicate.Regex",
                                    "value": "a.*"
                                }
                            }
                        ]
                    }
                },
                "globalEntities": {
                    "predicates": [
                        {
                            "selection": [
                                "timestamp"
                            ],
                            "predicate": {
                                "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                                "value": 1,
                                "orEqualTo": true
                            }
                        }
                    ]
                },
                "entities": {
                    "entity1": {
                        "predicates": [
                            {
                                "selection": [
                                    "prop"
                                ],
                                "predicate": {
                                    "class": "uk.gov.gchq.koryphe.impl.predicate.Regex",
                                    "value": "a.*"
                                }
                            }
                        ]
                    },
                    "entity2": {
                        "predicates": [
                            {
                                "selection": [
                                    "prop"
                                ],
                                "predicate": {
                                    "class": "uk.gov.gchq.koryphe.impl.predicate.Regex",
                                    "value": "a.*"
                                }
                            }
                        ]
                    }
                },
                "globalEdges": {
                    "predicates": [
                        {
                            "selection": [
                                "count"
                            ],
                            "predicate": {
                                "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                                "value": 2,
                                "orEqualTo": false
                            }
                        }
                    ]
                }
            }

            ''',
            g.Filter(
                global_edges=g.GlobalElementFilterDefinition(
                    predicates=[
                        g.PredicateContext(
                            selection=["count"],
                            predicate=g.IsMoreThan(
                                value=2,
                                or_equal_to=False
                            )
                        )
                    ]
                ),
                global_entities=g.GlobalElementFilterDefinition(
                    predicates=[
                        g.PredicateContext(
                            selection=["timestamp"],
                            predicate=g.IsMoreThan(
                                value=1,
                                or_equal_to=True
                            )
                        )
                    ]
                ),
                global_elements=g.GlobalElementFilterDefinition(
                    predicates=[
                        g.PredicateContext(
                            selection=["timestamp"],
                            predicate=g.IsMoreThan(
                                value=1,
                                or_equal_to=True
                            )
                        ),
                        g.PredicateContext(
                            selection=["timestamp"],
                            predicate=g.IsLessThan(
                                value=10,
                                or_equal_to=True
                            )
                        )
                    ]
                ),
                entities=[
                    g.ElementFilterDefinition(
                        group="entity1",
                        predicates=[
                            g.PredicateContext(
                                selection=["prop"],
                                predicate=g.Regex(
                                    value="a.*"
                                )
                            )
                        ]
                    ),
                    g.ElementFilterDefinition(
                        group="entity2",
                        predicates=[
                            g.PredicateContext(
                                selection=["prop"],
                                predicate=g.Regex(
                                    value="a.*"
                                )
                            )
                        ]
                    )
                ],
                edges=[
                    g.ElementFilterDefinition(
                        group="edge1",
                        predicates=[
                            g.PredicateContext(
                                selection=["prop2"],
                                predicate=g.Regex(
                                    value="a.*"
                                )
                            )
                        ]
                    ),
                    g.ElementFilterDefinition(
                        group="edge2",
                        predicates=[
                            g.PredicateContext(
                                selection=["prop2"],
                                predicate=g.Regex(
                                    value="a.*"
                                )
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
                "operations": [
                    {
                        "jobId": "job1",
                        "class": "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults"
                    },
                    {
                        "edges": {
                            "edge2": {
                                "elementAggregator": {
                                    "operators": [
                                        {
                                            "selection": [
                                                "prop2"
                                            ],
                                            "binaryOperator": {
                                                "class": "exampleBinaryOperator"
                                            }
                                        }
                                    ]
                                }
                            },
                            "edge1": {
                                "elementAggregator": {
                                    "operators": [
                                        {
                                            "selection": [
                                                "prop2"
                                            ],
                                            "binaryOperator": {
                                                "class": "exampleBinaryOperator"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "entities": {
                            "entity1": {
                                "elementAggregator": {
                                    "operators": [
                                        {
                                            "selection": [
                                                "prop"
                                            ],
                                            "binaryOperator": {
                                                "class": "exampleBinaryOperator"
                                            }
                                        }
                                    ]
                                }
                            },
                            "entity2": {
                                "elementAggregator": {
                                    "operators": [
                                        {
                                            "selection": [
                                                "prop"
                                            ],
                                            "binaryOperator": {
                                                "class": "exampleBinaryOperator"
                                            }
                                        }
                                    ]
                                },
                                "groupBy": [
                                    "timestamp"
                                ]
                            }
                        },
                        "class": "uk.gov.gchq.gaffer.operation.impl.function.Aggregate"
                    }
                ],
                "class": "uk.gov.gchq.gaffer.operation.OperationChain"
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetJobResults(
                        job_id="job1"
                    ),
                    g.Aggregate(
                        entities=[
                            g.AggregatePair(
                                group="entity1",
                                element_aggregator=g.ElementAggregateDefinition(
                                    operators=[
                                        g.BinaryOperatorContext(
                                            selection=["prop"],
                                            binary_operator=g.BinaryOperator(
                                                class_name="exampleBinaryOperator"
                                            )
                                        )
                                    ]
                                )
                            ),
                            g.AggregatePair(
                                group="entity2",
                                group_by=[
                                    "timestamp"
                                ],
                                element_aggregator=g.ElementAggregateDefinition(
                                    operators=[
                                        g.BinaryOperatorContext(
                                            selection=["prop"],
                                            binary_operator=g.BinaryOperator(
                                                class_name="exampleBinaryOperator"
                                            )
                                        )
                                    ]
                                )
                            )
                        ],
                        edges=[
                            g.AggregatePair(
                                group="edge1",
                                element_aggregator=g.ElementAggregateDefinition(
                                    operators=[
                                        g.BinaryOperatorContext(
                                            selection=["prop2"],
                                            binary_operator=g.BinaryOperator(
                                                class_name="exampleBinaryOperator"
                                            )
                                        )
                                    ]
                                )
                            ),
                            g.AggregatePair(
                                group="edge2",
                                element_aggregator=g.ElementAggregateDefinition(
                                    operators=[
                                        g.BinaryOperatorContext(
                                            selection=["prop2"],
                                            binary_operator=g.BinaryOperator(
                                                class_name="exampleBinaryOperator"
                                            )
                                        )
                                    ]
                                )
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations": [
                    {
                        "class": "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults",
                        "jobId": "job1"
                    },
                    {
                        "class": "uk.gov.gchq.gaffer.operation.impl.function.Transform",
                        "edges": {
                            "edge1": {
                                "functions": [
                                    {
                                        "selection": [
                                            "prop2"
                                        ],
                                        "projection": [
                                            "newProp2"
                                        ],
                                        "function": {
                                            "class": "exampleFunction"
                                        }
                                    }
                                ]
                            },
                            "edge2": {
                                "functions": [
                                    {
                                        "selection": [
                                            "prop2"
                                        ],
                                        "projection": [
                                            "newProp2"
                                        ],
                                        "function": {
                                            "class": "exampleFunction"
                                        }
                                    }
                                ]
                            }
                        },
                        "entities": {
                            "entity1": {
                                "functions": [
                                    {
                                        "selection": [
                                            "prop"
                                        ],
                                        "projection": [
                                            "newProp"
                                        ],
                                        "function": {
                                            "class": "exampleFunction"
                                        }
                                    }
                                ]
                            },
                            "entity2": {
                                "functions": [
                                    {
                                        "selection": [
                                            "prop"
                                        ],
                                        "projection": [
                                            "newProp"
                                        ],
                                        "function": {
                                            "class": "exampleFunction"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetJobResults(
                        job_id="job1"
                    ),
                    g.Transform(
                        entities=[
                            g.ElementTransformDefinition(
                                group="entity1",
                                functions=[
                                    g.FunctionContext(
                                        selection=["prop"],
                                        function=g.Function(
                                            class_name="exampleFunction"
                                        ),
                                        projection=["newProp"]
                                    )
                                ]
                            ),
                            g.ElementTransformDefinition(
                                group="entity2",
                                functions=[
                                    g.FunctionContext(
                                        selection=["prop"],
                                        function=g.Function(
                                            class_name="exampleFunction"
                                        ),
                                        projection=["newProp"]
                                    )
                                ]
                            )
                        ],
                        edges=[
                            g.ElementTransformDefinition(
                                group="edge1",
                                functions=[
                                    g.FunctionContext(
                                        selection=["prop2"],
                                        function=g.Function(
                                            class_name="exampleFunction"
                                        ),
                                        projection=["newProp2"]
                                    )
                                ]
                            ),
                            g.ElementTransformDefinition(
                                group="edge2",
                                functions=[
                                    g.FunctionContext(
                                        selection=["prop2"],
                                        function=g.Function(
                                            class_name="exampleFunction"
                                        ),
                                        projection=["newProp2"]
                                    )
                                ]
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.ScoreOperationChain",
                "operationChain" : {
                    "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations" : [ {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                    }, {
                        "class" : "uk.gov.gchq.gaffer.named.operation.NamedOperation",
                        "operationName" : "namedOp"
                    }, {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                        "resultLimit" : 3,
                        "truncate" : true
                    } ]
                }
            }
            ''',
            g.ScoreOperationChain(
                operation_chain=g.OperationChain(
                    operations=[
                        g.GetElements(),
                        g.NamedOperation(
                            operation_name='namedOp'
                        ),
                        g.Limit(
                            truncate=True,
                            result_limit=3
                        )
                    ]
                )
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.ScoreOperationChain",
                "operationChain" : {
                    "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations" : [ {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                    }, {
                        "class" : "uk.gov.gchq.gaffer.named.operation.NamedOperation",
                        "operationName" : "namedOp"
                    }, {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                        "resultLimit" : 3,
                        "truncate" : true
                    } ]
                }
            }
            ''',
            g.ScoreOperationChain(
                operation_chain={
                    "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations": [{
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                    }, {
                        "class": "uk.gov.gchq.gaffer.named.operation.NamedOperation",
                        "operationName": "namedOp"
                    }, {
                        "class": "uk.gov.gchq.gaffer.operation.impl.Limit",
                        "resultLimit": 3,
                        "truncate": True
                    }]
                }
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations": [{
                    "class": "uk.gov.gchq.gaffer.operation.impl.GetWalks",
                    "resultsLimit": 500000,
                    "input": [{
                        "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                        "vertex": 1
                    }],
                    "operations": [{
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                        "input": [{
                            "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                            "vertex": 2
                        }]
                    }, {
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                        "input": [{
                            "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                            "vertex": 4
                        }]
                    }]
                }]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetWalks(
                        results_limit=500000,
                        input=[
                            g.EntitySeed(
                                vertex=1
                            )
                        ],
                        operations=[
                            g.GetElements(
                                input=[
                                    g.EntitySeed(
                                        vertex=2
                                    )
                                ]
                            ),
                            g.GetElements(
                                input=[
                                    g.EntitySeed(
                                        vertex=4
                                    )
                                ]
                            )
                        ]
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.GetWalks",
              "operations" : [
                {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                  "view" : {
                    "edges" : {
                      "BasicEdge" : {
                        "properties" : [ "count" ]
                      }
                    },
                    "entities" : { }
                  },
                  "directedType" : "DIRECTED",
                  "includeIncomingOutGoing" : "OUTGOING"
                },
                {
                "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                  "view" : {
                    "edges" : { },
                    "entities" : {
                      "BasicEntity" : {
                        "postAggregationFilterFunctions" : [ {
                          "predicate" : {
                            "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                            "orEqualTo" : false,
                            "value" : 3
                          },
                          "selection" : [ "property1" ]
                        } ]
                      }
                    }
                  }
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                  "view" : {
                    "edges" : {
                      "BasicEdge" : {
                        "properties" : [ "count" ]
                      }
                    },
                    "entities" : { }
                  },
                  "directedType" : "DIRECTED",
                  "includeIncomingOutGoing" : "OUTGOING"
                } ]
              }, {
                "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                  "view" : {
                    "edges" : { },
                    "entities" : {
                      "BasicEntity" : {
                        "postAggregationFilterFunctions" : [ {
                          "predicate" : {
                            "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                            "orEqualTo" : false,
                            "value" : 3
                          },
                          "selection" : [ "property1" ]
                        } ]
                      }
                    }
                  }
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                  "view" : {
                    "edges" : {
                      "BasicEdge" : {
                        "properties" : [ "count" ]
                      }
                    },
                    "entities" : { }
                  },
                  "directedType" : "DIRECTED",
                  "includeIncomingOutGoing" : "OUTGOING"
                } ]
              } ],
              "resultsLimit" : 1000000,
              "input" : [ {
                "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                "vertex" : "A"
              } ]
            }
            ''',
            g.GetWalks(
                results_limit=1000000,
                operations=[
                    g.GetElements(
                        view=g.View(
                            entities=[
                            ],
                            edges=[
                                g.ElementDefinition(
                                    properties=[
                                        "count"
                                    ],
                                    group="BasicEdge"
                                )
                            ]
                        ),
                        directed_type="DIRECTED",
                        include_incoming_out_going="OUTGOING"
                    ),
                    g.OperationChain(
                        operations=[
                            g.GetElements(
                                view=g.View(
                                    entities=[
                                        g.ElementDefinition(
                                            post_aggregation_filter_functions=[
                                                g.PredicateContext(
                                                    selection=[
                                                        "property1"
                                                    ],
                                                    predicate=g.IsLessThan(
                                                        or_equal_to=False,
                                                        value=3
                                                    )
                                                )
                                            ],
                                            group="BasicEntity"
                                        )
                                    ],
                                    edges=[
                                    ]
                                )
                            ),
                            g.GetElements(
                                view=g.View(
                                    entities=[
                                    ],
                                    edges=[
                                        g.ElementDefinition(
                                            properties=[
                                                "count"
                                            ],
                                            group="BasicEdge"
                                        )
                                    ]
                                ),
                                directed_type="DIRECTED",
                                include_incoming_out_going="OUTGOING"
                            )
                        ]
                    ),
                    g.OperationChain(
                        operations=[
                            g.GetElements(
                                view=g.View(
                                    entities=[
                                        g.ElementDefinition(
                                            post_aggregation_filter_functions=[
                                                g.PredicateContext(
                                                    selection=[
                                                        "property1"
                                                    ],
                                                    predicate=g.IsLessThan(
                                                        or_equal_to=False,
                                                        value=3
                                                    )
                                                )
                                            ],
                                            group="BasicEntity"
                                        )
                                    ],
                                    edges=[
                                    ]
                                )
                            ),
                            g.GetElements(
                                view=g.View(
                                    entities=[
                                    ],
                                    edges=[
                                        g.ElementDefinition(
                                            properties=[
                                                "count"
                                            ],
                                            group="BasicEdge"
                                        )
                                    ]
                                ),
                                directed_type="DIRECTED",
                                include_incoming_out_going="OUTGOING"
                            )
                        ]
                    )
                ],
                input=[
                    g.EntitySeed(
                        vertex="A"
                    )
                ]
            )
        ],
        [
            '''
            {
            "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
            "operations" : [
                {
                    "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations" : [
                        {
                            "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                        },
                        {
                            "class" : "uk.gov.gchq.gaffer.operation.impl.Limit",
                            "resultLimit" : 3,
                            "truncate" : true
                        }
                    ]
                }
            ],
            "options": {
                "key1": "value1"
            }
        }
        ''',
            g.OperationChain(
                operations=[
                    g.OperationChain(
                        operations=[
                            g.GetElements(),
                            g.Limit(result_limit=3, truncate=True)
                        ]
                    )
                ],
                options={"key1": "value1"}
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.store.operation.GetSchema",
                "compact": true
            }
            ''',
            g.GetSchema(
                compact=True
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations": [{
                    "class": "uk.gov.gchq.gaffer.operation.impl.GetWalks",
                    "operations": [{
                            "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                            "view": {
                                "edges": {
                                    "JunctionLocatedAt": {}
                                },
                                "entities": {}
                            }
                        },
                        {
                            "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                            "view": {
                                "edges": {
                                    "RoadUse": {}
                                },
                                "entities": {}
                            }
                        }
                    ],
                    "resultsLimit": 10000,
                    "input": [{
                        "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                        "vertex": 293020

                    }]
                }, {
                    "class": "uk.gov.gchq.gaffer.operation.impl.Map",
                    "functions": [{
                        "class": "uk.gov.gchq.koryphe.impl.function.IterableFunction",
                        "functions": [{
                            "class": "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop",
                            "hop": 1
                        }, {
                            "class": "uk.gov.gchq.koryphe.impl.function.FirstItem"
                        }]
                    }]
                }, {
                    "class": "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
                    "useMatchedVertex": "EQUAL",
                    "edgeVertices": "SOURCE"
                }, {
                    "class": "uk.gov.gchq.gaffer.operation.impl.output.ToSet"
                }]
            }
            ''',
            g.OperationChain(
                operations=[
                    g.GetWalks(
                        results_limit=10000,
                        input=[
                            g.EntitySeed(
                                vertex=293020
                            )
                        ],
                        operations=[
                            g.GetElements(
                                view=g.View(
                                    edges=[
                                        g.ElementDefinition(
                                            group="JunctionLocatedAt"
                                        )
                                    ],
                                    entities=[]
                                )
                            ),
                            g.GetElements(
                                view=g.View(
                                    edges=[
                                        g.ElementDefinition(
                                            group="RoadUse"
                                        )
                                    ],
                                    entities=[]
                                )
                            )
                        ]
                    ),
                    g.Map(
                        functions=[
                            g.IterableFunction(
                                functions=[
                                    g.ExtractWalkEdgesFromHop(
                                        hop=1),
                                    g.FirstItem()
                                ]
                            )
                        ]
                    ),
                    g.ToVertices(
                        use_matched_vertex="EQUAL",
                        edge_vertices="SOURCE"
                    ),
                    g.ToSet()
                ]
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.SplitStoreFromFile",
                "inputPath": "path/to/file"
            }
            ''',
            g.SplitStoreFromFile(
                input_path="path/to/file"
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.SplitStoreFromIterable",
                "input": [
                    "1", "2", "3"
                ]
            }
            ''',
            g.SplitStoreFromIterable(
                input=[
                    "1", "2", "3"
                ]
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.SampleElementsForSplitPoints",
                "input" : [ {
                    "group" : "entity",
                    "vertex" : 6,
                    "properties" : {
                      "count" : 1
                    },
                    "class" : "uk.gov.gchq.gaffer.data.element.Entity"
                  }, {
                    "group" : "edge",
                    "source" : 5,
                    "destination" : 6,
                    "directed" : true,
                    "properties" : {
                      "count" : 1
                    },
                    "class" : "uk.gov.gchq.gaffer.data.element.Edge"
                  } ],
                "numSplits": 5,
                "proportionToSample": 0.1
            }
            ''',
            g.SampleElementsForSplitPoints(
                input=[
                    g.Entity(
                        vertex=6,
                        properties={'count': 1},
                        group="entity"
                    ),
                    g.Edge(
                        destination=6,
                        source=5,
                        group="edge",
                        properties={'count': 1},
                        directed=True
                    )
                ],
                num_splits=5,
                proportion_to_sample=0.1
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.If",
                "input" : [{
                    "class" : "uk.gov.gchq.gaffer.data.element.Entity",
                    "group" : "entity",
                    "vertex" : "a1",
                    "properties" : {
                        "count" : 5
                    }
                }],
                "conditional" : {
                    "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "value" : 3,
                        "orEqualTo" : true 
                    },
                    "transform" : {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.Map",
                        "functions" : [
                            {
                                "class" : "uk.gov.gchq.gaffer.data.element.function.ExtractProperty",
                                "name" : "count"
                            }
                        ]
                    }
                },
                "then" : {
                    "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds"
                },
                "otherwise" : {
                    "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
                }
            }
            ''',
            g.If(
                input=g.Entity(
                    group='entity',
                    vertex='a1',
                    properties={
                        'count': 5
                    }
                ),
                conditional=g.Conditional(
                    predicate=g.IsMoreThan(
                        value=3,
                        or_equal_to=True
                    ),
                    transform=g.Map(
                        functions=[
                            g.ExtractProperty(
                                name='count'
                            )
                        ]
                    )
                ),
                then=g.GetAdjacentIds(),
                otherwise=g.GetAllElements()
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.view.AddNamedView",
              "name" : "testNamedView",
              "description" : "example test NamedView",
              "view" : {
                "edges" : {
                  "testEdge" : { }
                }
              },
              "overwriteFlag" : true,
              "writeAccessRoles" : [ "auth1", "auth2" ]
            }
            ''',
            g.AddNamedView(
                name='testNamedView',
                description='example test NamedView',
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='testEdge'
                        )]
                ),
                overwrite_flag=True,
                write_access_roles=['auth1', 'auth2']
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.named.view.AddNamedView",
              "view" : {
                "edges" : {
                  "testEdge" : {
                    "preAggregationFilterFunctions" : [ {
                      "selection" : [ "count" ],
                      "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "value" : "${countThreshold}"
                      }
                    } ]
                  }
                }
              },
              "name" : "isMoreThan",
              "description" : "is more than",
              "parameters" : {
                "countThreshold" : {
                  "valueClass" : "Long",
                  "required" : false,
                  "description" : "count threshold",
                  "defaultValue" : 1
                }
              },
              "overwriteFlag" : true,
              "writeAccessRoles" : [ "auth1", "auth2" ]
            }
            ''',
            g.AddNamedView(
                name='isMoreThan',
                description='is more than',
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='testEdge',
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection='count',
                                    predicate=g.IsMoreThan(
                                        value="${countThreshold}"
                                    )
                                )
                            ]
                        )]
                ),
                parameters=[
                    g.NamedViewParameter(
                        name="countThreshold",
                        description="count threshold",
                        default_value=1,
                        value_class="Long",
                        required=False
                    )
                ],
                overwrite_flag=True,
                write_access_roles=['auth1', 'auth2']
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.federatedstore.operation.RemoveGraph",
              "graphId" : "graph1"
            }
            ''',
            g.RemoveGraph(
                graph_id="graph1"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.federatedstore.operation.GetAllGraphIds"
            }
            ''',
            g.GetAllGraphIds()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.federatedstore.operation.AddGraph",
              "graphId" : "graph1",
              "isPublic" : false,
              "schema" : {
                "edges" : {
                  "RoadHasJunction" : {
                    "description" : "A directed edge from each road to all the junctions on that road.",
                    "source" : "road",
                    "destination" : "junction",
                    "directed" : "true",
                    "properties" : { },
                    "groupBy" : [ ]
                  }
                },
                "types" : {
                  "junction" : {
                    "description" : "A road junction represented by a String.",
                    "class" : "String"
                  },
                  "road" : {
                    "description" : "A road represented by a String.",
                    "class" : "String"
                  }
                }
              },
              "storeProperties" : {
                "gaffer.store.class" : "uk.gov.gchq.gaffer.mapstore.SingleUseMapStore",
                "gaffer.cache.service.class" : "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService"
              }
            }
            ''',
            g.AddGraph(
                graph_id="graph1",
                is_public=False,
                schema={
                    "edges": {
                        "RoadHasJunction": {
                            "description": "A directed edge from each road to all the junctions on that road.",
                            "source": "road",
                            "destination": "junction",
                            "directed": "true",
                            "properties": {},
                            "groupBy": []
                        }
                    },
                    "types": {
                        "junction": {
                            "description": "A road junction represented by a String.",
                            "class": "String"
                        },
                        "road": {
                            "description": "A road represented by a String.",
                            "class": "String"
                        }
                    }
                },
                store_properties={
                    "gaffer.store.class": "uk.gov.gchq.gaffer.mapstore.SingleUseMapStore",
                    "gaffer.cache.service.class": "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService"
                }
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.federatedstore.operation.AddGraphWithHooks",
              "graphId" : "graph1",
              "isPublic" : false,
              "schema" : {
                "edges" : {
                  "RoadHasJunction" : {
                    "description" : "A directed edge from each road to all the junctions on that road.",
                    "source" : "road",
                    "destination" : "junction",
                    "directed" : "true",
                    "properties" : { },
                    "groupBy" : [ ]
                  }
                },
                "types" : {
                  "junction" : {
                    "description" : "A road junction represented by a String.",
                    "class" : "String"
                  },
                  "road" : {
                    "description" : "A road represented by a String.",
                    "class" : "String"
                  }
                }
              },
              "storeProperties" : {
                "gaffer.store.class" : "uk.gov.gchq.gaffer.mapstore.SingleUseMapStore",
                "gaffer.cache.service.class" : "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService"
              },
              "hooks": [
                {
                    "class": "uk.gov.gchq.gaffer.graph.hook.Log4jLogger"
                }
              ]
            }
            ''',
            g.AddGraphWithHooks(
                graph_id="graph1",
                is_public=False,
                schema={
                    "edges": {
                        "RoadHasJunction": {
                            "description": "A directed edge from each road to all the junctions on that road.",
                            "source": "road",
                            "destination": "junction",
                            "directed": "true",
                            "properties": {},
                            "groupBy": []
                        }
                    },
                    "types": {
                        "junction": {
                            "description": "A road junction represented by a String.",
                            "class": "String"
                        },
                        "road": {
                            "description": "A road represented by a String.",
                            "class": "String"
                        }
                    }
                },
                store_properties={
                    "gaffer.store.class": "uk.gov.gchq.gaffer.mapstore.SingleUseMapStore",
                    "gaffer.cache.service.class": "uk.gov.gchq.gaffer.cache.impl.HashMapCacheService"
                },
                hooks=[{
                    "class": "uk.gov.gchq.gaffer.graph.hook.Log4jLogger"
                }]
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.While",
                "maxRepeats" : 5,
                "input" : [
                    {
                        "class" : "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                        "vertex" : 2
                    }
                ],
                "condition" : true,
                "operation" : {
                    "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds"
                }
            }
            ''',
            g.While(
                max_repeats=5,
                input=[
                    g.EntitySeed(
                        vertex=2
                    )
                ],
                condition=True,
                operation=g.GetAdjacentIds()
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.While",
                "maxRepeats" : 10,
                "input" : [{
                    "class" : "uk.gov.gchq.gaffer.data.element.Edge",
                    "group" : "testEdge",
                    "source" : "src",
                    "destination" : "dest",
                    "directed" : true,
                    "properties" : {
                        "count" : 3
                    }
                }],
                "conditional" : {
                    "predicate" : {
                        "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "value" : 2
                    },
                    "transform" : {
                        "class" : "uk.gov.gchq.gaffer.operation.impl.Map",
                        "functions" : [{
                                "class" : "uk.gov.gchq.gaffer.data.element.function.ExtractProperty",
                                "name" : "count"
                            }
                        ]
                    }
                },
                "operation" : {"class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"}
            }
            ''',
            g.While(
                max_repeats=10,
                input=[
                    g.Edge(
                        group="testEdge",
                        source="src",
                        destination="dest",
                        directed=True,
                        properties={
                            "count": 3
                        }
                    )
                ],
                conditional=g.Conditional(
                    predicate=g.IsMoreThan(
                        value=2
                    ),
                    transform=g.Map(
                        functions=[
                            g.ExtractProperty(
                                name="count"
                            )
                        ]
                    )
                ),
                operation=g.GetElements()
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.store.operation.GetTraits",
                "currentTraits" : true
            }
            ''',
            g.GetTraits(
                current_traits=True
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.Reduce",
                "input" : [{
                    "class" : "uk.gov.gchq.gaffer.data.element.Edge",
                    "group" : "testEdge",
                    "source" : "src",
                    "destination" : "dest",
                    "directed" : true,
                    "properties" : {
                        "count" : 3
                    }
                }],
                "aggregateFunction": {
                    "class": "uk.gov.gchq.koryphe.impl.binaryoperator.Max"
                },
                "identity": 10
            }
            ''',
            g.Reduce(
                input=[
                    g.Edge(
                        group="testEdge",
                        source="src",
                        destination="dest",
                        directed=True,
                        properties={
                            "count": 3
                        }
                    )
                ],
                aggregate_function=g.BinaryOperator(
                    class_name="uk.gov.gchq.koryphe.impl.binaryoperator.Max"
                ),
                identity=10

            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.ForEach",
                "input" : [{
                    "class" : "uk.gov.gchq.gaffer.data.element.Edge",
                    "group" : "testEdge",
                    "source" : "src",
                    "destination" : "dest",
                    "directed" : true,
                    "properties" : {
                        "count" : 3
                    }
                }],
                "operation": {"class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"}
            }
            ''',
            g.ForEach(
                input=[
                    g.Edge(
                        group="testEdge",
                        source="src",
                        destination="dest",
                        directed=True,
                        properties={
                            "count": 3
                        }
                    )
                ],
                operation=g.GetElements()
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList",
                "input" : [{
                    "class" : "uk.gov.gchq.gaffer.data.element.Edge",
                    "group" : "testEdge",
                    "source" : "src",
                    "destination" : "dest",
                    "directed" : true,
                    "properties" : {
                        "count" : 3
                    }
                }]
            }
            ''',
            g.ToSingletonList(
                input=[
                    g.Edge(
                        group="testEdge",
                        source="src",
                        destination="dest",
                        directed=True,
                        properties={
                            "count": 3
                        }
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain",
              "operationChain" : {
                "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElements"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                } ]
              },
              "options" : {
                "key" : "value"
              }
            }
            ''',
            g.ValidateOperationChain(
                operation_chain=g.OperationChain(
                    operations=[
                        g.AddElements(),
                        g.GetElements()
                    ]
                ),
                options={
                    "key": "value"
                }
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain",
              "operationChain" : {
                "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElements"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                } ]
              },
              "options" : {
                "key" : "value"
              }
            }
            ''',
            g.ValidateOperationChain(
                operation_chain={
                    "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations": [{
                        "class": "uk.gov.gchq.gaffer.operation.impl.add.AddElements"
                    }, {
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                    }]
                },
                options={
                    "key": "value"
                }
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.SetVariable",
                "input" : "testVal",
                "variableName" : "testVarName",
                "options" : {
                    "key" : "value"
                }
            }
            ''',
            g.SetVariable(
                input="testVal",
                variable_name="testVarName",
                options={
                    "key": "value"
                }
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.GetVariable",
                "variableName" : "testVarName",
                "options" : {
                    "key" : "value"
                }
            }
            ''',
            g.GetVariable(
                variable_name="testVarName",
                options={
                    "key": "value"
                }
            )
        ],
        [
          '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.impl.GetVariables",
                "variableNames" : ["testVarName", "testVarName2"],
                "options" : {
                    "key" : "value"
                }
            }
            ''',
            g.GetVariables(
                variable_names=["testVarName", "testVarName2"],
                options={
                    "key": "value"
                }
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.join.Join",
                "input": [ "test2" ],
                "operation": {
                    "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                    "input": [
                        {
                            "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                            "vertex": "test"
                        }
                    ]
                },
                "matchMethod": {
                    "class": "uk.gov.gchq.gaffer.store.operation.handler.join.match.ElementMatch"
                },
                "flatten": false,
                "joinType": "INNER",
                "collectionLimit": 10
            }
            ''',
            g.Join(
                input=['test2'], 
                operation=g.GetElements(input=[g.EntitySeed('test')]), 
                match_method=g.ElementMatch(),
                flatten=False,
                join_type=g.JoinType.INNER,
                collection_limit=10)
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.federatedstore.operation.FederatedOperationChain",
              "operationChain" : {
                "class" : "uk.gov.gchq.gaffer.operation.OperationChain",
                "operations" : [ {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.add.AddElements"
                }, {
                  "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                } ]
              },
              "options" : {
                "key" : "value"
              }
            }
            ''',
            g.FederatedOperationChain(
                operation_chain={
                    "class": "uk.gov.gchq.gaffer.operation.OperationChain",
                    "operations": [{
                        "class": "uk.gov.gchq.gaffer.operation.impl.add.AddElements"
                    }, {
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"
                    }]
                },
                options={
                    "key": "value"
                }
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.join.Join",
                "input": [ "test2" ],
                "operation": {
                    "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                    "input": [
                        {
                            "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                            "vertex": "test"
                        }
                    ]
                },
                "matchMethod": {
                    "class": "uk.gov.gchq.gaffer.store.operation.handler.join.match.KeyFunctionMatch",
                    "firstKeyFunction": {
                        "class": "uk.gov.gchq.gaffer.data.element.function.ExtractId",
                        "id": "DESTINATION"
                    }
                },
                "matchKey": "RIGHT",
                "flatten": false,
                "joinType": "OUTER"
            }
            ''',
            g.Join(
                input=['test2'], 
                operation=g.GetElements(input=[g.EntitySeed('test')]), 
                match_method=g.KeyFunctionMatch(first_key_function=g.ExtractId("DESTINATION")),
                match_key=g.MatchKey.RIGHT,
                flatten=False,
                join_type=g.JoinType.OUTER)
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.operation.impl.job.CancelScheduledJob",
                "jobId": "238492-2ad-fadf034-324-2a"
            }
            ''',
            g.CancelScheduledJob(job_id="238492-2ad-fadf034-324-2a")
        ]
    ]

    def test_operations(self):
        self.maxDiff = None
        for example in self.examples:
            self.assertEqual(
                json.loads(example[0]),
                example[1].to_json(),
                "json failed: \n" + example[0] + "\n" + example[
                    1].to_json_pretty_str()
            )

            g.JsonConverter.from_json(example[0], validate=True)

    def test_get_elements_should_handle_single_inputs(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'input': [
                    {
                        'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                        'vertex': 'value'
                    }
                ]
            },
            g.GetElements(input="value").to_json())


if __name__ == "__main__":
    unittest.main()
