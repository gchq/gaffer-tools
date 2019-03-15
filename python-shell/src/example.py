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

from gafferpy import gaffer as g
from gafferpy import gaffer_connector


def run(host, verbose=False):
    return run_with_connector(create_connector(host, verbose))


def run_with_connector(gc):
    print()
    print('Running operations')
    print('--------------------------')
    print()

    get_schema(gc)
    get_filter_functions(gc)
    get_class_filter_functions(gc)
    get_element_generators(gc)
    get_object_generators(gc)
    get_operations(gc)
    get_serialised_fields(gc)
    get_store_traits(gc)

    is_operation_supported(gc)

    add_elements(gc)
    get_elements(gc)
    get_adj_seeds(gc)
    get_all_elements(gc)
    get_walks(gc)
    generate_elements(gc)
    generate_domain_objs(gc)
    generate_domain_objects_chain(gc)
    get_element_group_counts(gc)
    get_sub_graph(gc)
    export_to_gaffer_result_cache(gc)
    get_job_details(gc)
    get_all_job_details(gc)

    add_named_operation(gc)
    get_all_named_operations(gc)
    named_operation(gc)
    delete_named_operation(gc)

    add_named_view_summarise(gc)
    add_named_view_date_range(gc)
    get_all_named_views(gc)
    named_view_summarise(gc)
    named_view_date_range(gc)
    named_views(gc)
    delete_named_views(gc)

    sort_elements(gc)
    max_element(gc)
    min_element(gc)
    to_vertices_to_entity_seeds(gc)

    complex_op_chain(gc)

    op_chain_in_json(gc)


def create_connector(host, verbose=False):
    return gaffer_connector.GafferConnector(host, verbose)


def get_schema(gc):
    # Get Schema
    result = gc.execute_get(
        g.GetSchema()
    )

    print('Schema:')
    print(result)
    print()


def get_filter_functions(gc):
    # Get filter functions
    result = gc.execute_get(
        g.GetFilterFunctions()
    )

    print('Filter Functions:')
    print(result)
    print()


def get_class_filter_functions(gc):
    # Get class filter functions
    class_name = 'uk.gov.gchq.koryphe.impl.predicate.IsMoreThan'
    result = gc.execute_get(
        g.GetClassFilterFunctions(class_name=class_name)
    )

    print('Class Filter Functions (IsMoreThan):')
    print(result)
    print()


def get_element_generators(gc):
    # Get Element generators
    result = gc.execute_get(
        g.GetElementGenerators()
    )

    print('Element generators:')
    print(result)
    print()


def get_object_generators(gc):
    # Get Object generators
    result = gc.execute_get(
        g.GetObjectGenerators()
    )

    print('Object generators:')
    print(result)
    print()


def get_operations(gc):
    # Get operations
    result = gc.execute_get(
        g.GetOperations()
    )

    print('Operations:')
    print(result)
    print()


def get_serialised_fields(gc):
    # Get serialised fields
    class_name = 'uk.gov.gchq.koryphe.impl.predicate.IsMoreThan'
    result = gc.execute_get(
        g.GetSerialisedFields(class_name=class_name)
    )

    print('Serialised Fields (IsMoreThan):')
    print(result)
    print()


def get_store_traits(gc):
    # Get Store Traits
    result = gc.execute_get(
        g.GetStoreTraits()
    )

    print('Store Traits:')
    print(result)
    print()


def is_operation_supported(gc):
    # Is operation supported
    operation = 'uk.gov.gchq.gaffer.operation.impl.add.AddElements'
    result = gc.is_operation_supported(
        g.IsOperationSupported(operation=operation)
    )

    print(
        '\nOperation supported ("uk.gov.gchq.gaffer.operation.impl.add.AddElements"):')
    print(result)
    print()


def add_elements(gc):
    # Add Elements
    gc.execute_operation(
        g.AddElements(
            input=[
                g.Entity(
                    group='JunctionUse',
                    vertex='M1:1',
                    properties={
                        'countByVehicleType': g.freq_map({
                            'BUS': 10,
                            'CAR': 50
                        }),
                        'endDate': g.date(1034319600000),
                        'count': g.long(60),
                        'startDate': g.date(1034316000000)
                    }
                ),
                g.Edge(
                    group='RoadHasJunction',
                    source='M1',
                    destination='M1:1',
                    directed=True,
                    properties={}
                )
            ]
        )
    )
    print('Elements have been added')
    print()


