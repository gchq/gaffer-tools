import unittest

from gafferpy_core import gaffer_core as g

class gaffer_core_test(unittest.TestCase):

    def test_EntitySeed_formats_correctly(self):
        expected = {'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test'}
        self.assertEqual(expected, g.EntitySeed(vertex="test").to_json())

    def test_EntitySeed_formats_correctly_when_wrapped(self):
        expected = {'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
            'vertex': "test",
            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed'
        } }
        self.assertEqual(expected, g.EntitySeed(vertex="test").to_json_wrapped())

    def test_EdgeSeed_formats_correctly(self):
        expected = {
            'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
            'source':'',
            'destination': '',
            'directedType': 'UNDIRECTED'
            }
        self.assertEqual(expected, g.EdgeSeed(source="", destination="").to_json())

    def test_EdgeSeed_formats_correctly_with_matched_vertex(self):
        expected = {
            'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
            'source':'',
            'destination': '',
            'directedType': 'UNDIRECTED',
            'matchedVertex': ''
            }
        self.assertEqual(expected, 
            g.EdgeSeed(source="", destination="", directed_type="ROAR", matched_vertex="").to_json()
        )

    def test_EdgeSeed_formats_correctly_when_wrapped(self):
        expected = {'uk.gov.gchq.gaffer.operation.data.EdgeSeed': {
            'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
            'source':'',
            'destination': '',
            'directedType': 'UNDIRECTED'
            }}
        self.assertEqual(expected, 
            g.EdgeSeed(source="", destination="").to_json_wrapped()
        )

    def test_EdgeSeed_formats_correctly_when_wrapped_and_with_matched_vertex(self):
        expected = {'uk.gov.gchq.gaffer.operation.data.EdgeSeed': {
            'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
            'source':'',
            'destination': '',
            'directedType': 'UNDIRECTED',
            'matchedVertex': ''
            }}
        self.assertEqual(expected, 
            g.EdgeSeed(source="", destination="", directed_type=True, matched_vertex="").to_json_wrapped()
        )

    def test_EdgeSeed_directed_type_uses_enums(self):
        expected = {
            'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
            'source':'',
            'destination': '',
            'directedType': 'EITHER'
        }
        self.assertEqual(expected, 
            g.EdgeSeed(source="", destination="", directed_type=g.DirectedType.EITHER).to_json()
        )

    def test_Comparator_correctly_forms(self):
        expected = {'class': 'test'}
        self.assertEqual(expected, g.Comparator(class_name="test").to_json()) 
    
    def test_Comparator_correctly_forms_when_fields_are_included(self):
        expected = {'class': 'test', 'test': 'something'}
        self.assertEqual(expected, g.Comparator(class_name='test', fields={'test': 'something'}).to_json())

    def test_ElementPropertyComparator_correctly_formats(self):
        expected = {
            'class': 'uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator',
            'groups': '',
            'property': '',
            'reversed': False
        }
        self.assertEqual(
            expected, 
            g.ElementPropertyComparator(groups="", property="").to_json()
        )

    def test_Edge_is_correctly_formated(self):
        expected = {'class':'uk.gov.gchq.gaffer.data.element.Edge',"group": "", "source": "", "destination": "", "directed": True}
        self.assertEqual(expected,
            g.Edge(group="", source="", destination="", directed=True).to_json()
        )
    
    def test_Edge_fails_when_none_boolean_is_passed(self):
        args =  ["", "", "", "True"]
        self.assertRaises(TypeError, g.Edge, args)

    def test_Entity_formats_correctly(self): 
        expected = {'class': 'uk.gov.gchq.gaffer.data.element.Entity', 'group': 'test', 'vertex': 'test'}
        self.assertEqual(expected, g.Entity(group="test", vertex="test").to_json())
        
    def test_Element_fails_when_className_is_not_string(self):
        try:
            g.Element(_class_name=True, group="", properties="")
        except TypeError as e:
            self.assertEqual(e.args[0], 'ClassName must be a class name string')

    def test_Element_fails_when_group_is_not_string(self):
        try:
            g.Element(_class_name="", group=False, properties="")
        except TypeError as e:
            self.assertEqual(e.args[0], 'Group must be a string')

    def test_Element_fails_when_properties_is_not_dict(self):
        try:
            g.Element(_class_name="", group="", properties="")
        except TypeError as e:
            self.assertEqual(e.args[0], 'properties must be a dictionary or None')

    def test_Element_correctly_formats(self):
        expected = {
            'class': "",
            'group': "",
        }
        self.assertEqual(expected,
            g.Element(_class_name="", group="").to_json()
        )

    def test_Element_correctly_formats_with_properties(self):
        expected = {
            'class': "",
            'group': "",
            'properties': {
                "test": "something"
            }
        }
        self.assertEqual(expected,
            g.Element(_class_name="", group="", properties={"test": "something"}).to_json()
        )

    def test_SeedPair_correctly_formats(self):
        expected = {
            'class': 'uk.gov.gchq.gaffer.commonutil.pair.Pair',
            'first': {
                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                    'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                    'vertex': 'Something'
                }
            },
            'second': {
                'uk.gov.gchq.gaffer.operation.data.EntitySeed':  {
                    'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                    'vertex': 'Something'
                }
            }
        }
        self.assertEqual(expected,
            g.SeedPair(
                first={ 
                    'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                    'vertex': 'Something'
                }, 
                second={
                    'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                    'vertex': 'Something'
                }
            ).to_json()
        )

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_core_test)
    unittest.TextTestRunner(verbosity=2).run(suite)