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

import unittest

from gafferpy import gaffer as g


class GafferTest(unittest.TestCase):
    def test_entity_seed(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                'vertex': 'vertex'
            },
            g.EntitySeed("vertex").to_json()
        )

    def test_edge_seed(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'DIRECTED'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.DIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'UNDIRECTED'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.UNDIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'EITHER'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.EITHER).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'DIRECTED'
            },
            g.EdgeSeed("src", "dest", True).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'UNDIRECTED'
            },
            g.EdgeSeed("src", "dest", False).to_json()
        )

    def test_comparator(self):
        self.assertEqual(
            {
                'class': 'test_class_name'
            },
            g.Comparator("test_class_name", {}).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'field1': 'field2',
                'field3': 'field4'
            },
            g.Comparator("test_class_name", {
                "field1": "field2",
                "field3": "field4"}).to_json()
        )

    def test_element_property_comparator(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.comparison'
                         '.ElementPropertyComparator',
                'groups': 'groups',
                'property': 'property',
                'reversed': False

            },
            g.ElementPropertyComparator("groups", "property", False).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.comparison'
                         '.ElementPropertyComparator',
                'groups': 'groups',
                'property': 'property',
                'reversed': True

            },
            g.ElementPropertyComparator("groups", "property", True).to_json()
        )

    def test_seed_pair(self):
        first_entity_seed = g.EntitySeed("vertex")
        second_entity_seed = g.EntitySeed("vertex1")
        first_edge_seed = g.EdgeSeed("src", "dest", g.DirectedType.DIRECTED)
        second_edge_seed = g.EdgeSeed("src1", "dest1", g.DirectedType.DIRECTED)

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.commonutil.pair.Pair',
                'first': first_entity_seed.to_json_wrapped(),
                'second': second_entity_seed.to_json_wrapped()
            },
            g.SeedPair(first_entity_seed, second_entity_seed).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.commonutil.pair.Pair',
                'first': first_edge_seed.to_json_wrapped(),
                'second': second_edge_seed.to_json_wrapped()
            },
            g.SeedPair(first_edge_seed, second_edge_seed).to_json()
        )

    def test_element(self):
        self.assertEqual(
            {
                'class': 'test_class',
                'group': 'group'
            },
            g.Element("test_class", "group").to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class',
                'group': 'group',
                'properties': {'prop': 'prop1'}
            },
            g.Element("test_class", "group", {"prop": "prop1"}).to_json()
        )

    def test_entity(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                'group': 'group',
                'vertex': 'vertex',
            },
            g.Entity("group", "vertex").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                'group': 'group',
                'vertex': 'vertex',
                'properties': {'prop': 'prop1'}
            },
            g.Entity("group", "vertex", {"prop": "prop1"}).to_json()
        )

    def test_edge(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.Edge',
                'group': 'group',
                'source': 'source',
                'destination': 'destination',
                'directed': True

            },
            g.Edge("group", "source", "destination", True).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.Edge',
                'group': 'group',
                'source': 'source',
                'destination': 'destination',
                'directed': False

            },
            g.Edge("group", "source", "destination", False).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.data.element.Edge',
                'group': 'group',
                'source': 'source',
                'destination': 'destination',
                'directed': False,
                'properties': {'prop': 'prop1'}

            },
            g.Edge("group", "source", "destination", False,
                   {"prop": "prop1"}).to_json()
        )

    def test_view(self):
        self.assertEqual(
            {},
            g.View().to_json()
        )

        self.assertEqual(
            {
                'entities': {
                    'test': {'class': 'uk.gov.gchq.gaffer.data.element.Edge',
                             'group': 'test',
                             'source': 'source',
                             'destination': 'destination',
                             'directed': False}}
            },
            g.View(
                [
                    g.ElementDefinition(
                        group="test"
                    ),
                    g.Edge("test", "source", "destination", False)
                ]).to_json()
        )

        self.assertEqual(
            {
                'edges': {
                    'test': {'class': 'uk.gov.gchq.gaffer.data.element.Edge',
                             'group': 'test',
                             'source': 'source',
                             'destination': 'destination',
                             'directed': False}}
            },
            g.View(
                edges=[
                    g.ElementDefinition(
                        group="test"
                    ),
                    g.Edge("test", "source", "destination", False)
                ]).to_json()
        )

    def test_element_definition(self):
        self.maxDiff = None
        self.assertEqual(
            {
                'groupBy': [],
            },
            g.ElementDefinition("testGroup").to_json()
        )

        self.assertEqual(
            {
                'groupBy': [],
                'transientProperties': {'test_prop': 'test_prop_class'}
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop",
                                            "test_prop_class")]).to_json()
        )

        self.assertEqual(
            {
                'groupBy': ['test_group'],
                'transientProperties': {'test_prop': 'test_prop_class'}
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop", "test_prop_class")],
                                ["test_group"]).to_json()
        )

        self.assertEqual(
            {
                'groupBy': ['test_group'],
                'transientProperties': {'test_prop': 'test_prop_class'},
                'preAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class',
                                    'value': {
                                        'test_value_class': 1}},
                      'selection': ['test_selection']}]
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop", "test_prop_class")],
                                ["test_group"],
                                [g.FilterFunction(
                                    "test_filter_class",
                                    ["test_selection"],
                                    {"value": {"test_value_class": 1}}
                                )]).to_json()
        )

        self.assertEqual(
            {
                'groupBy': ['test_group'],
                'transientProperties': {'test_prop': 'test_prop_class'},
                'preAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class',
                                    'value': {
                                        'test_value_class': 1}},
                      'selection': ['test_selection']}],
                'postAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class_1',
                                    'value': {
                                        'test_value_class_1': 1}},
                      'selection': ['test_selection_1']}]
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop", "test_prop_class")],
                                ["test_group"],
                                [g.FilterFunction(
                                    "test_filter_class",
                                    ["test_selection"],
                                    {"value": {"test_value_class": 1}}
                                )],
                                [g.FilterFunction(
                                    "test_filter_class_1",
                                    ["test_selection_1"],
                                    {"value": {"test_value_class_1": 1}}
                                )]).to_json()
        )

        self.assertEqual(
            {
                'groupBy': ['test_group'],
                'transientProperties': {'test_prop': 'test_prop_class'},
                'preAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class',
                                    'value': {
                                        'test_value_class': 1}},
                      'selection': ['test_selection']}],
                'postAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class_1',
                                    'value': {
                                        'test_value_class_1': 1}},
                      'selection': ['test_selection_1']}],
                'transformFunctions': [{'function': {'class': 'test_class'},
                                        'projection':
                                            ['description'],
                                        'selection':
                                            ['src', 'dest', 'count']}]
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop", "test_prop_class")],
                                ["test_group"],
                                [g.FilterFunction(
                                    "test_filter_class",
                                    ["test_selection"],
                                    {"value": {"test_value_class": 1}}
                                )],
                                [g.FilterFunction(
                                    "test_filter_class_1",
                                    ["test_selection_1"],
                                    {"value": {"test_value_class_1": 1}}
                                )],
                                [
                                    g.TransformFunction(
                                        "test_class",
                                        ["src", "dest", "count"],
                                        ["description"]
                                    )
                                ]).to_json()
        )

        self.assertEqual(
            {
                'groupBy': ['test_group'],
                'transientProperties': {'test_prop': 'test_prop_class'},
                'preAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class',
                                    'value': {
                                        'test_value_class': 1}},
                      'selection': ['test_selection']}],
                'postAggregationFilterFunctions':
                    [{'predicate': {'class':
                                    'test_filter_class_1',
                                    'value': {
                                        'test_value_class_1': 1}},
                      'selection': ['test_selection_1']}],
                'transformFunctions': [{'function': {'class': 'test_class'},
                                        'projection':
                                            ['description'],
                                        'selection':
                                            ['src', 'dest',
                                             'count']}],
                'postTransformFilterFunctions': [{'function': {'class':
                                                               'test_class_1'},
                                                  'projection':
                                                      ['description'],
                                                  'selection':
                                                      ['src', 'dest',
                                                       'count']}

                                                 ]
            },
            g.ElementDefinition("test_group",
                                [g.Property("test_prop", "test_prop_class")],
                                ["test_group"],
                                [g.FilterFunction(
                                    "test_filter_class",
                                    ["test_selection"],
                                    {"value": {"test_value_class": 1}}
                                )],
                                [g.FilterFunction(
                                    "test_filter_class_1",
                                    ["test_selection_1"],
                                    {"value": {"test_value_class_1": 1}}
                                )],
                                [
                                    g.TransformFunction(
                                        "test_class",
                                        ["src", "dest", "count"],
                                        ["description"]
                                    )
                                ],
                                [
                                    g.TransformFunction(
                                        "test_class_1",
                                        ["src", "dest", "count"],
                                        ["description"]
                                    )
                                ]).to_json()
        )

    def test_property(self):
        self.assertEqual(
            {
                'test_name': 'test_class_name'
            },
            g.Property("test_name", "test_class_name").to_json()
        )

    def test_gaffer_function(self):
        self.assertEqual(
            {
                'test_classType': {'class': 'test_class'}
            },
            g.GafferFunction("test_class", "test_classType").to_json()
        )

        self.assertEqual(
            {
                'test_classType': {'class': 'test_class',
                                   'function_field1': 'test_field1'}
            },
            g.GafferFunction("test_class", "test_classType",
                             {"function_field1": "test_field1"}).to_json()
        )

    def test_filter_function(self):
        self.assertEqual(
            {
                'predicate': {'class': 'test_class'},
                'selection': 'selection'
            },
            g.FilterFunction("test_class", "selection").to_json()
        )

        self.assertEqual(
            {
                'predicate': {'class': 'test_class',
                              'function_field1': 'test_field1'},
                'selection': 'selection'
            },
            g.FilterFunction("test_class", "selection",
                             {"function_field1": "test_field1"}).to_json()
        )

    def test_transform_function(self):
        self.assertEqual(
            {
                'function': {'class': 'test_class'},
                'selection': 'selection',
                'projection': 'projection'
            },
            g.TransformFunction("test_class", "selection", "projection")
            .to_json()
        )

        self.assertEqual(
            {
                'function': {'class': 'test_class'},
                'selection': 'selection',
                'projection': {'function_field1': 'test_field1'}
            },
            g.TransformFunction("test_class", "selection",
                                {"function_field1": "test_field1"}).to_json()
        )

    def test_operation_chain(self):
        test_op_chain1 = g.Operation("test_class")
        operations = [test_op_chain1]
        self.assertEqual(
            {
                'operations': [{'class': 'test_class'}]
            },
            g.OperationChain(operations).to_json()
        )

        test_op_chain2 = g.Operation("test_class_1", g.View())
        operations.append(test_op_chain2)
        self.assertEqual(
            {
                'operations': [{'class': 'test_class'},
                               {'class': 'test_class_1', 'view': {}}]
            },
            g.OperationChain(operations).to_json()
        )

        test_op_chain3 = g.Operation("test_class_2", g.View(),
                                     {"option1": "option"})
        operations.append(test_op_chain3)
        self.assertEqual(
            {
                'operations': [{'class': 'test_class'},
                               {'class': 'test_class_1', 'view': {}},
                               {'class': 'test_class_2', 'view': {},
                                'options': {'option1': 'option'}}]
            },
            g.OperationChain(operations).to_json()
        )

    def test_operation(self):
        self.assertEqual(
            {
                'class': 'test_class'
            },
            g.Operation("test_class").to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class',
                'view': {}
            },
            g.Operation("test_class", g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class',
                'view': {},
                'options': {'option1': 'option'}

            },
            g.Operation("test_class", g.View(), {"option1": "option"}).to_json()
        )

    def test_add_elements(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.add.AddElements',
                'skipInvalidElements': False,
                'validate': True
            },
            g.AddElements().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.add.AddElements',
                'skipInvalidElements': True,
                'validate': False
            },
            g.AddElements(skip_invalid_elements=True, validate=False).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.add.AddElements',
                'skipInvalidElements': False,
                'validate': True,
                'view': {}
            },
            g.AddElements(view=g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.add.AddElements',
                'skipInvalidElements': False,
                'validate': True,
                'view': {},
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'group',
                           'vertex': 'vertex'}]
            },
            g.AddElements(view=g.View(),
                          elements=[g.Entity("group", "vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.add.AddElements',
                'skipInvalidElements': False,
                'validate': True,
                'view': {},
                'options': {'options1': 'option'},
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'group',
                           'vertex': 'vertex'}]
            },
            g.AddElements(view=g.View(),
                          elements=[g.Entity("group", "vertex")],
                          options={"options1": "option"}).to_json()
        )

    def test_generate_elements(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.generate.GenerateElements',
                'elementGenerator': {'class': 'generate_class_elements'}
            },
            g.GenerateElements("generate_class_elements").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.generate.GenerateElements',
                'elementGenerator': {'class': 'generate_class_elements',
                                     'field1': 'value1'}
            },
            g.GenerateElements("generate_class_elements",
                               {"field1": "value1"}).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.generate.GenerateElements',
                'elementGenerator': {'class': 'generate_class_elements'},
                'input': ['test_object']
            },
            g.GenerateElements("generate_class_elements",
                               objects=["test_object"]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateElements',
                'elementGenerator': {'class': 'generate_class_elements'},
                'view': {}
            },
            g.GenerateElements("generate_class_elements",
                               view=g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateElements',
                'elementGenerator': {'class': 'generate_class_elements'},
                'view': {},
                'options': {'option1': 'option'}
            },
            g.GenerateElements("generate_class_elements",
                               view=g.View(), options={"option1": "option"})
            .to_json()
        )

    def test_generate_objects(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateObjects',
                'elementGenerator': {'class': 'test_class_name'}
            },
            g.GenerateObjects("test_class_name").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateObjects',
                'elementGenerator': {'class': 'test_class_name',
                                     'key1': 'value1'},
            },
            g.GenerateObjects("test_class_name", {"key1": "value1"}).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateObjects',
                'elementGenerator': {'class': 'test_class_name'},
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'group',
                           'vertex': 'vertex'}]
            },
            g.GenerateObjects("test_class_name", elements=[g.Entity("group", "vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateObjects',
                'elementGenerator': {'class': 'test_class_name'},
                'view': {}
            },
            g.GenerateObjects("test_class_name", view=g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.generate.GenerateObjects',
                'elementGenerator': {'class': 'test_class_name'},
                'view': {},
                'options': {'option1': 'option'}
            },
            g.GenerateObjects("test_class_name", view=g.View(),
                              options={"option1": "option"}).to_json()
        )

    def test_export_to_gaffer_result_cache(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.ExportToGafferResultCache'
            },
            g.ExportToGafferResultCache().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.ExportToGafferResultCache',
                'key': 'test_key'
            },
            g.ExportToGafferResultCache("test_key").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.ExportToGafferResultCache',
                'key': 'test_key',
                'opAuths': 'test_op_auths'
            },
            g.ExportToGafferResultCache("test_key", "test_op_auths").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.ExportToGafferResultCache',
                'key': 'test_key',
                'opAuths': 'test_op_auths',
                'options': {'option1': 'option'}
            },
            g.ExportToGafferResultCache("test_key", "test_op_auths",
                                        {"option1": "option"}).to_json()
        )

    def test_get_gaffer_result_cache_export(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.GetGafferResultCacheExport'
            },
            g.GetGafferResultCacheExport().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.GetGafferResultCacheExport',
                'jobId': 'test_job_id'
            },
            g.GetGafferResultCacheExport("test_job_id").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.GetGafferResultCacheExport',
                'jobId': 'test_job_id',
                'key': 'test_key'
            },
            g.GetGafferResultCacheExport("test_job_id", "test_key").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.resultcache.GetGafferResultCacheExport',
                'jobId': 'test_job_id',
                'key': 'test_key',
                'options': {'option1': 'option'}
            },
            g.GetGafferResultCacheExport("test_job_id", "test_key",
                                         {"option1": "option"}).to_json()
        )

    def test_export_to_set(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.ExportToSet'
            },
            g.ExportToSet().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.ExportToSet',
                'key': 'test_key'
            },
            g.ExportToSet("test_key").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.ExportToSet',
                'key': 'test_key',
                'options': {'option1': 'option'}
            },
            g.ExportToSet("test_key", {"option1": "option"}).to_json()
        )

    def test_get_set_export(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.GetSetExport'
            },
            g.GetSetExport().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.GetSetExport',
                'jobId': 'test_job_id'
            },
            g.GetSetExport("test_job_id").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.GetSetExport',
                'jobId': 'test_job_id',
                'key': 'test_key'
            },
            g.GetSetExport("test_job_id", "test_key").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.export.set.GetSetExport',
                'jobId': 'test_job_id',
                'key': 'test_key',
                'options': {'option1': 'option'}
            },
            g.GetSetExport("test_job_id", "test_key",
                           {"option1": "option"}).to_json()
        )

    def test_get_job_details(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails'
            },
            g.GetJobDetails().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails',
                'jobId': 'test_job_id'
            },
            g.GetJobDetails("test_job_id").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails',
                'jobId': 'test_job_id',
                'options': {'option1': 'option'}
            },
            g.GetJobDetails("test_job_id", {"option1": "option"}).to_json()
        )

    def test_get_all_job_details(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.job.GetAllJobDetails'
            },
            g.GetAllJobDetails().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl'
                         '.job.GetAllJobDetails',
                'options': {'option1': 'option'}
            },
            g.GetAllJobDetails({"option1": "option"}).to_json()
        )

    def test_get_operation(self):
        self.assertEqual(
            {
                'class': 'test_class_name'
            },
            g.GetOperation("test_class_name").to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}]
            },
            g.GetOperation("test_class_name",
                           [g.EntitySeed("test_vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetOperation("test_class_name",
                           [g.EntitySeed("test_vertex")],
                           g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'directedType': 'DIRECTED',
                'includeIncomingOutGoing': 'DIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetOperation("test_class_name",
                           [g.EntitySeed("test_vertex")],
                           g.View(),
                           g.DirectedType.DIRECTED,
                           g.DirectedType.DIRECTED,
                           g.SeedMatchingType.EQUAL).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'directedType': 'UNDIRECTED',
                'includeIncomingOutGoing': 'UNDIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetOperation("test_class_name",
                           [g.EntitySeed("test_vertex")],
                           g.View(),
                           g.DirectedType.UNDIRECTED,
                           g.DirectedType.UNDIRECTED,
                           g.SeedMatchingType.EQUAL).to_json()
        )

        self.assertEqual(
            {
                'class': 'test_class_name',
                'directedType': 'DIRECTED',
                'includeIncomingOutGoing': 'DIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'options': {'option1': 'option'}
            },
            g.GetOperation("test_class_name",
                           [g.EntitySeed("test_vertex")],
                           g.View(),
                           g.DirectedType.DIRECTED,
                           g.DirectedType.DIRECTED,
                           g.SeedMatchingType.EQUAL,
                           {"option1": "option"}).to_json()
        )

    def test_get_elements(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements'
            },
            g.GetElements().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}]
            },
            g.GetElements([g.EntitySeed("test_vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetElements([g.EntitySeed("test_vertex")],
                          g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'directedType': 'DIRECTED',
                'includeIncomingOutGoing': 'DIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetElements([g.EntitySeed("test_vertex")],
                          g.View(),
                          g.DirectedType.DIRECTED,
                          g.DirectedType.DIRECTED,
                          g.SeedMatchingType.EQUAL).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'directedType': 'UNDIRECTED',
                'includeIncomingOutGoing': 'UNDIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetElements([g.EntitySeed("test_vertex")],
                          g.View(),
                          g.DirectedType.UNDIRECTED,
                          g.DirectedType.UNDIRECTED,
                          g.SeedMatchingType.EQUAL).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                'directedType': 'DIRECTED',
                'includeIncomingOutGoing': 'DIRECTED',
                'seedMatching': 'EQUAL',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'options': {'option1': 'option'}
            },
            g.GetElements([g.EntitySeed("test_vertex")],
                          g.View(),
                          g.DirectedType.DIRECTED,
                          g.DirectedType.DIRECTED,
                          g.SeedMatchingType.EQUAL,
                          {"option1": "option"}).to_json()
        )

    def test_get_adjacent_ids(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds'
            },
            g.GetAdjacentIds().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}]
            },
            g.GetAdjacentIds([g.EntitySeed("test_vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.GetAdjacentIds([g.EntitySeed("test_vertex")], g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'includeIncomingOutGoing': 'INCOMING'
            },
            g.GetAdjacentIds([g.EntitySeed("test_vertex")], g.View(),
                             g.InOutType.IN).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'includeIncomingOutGoing': 'OUTGOING'
            },
            g.GetAdjacentIds([g.EntitySeed("test_vertex")], g.View(),
                             g.InOutType.OUT).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'options': {'option1': 'option'}
            },
            g.GetAdjacentIds([g.EntitySeed("test_vertex")], g.View(),
                             options={"option1": "option"}).to_json()
        )

    def test_get_all_elements(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements'
            },
            g.GetAllElements().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements',
                'view': {}
            },
            g.GetAllElements(g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements',
                'view': {},
                'directedType': 'DIRECTED'
            },
            g.GetAllElements(g.View(), g.DirectedType.DIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements',
                'view': {},
                'directedType': 'UNDIRECTED'
            },
            g.GetAllElements(g.View(), g.DirectedType.UNDIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements',
                'view': {},
                'directedType': 'UNDIRECTED',
                'options': {'option1': 'option'}
            },
            g.GetAllElements(g.View(), g.DirectedType.UNDIRECTED,
                             {"option1": "option"}).to_json()
        )

    def test_named_operation(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
                'operationName': 'test_op_name'
            },
            g.NamedOperation("test_op_name").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
                'operationName': 'test_op_name',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}]
            },
            g.NamedOperation("test_op_name",
                             [g.EntitySeed("test_vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
                'operationName': 'test_op_name',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {}
            },
            g.NamedOperation("test_op_name", [g.EntitySeed("test_vertex")],
                             g.View()).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
                'operationName': 'test_op_name',
                'input': [{'class': 'uk.gov.gchq.gaffer'
                                    '.operation.data.EntitySeed',
                           'vertex': 'test_vertex'}],
                'view': {},
                'options': {'option1': 'option'}
            },
            g.NamedOperation("test_op_name", [g.EntitySeed("test_vertex")],
                             g.View(), {"option1": "option"}).to_json()
        )

    def test_add_named_operation(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': False
            },
            g.AddNamedOperation("test_operation_chain", "test_name").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': False,
                'description': 'test_description'
            },
            g.AddNamedOperation("test_operation_chain", "test_name",
                                "test_description").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': False,
                'description': 'test_description',
                'readAccessRoles': 'test_read_access_roles'
            },
            g.AddNamedOperation("test_operation_chain", "test_name",
                                "test_description",
                                "test_read_access_roles").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': False,
                'description': 'test_description',
                'readAccessRoles': 'test_read_access_roles',
                'writeAccessRoles': 'test_write_access_roles'
            },
            g.AddNamedOperation("test_operation_chain", "test_name",
                                "test_description", "test_read_access_roles",
                                "test_write_access_roles").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': True,
                'description': 'test_description',
                'readAccessRoles': 'test_read_access_roles',
                'writeAccessRoles': 'test_write_access_roles'
            },
            g.AddNamedOperation("test_operation_chain", "test_name",
                                "test_description", "test_read_access_roles",
                                "test_write_access_roles", True).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation',
                'operationChain': 'test_operation_chain',
                'operationName': 'test_name',
                'overwriteFlag': False,
                'description': 'test_description',
                'readAccessRoles': 'test_read_access_roles',
                'writeAccessRoles': 'test_write_access_roles',
                'options': {'option1': 'option'}
            },
            g.AddNamedOperation("test_operation_chain", "test_name",
                                "test_description", "test_read_access_roles",
                                "test_write_access_roles", False,
                                {"option1": "option"}).to_json()
        )

    def test_delete_named_operation(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named'
                         '.operation.DeleteNamedOperation',
                'operationName': 'test_name'
            },
            g.DeleteNamedOperation("test_name").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named'
                         '.operation.DeleteNamedOperation',
                'operationName': 'test_name',
                'options': {'option1': 'option'}
            },
            g.DeleteNamedOperation("test_name", {"option1": "option"}).to_json()
        )

    def test_get_all_named_operations(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named'
                         '.operation.GetAllNamedOperations'
            },
            g.GetAllNamedOperations().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.named'
                         '.operation.GetAllNamedOperations',
                'options': {'options1': 'option'}
            },
            g.GetAllNamedOperations({"options1": "option"}).to_json()
        )

    def test_discard_output(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.DiscardOutput'
            },
            g.DiscardOutput().to_json()
        )

    def test_count_groups(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.CountGroups'
            },
            g.CountGroups().to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.CountGroups',
                'limit': 10
            },
            g.CountGroups(10).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.CountGroups',
                'limit': 10,
                'options': {"option1": "option"}
            },
            g.CountGroups(10, {"option1": "option"}).to_json()
        )

    def test_limit(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.Limit',
                'resultLimit': 10
            },
            g.Limit(10).to_json()
        )

    def test_to_set(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToSet'
            },
            g.ToSet().to_json()
        )

    def test_to_array(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToArray'
            },
            g.ToArray().to_json()
        )

    def test_to_entity_seeds(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation'
                         '.impl.output.ToEntitySeeds'
            },
            g.ToEntitySeeds().to_json()
        )

    def test_to_vertices(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToVertices',
                'edgeVertices': 'test_edge_vertices'
            },
            g.ToVertices("test_edge_vertices").to_json()
        )

    def test_to_csv(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToCsv',
                'elementGenerator': 'test_element_generator',
                'includeHeader': True
            },
            g.ToCsv("test_element_generator").to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToCsv',
                'elementGenerator': 'test_element_generator',
                'includeHeader': False
            },
            g.ToCsv("test_element_generator", False).to_json()
        )

    def test_to_map_csv(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.output.ToMap',
                'elementGenerator': 'test_element_generator'
            },
            g.ToMapCsv("test_element_generator").to_json()
        )

    def test_sort(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Sort',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}]
            },
            g.Sort([g.ElementPropertyComparator("test_groups",
                                                "test_property")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Sort',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}],
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'test_group',
                           'vertex': 'test_vertex'}]
            },
            g.Sort([g.ElementPropertyComparator("test_groups",
                                                "test_property")],
                   [g.Entity("test_group", "test_vertex")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Sort',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}],
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'test_group',
                           'vertex': 'test_vertex'}],
                'resultLimit': 10
            },
            g.Sort([g.ElementPropertyComparator("test_groups",
                                                "test_property")],
                   [g.Entity("test_group", "test_vertex")], 10).to_json()
        )

    def test_max(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Max',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}]
            },
            g.Max([g.ElementPropertyComparator("test_groups",
                                               "test_property")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Max',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}],
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'test_group',
                           'vertex': 'test_vertex'}]
            },
            g.Max([g.ElementPropertyComparator("test_groups",
                                               "test_property")],
                  [g.Entity("test_group", "test_vertex")]).to_json()
        )

    def test_min(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Min',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}]

            },
            g.Min([g.ElementPropertyComparator("test_groups",
                                               "test_property")]).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.impl.compare.Min',
                'comparators': [{'class': 'uk.gov.gchq.gaffer.data.'
                                          'element.comparison'
                                          '.ElementPropertyComparator',
                                 'groups': 'test_groups',
                                 'property': 'test_property',
                                 'reversed': False}],
                'input': [{'class': 'uk.gov.gchq.gaffer.data.element.Entity',
                           'group': 'test_group',
                           'vertex': 'test_vertex'}]
            },
            g.Min([g.ElementPropertyComparator("test_groups",
                                               "test_property")],
                  [g.Entity("test_group", "test_vertex")]).to_json()
        )


if __name__ == "__main__":
    unittest.main()