def get_elements(gc):
    # Get Elements
    input = gc.execute_operation(
        g.GetElements(
            input=[
                g.EntitySeed('M5:10'),

                # Edge input can be provided as follows
                g.EdgeSeed('M5:10', 'M5:11', g.DirectedType.EITHER),
                g.EdgeSeed('M5:10', 'M5:11', g.DirectedType.DIRECTED),
                # Or you can use True or False for the direction
                g.EdgeSeed('M5:10', 'M5:11', True)
            ],
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[],
                        transient_properties=[
                            g.Property('description', 'java.lang.String')
                        ],
                        pre_aggregation_filter_functions=[
                            g.PredicateContext(
                                selection=['count'],
                                predicate=g.IsMoreThan(
                                    value=g.long(1)
                                )
                            )
                        ],
                        transform_functions=[
                            g.FunctionContext(
                                selection=['SOURCE', 'DESTINATION', 'count'],
                                function=g.Function(
                                    class_name='uk.gov.gchq.gaffer.traffic.transform.DescriptionTransform'
                                ),
                                projection=['description']
                            )
                        ]
                    )
                ]
            ),
            directed_type=g.DirectedType.EITHER
        )
    )
    print('Related input')
    print(input)
    print()


def get_adj_seeds(gc):
    # Adjacent Elements - chain 2 adjacent entities together
    adj_seeds = gc.execute_operations(
        [
            g.GetAdjacentIds(
                input=[
                    g.EntitySeed(
                        vertex='M5'
                    )
                ],
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            'RoadHasJunction',
                            group_by=[]
                        )
                    ]
                ),
                include_incoming_out_going=g.InOutType.OUT
            ),
            g.GetAdjacentIds(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            'RoadUse',
                            group_by=[]
                        )
                    ]
                ),
                include_incoming_out_going=g.InOutType.OUT
            )
        ]
    )
    print('Adjacent entities - 2 hop')
    print(adj_seeds)
    print()


def get_all_elements(gc):
    # Get all input, but limit the total results to 3
    all_elements = gc.execute_operations(
        operations=[
            g.GetAllElements(),
            g.Limit(result_limit=3)
        ]
    )
    print('All input (Limited to first 3)')
    print(all_elements)
    print()


def get_walks(gc):
    # Get walks from M32 traversing down RoadHasJunction then JunctionLocatedAt
    walks = gc.execute_operation(
        g.GetWalks(
            input=[
                g.EntitySeed('M32'),
            ],
            operations=[
                g.GetElements(
                    view=g.View(
                        edges=[
                            g.ElementDefinition(
                                group='RoadHasJunction'
                            )
                        ]
                    )
                ),
                g.GetElements(
                    view=g.View(
                        edges=[
                            g.ElementDefinition(
                                group='JunctionLocatedAt'
                            )
                        ]
                    )
                )
            ]
        )
    )
    print(
        'Walks from M32 traversing down RoadHasJunction then JunctionLocatedAt')
    print(walks)
    print()


def generate_elements(gc):
    # Generate Elements
    input = gc.execute_operation(
        g.GenerateElements(
            element_generator=g.ElementGenerator(
                class_name='uk.gov.gchq.gaffer.traffic.generator.RoadTrafficStringElementGenerator'
            ),
            input=[
                '"South West","E06000054","Wiltshire","6016","389200","179080","M4","LA Boundary","381800","180030","17","391646","179560","TM","E","2000","2000-05-03 00:00:00","7","0","9","2243","15","426","127","21","20","37","106","56","367","3060"'
            ]
        )
    )
    print('Generated input from provided domain input')
    print(input)
    print()


