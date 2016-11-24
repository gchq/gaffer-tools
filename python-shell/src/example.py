#
# Copyright 2016 Crown Copyright
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
    get_generators(gc)
    get_operations(gc)
    get_serialised_fields(gc)
    get_store_traits(gc)

    is_operation_supported(gc)

    add_elements(gc)
    get_elements(gc)
    get_adj_seeds(gc)
    get_all_elements(gc)
    generate_elements(gc)
    generate_domain_objs(gc)
    generate_domain_objects_chain(gc)
    get_element_group_counts(gc)
    get_sub_graph(gc)


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
    # Get Schema
    result = gc.execute_get(
        g.GetFilterFunctions()
    )

    print('Filter Functions:')
    print(result)
    print()


def get_class_filter_functions(gc):
    # Get Schema
    class_name = 'gafferpy.function.simple.filter.IsMoreThan'
    result = gc.execute_get(
        g.GetClassFilterFunctions(class_name=class_name)
    )

    print('Class Filter Functions (gafferpy.function.simple.filter.IsMoreThan):')
    print(result)
    print()


def get_generators(gc):
    # Get Schema
    result = gc.execute_get(
        g.GetGenerators()
    )

    print('Generators:')
    print(result)
    print()


def get_operations(gc):
    # Get Schema
    result = gc.execute_get(
        g.GetOperations()
    )

    print('Operations:')
    print(result)
    print()


def get_serialised_fields(gc):
    # Get Schema
    class_name = 'gafferpy.function.simple.filter.IsMoreThan'
    result = gc.execute_get(
        g.GetSerialisedFields(class_name=class_name)
    )

    print('Serialised Fields (gafferpy.function.simple.filter.IsMoreThan):')
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
    operation = 'gafferpy.operation.impl.add.AddElements'
    result = gc.is_operation_supported(
        g.IsOperationSupported(operation=operation)
    )

    print('\nOperation supported ("gafferpy.operation.impl.add.AddElements"):')
    print(result)
    print()


def add_elements(gc):
    # Add Elements
    gc.execute_operation(
        g.AddElements(
            elements=[
                g.Entity(
                    group='entity',
                    vertex='1',
                    properties={
                        'count': 1
                    }
                ),
                g.Entity(
                    group='entity',
                    vertex='2',
                    properties={
                        'count': 1
                    }
                ),
                g.Entity(
                    group='entity',
                    vertex='3',
                    properties={
                        'count': 1
                    }
                ),
                g.Edge(
                    group='edge',
                    source='1',
                    destination='2',
                    directed=True,
                    properties={
                        'count': 1
                    }
                ),
                g.Edge(
                    group='edge',
                    source='2',
                    destination='3',
                    directed=True,
                    properties={
                        'count': 1
                    }
                )
            ]
        )
    )
    print('Elements have been added')
    print()


def get_elements(gc):
    # Get Elements
    filter_class = 'gafferpy.function.simple.filter.IsEqual'
    transform_class = 'gafferpy.rest.example.ExampleTransformFunction'
    elements = gc.execute_operation(
        g.GetRelatedElements(
            seeds=[g.EntitySeed('1')],
            view=g.View(
                entities=[
                    g.ElementDefinition(
                        group='entity',
                        transient_properties=[
                            g.Property('newProperty', 'java.lang.String')
                        ],
                        filter_functions=[
                            g.FilterFunction(
                                class_name='gafferpy.function.simple.filter.IsEqual',
                                selection=['VERTEX'],
                                function_fields={'value': '1'}
                            )
                        ],
                        transform_functions=[
                            g.TransformFunction(
                                class_name='gafferpy.rest.example.ExampleTransformFunction',
                                selection=['VERTEX'],
                                projection=['newProperty']
                            )
                        ]
                    )
                ],
                edges=[
                    g.ElementDefinition('edge')
                ]
            ),
            include_entities=False,
            include_edges=g.IncludeEdges.ALL
        )
    )
    print('Related elements')
    print(elements)
    print()


def get_adj_seeds(gc):
    # Adjacent Elements - chain 2 adjacent entities together
    adj_seeds = gc.execute_operations(
        [
            g.GetAdjacentEntitySeeds(
                seeds=[
                    g.EntitySeed(
                        vertex='1'
                    )
                ],
                in_out_type=g.InOutType.OUT
            ),
            g.GetAdjacentEntitySeeds(in_out_type=g.InOutType.OUT)
        ]
    )
    print('Adjacent entities - 2 hop')
    print(adj_seeds)
    print()


def get_all_elements(gc):
    # Get all elements, but limit the total results to 3, deduplication true
    all_elements = gc.execute_operation(
        g.GetAllElements(
            result_limit=3,
            deduplicate=True
        )
    )
    print('All elements (Limited to first 3)')
    print(all_elements)
    print()


def generate_elements(gc):
    # Generate Elements
    elements = gc.execute_operation(
        g.GenerateElements('gafferpy.rest.example.ExampleDomainObjectGenerator',
                           objects=[
                               {
                                   'class': 'gafferpy.rest.example.ExampleDomainObject',
                                   'ids': [
                                       '1',
                                       '2',
                                       True
                                   ],
                                   'type': 'edge'
                               },
                               {
                                   'class': 'gafferpy.rest.example.ExampleDomainObject',
                                   'ids': [
                                       '1'
                                   ],
                                   'type': 'entity'
                               }
                           ]
                           )
    )
    print('Generated elements from provided domain objects')
    print(elements)
    print()


def generate_domain_objs(gc):
    # Generate Domain Objects - single provided element
    objects = gc.execute_operation(
        g.GenerateObjects('gafferpy.rest.example.ExampleDomainObjectGenerator',
                          elements=[
                              g.Entity('entity', '1'),
                              g.Edge('edge', '1', '2', True)
                          ]
                          )
    )
    print('Generated objects from provided elements')
    print(objects)
    print()


def generate_domain_objects_chain(gc):
    # Generate Domain Objects - chain of get elements then generate objects
    objects = gc.execute_operations(
        [
            g.GetElementsBySeed(
                seeds=[g.EntitySeed('1')]
            ),
            g.GenerateObjects(
                'gafferpy.rest.example.ExampleDomainObjectGenerator')
        ]
    )
    print('Generated objects from get elements by seed')
    print(objects)
    print()


def get_element_group_counts(gc):
    # Get Elements
    elements = gc.execute_operations([
        g.GetRelatedElements(
            seeds=[g.EntitySeed('1')]
        ),
        g.CountGroups(limit=1000)
    ])
    print('Groups counts (limited to 1000 elements)')
    print(elements)
    print()


def get_sub_graph(gc):
    # Initialise, update and fetch an in memory set export
    result = gc.execute_operations(
        [
            g.InitialiseSetExport(),
            g.GetAdjacentEntitySeeds(
                seeds=[g.EntitySeed('1')],
            ),
            g.UpdateExport(),
            g.GetAdjacentEntitySeeds(),
            g.UpdateExport(),
            g.FetchExport()
        ]
    )
    print('Initialise, update and fetch export with adjacent entities')
    entity_seeds = g.ResultConverter.to_entity_seeds(result)
    print(entity_seeds)
    print()


if __name__ == "__main__":
    run('http://localhost:8080/rest/v1')