def generate_domain_objs(gc):
    # Generate Domain Objects - single provided element
    input = gc.execute_operation(
        g.GenerateObjects(
            element_generator=g.ElementGenerator(
                class_name='uk.gov.gchq.gaffer.rest.example.ExampleDomainObjectGenerator'
            ),
            input=[
                g.Entity('entity', '1'),
                g.Edge('edge', '1', '2', True)
            ]
        )
    )
    print('Generated input from provided input')
    print(input)
    print()


def generate_domain_objects_chain(gc):
    # Generate Domain Objects - chain of get input then generate input
    input = gc.execute_operations(
        [
            g.GetElements(
                input=[g.EntitySeed(vertex='M5')],
                seed_matching_type=g.SeedMatchingType.RELATED,
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='RoadHasJunction',
                            group_by=[]
                        )
                    ]
                )
            ),

            g.GenerateObjects(
                element_generator=g.ElementGenerator(
                    class_name='uk.gov.gchq.gaffer.rest.example.ExampleDomainObjectGenerator'
                )
            )
        ]
    )
    print('Generated input from get input by seed')
    print(input)
    print()


def get_element_group_counts(gc):
    # Get Elements
    group_counts = gc.execute_operations([
        g.GetElements(
            input=[g.EntitySeed('M5')]
        ),
        g.CountGroups(limit=1000)
    ])
    print('Groups counts (limited to 1000 input)')
    print(group_counts)
    print()


def get_sub_graph(gc):
    # Export and Get to/from an in memory set
    entity_seeds = gc.execute_operations(
        [
            g.GetAdjacentIds(
                input=[g.EntitySeed('South West')],
                include_incoming_out_going=g.InOutType.OUT
            ),
            g.ExportToSet(),
            g.GetAdjacentIds(include_incoming_out_going=g.InOutType.OUT),
            g.ExportToSet(),
            g.DiscardOutput(),
            g.GetSetExport()
        ]
    )
    print('Export and Get to/from an in memory set')
    print(entity_seeds)
    print()


def export_to_gaffer_result_cache(gc):
    # Export to Gaffer Result Cache and Get from Gaffer Result Cache
    job_details = gc.execute_operations(
        [
            g.GetAdjacentIds(
                input=[g.EntitySeed('South West')],
                include_incoming_out_going=g.InOutType.OUT
            ),
            g.ExportToGafferResultCache(),
            g.DiscardOutput(),
            g.GetJobDetails()
        ]
    )
    print('Export to Gaffer Result Cache. Job Details:')
    print(job_details)
    print()

    job_id = job_details['jobId']
    entity_seeds = gc.execute_operation(
        g.GetGafferResultCacheExport(job_id=job_id),
    )
    print('Get Gaffer Result Cache Export.')
    print(entity_seeds)
    print()


def get_job_details(gc):
    # Get all job details
    job_details_initial = gc.execute_operations(
        [
            g.GetAdjacentIds(
                input=[g.EntitySeed('1')],
            ),
            g.ExportToGafferResultCache(),
            g.DiscardOutput(),
            g.GetJobDetails()
        ]
    )

    job_id = job_details_initial['jobId']

    job_details = gc.execute_operation(
        g.GetJobDetails(job_id=job_id),
    )
    print('Get job details')
    print(job_details)
    print()


def get_all_job_details(gc):
    # Get all job details
    all_job_details = gc.execute_operation(
        g.GetAllJobDetails(),
    )
    print('Get all job details (just prints the first 3 results)')
    print(all_job_details[:3])
    print()


def delete_named_operation(gc):
    gc.execute_operation(
        g.DeleteNamedOperation('2-hop-with-limit')
    )
    print('Deleted named operation: 2-hop-with-limit')
    print()


def add_named_operation(gc):
    gc.execute_operation(
        g.AddNamedOperation(
            operation_chain={
                "operations": [{
                    "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                    "includeIncomingOutGoing": "OUTGOING"
                }, {
                    "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
                    "includeIncomingOutGoing": "OUTGOING"
                }, {
                    "class": "uk.gov.gchq.gaffer.operation.impl.Limit",
                    "resultLimit": "${param1}"
                }]
            },
            operation_name='2-hop-with-limit',
            description='2 hop query with limit',
            overwrite_flag=True,
            read_access_roles=["read-user"],
            write_access_roles=["write-user"],
            parameters=[
                g.NamedOperationParameter(
                    name="param1",
                    description="Limit param",
                    default_value=1,
                    value_class="java.lang.Long",
                    required=False
                )
            ]
        )
    )

    print('Added named operation: 2-hop-with-limit')
    print()


def get_all_named_operations(gc):
    namedOperations = gc.execute_operation(
        g.GetAllNamedOperations()
    )
    print('Named operations')
    print(namedOperations)
    print()


def named_operation(gc):
    result = gc.execute_operation(
        g.NamedOperation(
            operation_name='2-hop-with-limit',
            parameters={
                'param1': 2
            },
            input=[
                g.EntitySeed('M5')
            ]
        )
    )
    print('Execute named operation')
    print(result)
    print()


def delete_named_views(gc):
    gc.execute_operation(
        g.DeleteNamedView(name='summarise')
    )
    print('Deleted named view: summarise')
    gc.execute_operation(
        g.DeleteNamedView(name='dateRange')
    )
    print('Deleted named view: dateRange')
    print()


def add_named_view_summarise(gc):
    gc.execute_operation(
        g.AddNamedView(
            view=g.View(
                global_elements=[
                    g.GlobalElementDefinition(group_by=[])
                ]
            ),
            name='summarise',
            description='Summarises all results (overrides the groupBy to an empty array).',
            overwrite_flag=True
        )
    )

    print('Added named view: summarise')
    print()


def add_named_view_date_range(gc):
    gc.execute_operation(
        g.AddNamedView(
            view=g.View(
                global_elements=g.GlobalElementDefinition(
                    pre_aggregation_filter_functions=[
                        g.PredicateContext(
                            selection=['startDate'],
                            predicate=g.InDateRange(
                                start='${start}',
                                end='${end}'
                            )
                        )
                    ]
                )
            ),
            name='dateRange',
            description='Filters results to a provided date range.',
            overwrite_flag=True,
            parameters=[
                g.NamedViewParameter(
                    name="start",
                    description="A date string for the start of date range.",
                    value_class="java.lang.String",
                    required=False
                ),
                g.NamedViewParameter(
                    name="end",
                    description="A date string for the end of the date range.",
                    value_class="java.lang.String",
                    required=False
                )
            ]
        )
    )

    print('Added named view: dateRange')
    print()


def get_all_named_views(gc):
    namedViews = gc.execute_operation(
        g.GetAllNamedViews()
    )
    print('Named views')
    print(namedViews)
    print()


def named_view_summarise(gc):
    result = gc.execute_operation(
        g.GetElements(
            input=[
                g.EntitySeed(
                    vertex='M32:1'
                )
            ],
            view=g.NamedView(
                name="summarise"
            )
        )
    )
    print('Execute get elements with summarised named view')
    print(result)
    print()


def named_view_date_range(gc):
    result = gc.execute_operation(
        g.GetElements(
            input=[
                g.EntitySeed(
                    vertex='M32:1'
                )
            ],
            view=g.NamedView(
                name="dateRange",
                parameters={
                    'start': '2005/05/03 06:00',
                    'end': '2005/05/03 09:00'
                }
            )
        )
    )
    print('Execute get elements with date range named view')
    print(result)
    print()


def named_views(gc):
    result = gc.execute_operation(
        g.GetElements(
            input=[
                g.EntitySeed(
                    vertex='M32:1'
                )
            ],
            view=[
                g.NamedView(
                    name="summarise"
                ),
                g.NamedView(
                    name="dateRange",
                    parameters={
                        'start': '2005/05/03 06:00',
                        'end': '2005/05/03 09:00'
                    }
                )
            ]
        )
    )
    print('Execute get elements with summarised and date range named views')
    print(result)
    print()


def sort_elements(gc):
    # Get sorted Elements
    input = gc.execute_operations([
        g.GetAllElements(
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    )
                ]
            )
        ),
        g.Sort(
            comparators=[
                g.ElementPropertyComparator(
                    groups=['RoadUse'],
                    property='count'
                )
            ],
            result_limit=5
        )
    ])
    print('Sorted input')
    print(input)
    print()


def max_element(gc):
    # Get sorted Elements
    input = gc.execute_operations([
        g.GetAllElements(
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    )
                ]
            )
        ),
        g.Max(
            comparators=[
                g.ElementPropertyComparator(
                    groups=['RoadUse'],
                    property='count'
                )
            ]
        )
    ])
    print('Max element')
    print(input)
    print()


def min_element(gc):
    # Get sorted Elements
    input = gc.execute_operations([
        g.GetAllElements(
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    )
                ]
            )
        ),
        g.Min(
            comparators=[
                g.ElementPropertyComparator(
                    groups=['RoadUse'],
                    property='count'
                )
            ]
        )
    ])
    print('Min element')
    print(input)
    print()


def to_vertices_to_entity_seeds(gc):
    # Get sorted Elements
    input = gc.execute_operations([
        g.GetElements(
            input=[
                g.EntitySeed(
                    vertex='South West'
                )
            ],
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        'RegionContainsLocation',
                        group_by=[]
                    )
                ]
            ),
            include_incoming_out_going=g.InOutType.OUT
        ),
        g.ToVertices(
            edge_vertices=g.EdgeVertices.DESTINATION,
            use_matched_vertex=g.UseMatchedVertex.OPPOSITE
        ),
        g.ToEntitySeeds(),
        g.GetElements(
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        'LocationContainsRoad',
                        group_by=[]
                    )
                ]
            ),
            include_incoming_out_going=g.InOutType.OUT
        ),
        g.Limit(5)
    ])
    print('ToVertices then ToEntitySeeds')
    print(input)
    print()


def complex_op_chain(gc):
    # All road junctions in the South West that were heavily used by buses in year 2000.
    junctions = gc.execute_operations(
        operations=[
            g.GetAdjacentIds(
                input=[g.EntitySeed(vertex='South West')],
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='RegionContainsLocation',
                            group_by=[]
                        )
                    ]
                )
            ),
            g.GetAdjacentIds(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='LocationContainsRoad',
                            group_by=[]
                        )
                    ]
                )
            ),
            g.ToSet(),
            g.GetAdjacentIds(
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='RoadHasJunction',
                            group_by=[]
                        )
                    ]
                )
            ),
            g.GetElements(
                view=g.View(
                    entities=[
                        g.ElementDefinition(
                            group='JunctionUse',
                            group_by=[],
                            transient_properties=[
                                g.Property('busCount', 'java.lang.Long')
                            ],
                            pre_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=['startDate'],
                                    predicate=g.InDateRange(
                                        start='2000/01/01',
                                        end='2001/01/01'
                                    )
                                )
                            ],
                            post_aggregation_filter_functions=[
                                g.PredicateContext(
                                    selection=['countByVehicleType'],
                                    predicate=g.PredicateMap(
                                        predicate=g.IsMoreThan(
                                            value={'java.lang.Long': 1000},
                                            or_equal_to=False
                                        ),
                                        key='BUS'
                                    )
                                )
                            ],
                            transform_functions=[
                                g.FunctionContext(
                                    selection=['countByVehicleType'],
                                    function=g.FreqMapExtractor(key='BUS'),
                                    projection=['busCount']
                                )
                            ]
                        )
                    ]
                ),
                include_incoming_out_going=g.InOutType.OUT
            ),
            g.ToCsv(
                element_generator=g.CsvGenerator(
                    fields={
                        'VERTEX': 'Junction',
                        'busCount': 'Bus Count'
                    },
                    quoted=False
                ),
                include_header=True
            )
        ]
    )
    print(
        'All road junctions in the South West that were heavily used by buses in year 2000.')
    print(junctions)
    print()


def op_chain_in_json(gc):
    # Operation chain defined in json
    result = gc.execute_operation_chain(
        {
            "class": "uk.gov.gchq.gaffer.operation.OperationChain",
            "operations": [{
                "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
            }, {
                "class": "uk.gov.gchq.gaffer.operation.impl.CountGroups"
            }]
        }
    )
    print('Operation chain defined in json')
    print(result)
    print()


if __name__ == "__main__":
    run('http://localhost:8080/rest/latest', False)
