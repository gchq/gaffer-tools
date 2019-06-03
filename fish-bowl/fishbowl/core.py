import json


class ToJson:
    """
    Enables implementations to be converted to json via a to_json method
    """

    def __repr__(self):
        return json.dumps(self.to_json())

    def to_json(self):
        """
        Converts an object to a simple json dictionary
        """
        raise NotImplementedError('Use an implementation')

    def to_json_str(self):
        return json.dumps(self.to_json())

    def to_json_pretty_str(self):
        return json.dumps(self.to_json(), indent=4, separators=(',', ': '))

    def pretty_print(self):
        print(self.to_json_pretty_str())

    def __str__(self):
        return str(self.to_json())

    def __eq__(self, other):
        other_json = other
        if isinstance(other_json, ToJson):
            other_json = other.to_json()
        return self.to_json() == other_json


class DirectedType:
    EITHER = 'EITHER'
    DIRECTED = 'DIRECTED'
    UNDIRECTED = 'UNDIRECTED'


class InOutType:
    EITHER = 'EITHER'
    IN = 'INCOMING'
    OUT = 'OUTGOING'


class SeedMatchingType:
    RELATED = 'RELATED'
    EQUAL = 'EQUAL'


class EdgeVertices:
    NONE = 'NONE'
    SOURCE = 'SOURCE'
    DESTINATION = 'DESTINATION'
    BOTH = 'BOTH'


class UseMatchedVertex:
    IGNORE = 'IGNORE'
    EQUAL = 'EQUAL'
    OPPOSITE = 'OPPOSITE'


class MatchKey:
    LEFT = 'LEFT'
    RIGHT = 'RIGHT'


class JoinType:
    FULL = 'FULL'
    OUTER = 'OUTER'
    INNER = 'INNER'


# Base class to be used by all Gaffer objects (Operations/ Functions / Predicates etc)
class Base(ToJson):
    def __init__(self, _class_name=None):
        self._class_name = _class_name

    def to_json(self):
        obj = {}

        if self._class_name is not None:
            obj["class"] = self._class_name

        return obj


class Operation(Base):
    def __init__(self, _class_name, options=None):
        super().__init__(_class_name=_class_name)
        self.options = options

    def to_json(self):
        operation_json = super().to_json()
        if self.options is not None:
            operation_json["options"] = self.options
        return operation_json


class ElementSeed(ToJson):
    def __repr__(self):
        return json.dumps(self.to_json())

    def to_json(self):
        raise NotImplementedError('Use either EntitySeed or EdgeSeed')

    def to_json_wrapped(self):
        raise NotImplementedError('Use either EntitySeed or EdgeSeed')


class EntitySeed(ElementSeed):
    CLASS = 'uk.gov.gchq.gaffer.operation.data.EntitySeed'

    def __init__(self, vertex):
        super().__init__()
        self.vertex = vertex

    def to_json(self):
        return {'class': self.CLASS,
                'vertex': self.vertex}

    def to_json_wrapped(self):
        return {
            self.CLASS: {
                'vertex': self.vertex,
                'class': self.CLASS
            }
        }


class EdgeSeed(ElementSeed):
    CLASS = 'uk.gov.gchq.gaffer.operation.data.EdgeSeed'

    def __init__(self, source, destination, directed_type, matched_vertex=None):
        super().__init__()
        self.source = source
        self.destination = destination
        if isinstance(directed_type, str):
            self.directed_type = directed_type
        elif directed_type:
            self.directed_type = DirectedType.DIRECTED
        else:
            self.directed_type = DirectedType.UNDIRECTED
        self.matched_vertex = matched_vertex

    def to_json(self):
        seed = {
            'class': self.CLASS,
            'source': self.source,
            'destination': self.destination,
            'directedType': self.directed_type
        }

        if self.matched_vertex is not None:
            seed['matchedVertex'] = self.matched_vertex

        return seed

    def to_json_wrapped(self):
        seed = {
            'source': self.source,
            'destination': self.destination,
            'directedType': self.directed_type,
            'class': self.CLASS
        }

        if self.matched_vertex is not None:
            seed['matchedVertex'] = self.matched_vertex

        return {
            self.CLASS: seed
        }


class Comparator(ToJson):
    def __init__(self, class_name, fields=None):
        super().__init__()

        self.class_name = class_name
        self.fields = fields

    def to_json(self):
        tmp_json = {
            'class': self.class_name
        }

        if self.fields is not None:
            for key in self.fields:
                tmp_json[key] = self.fields[key]

        return tmp_json


class ElementPropertyComparator(Comparator):
    CLASS = 'uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator'

    def __init__(self, groups, property, reversed=False):
        super().__init__(class_name=None)
        self.groups = groups
        self.property = property
        self.reversed = reversed

    def to_json(self):
        tmp_json = super().to_json()
        tmp_json["class"] = self.CLASS
        tmp_json['groups'] = self.groups
        tmp_json['property'] = self.property
        tmp_json['reversed'] = self.reversed
        return tmp_json


class SeedPair(ToJson):
    CLASS = 'uk.gov.gchq.gaffer.commonutil.pair.Pair'

    def __init__(self, first, second):
        super().__init__()

        self.first = first
        self.second = second

    def to_json(self):
        return {
            'class': self.CLASS,
            'first': self.first.to_json_wrapped(),
            'second': self.second.to_json_wrapped()
        }


class Element(ToJson):
    def __init__(self, _class_name, group, properties=None):
        super().__init__()
        if not isinstance(_class_name, str):
            raise TypeError('ClassName must be a class name string')
        if not isinstance(group, str):
            raise TypeError('Group must be a string')
        if not isinstance(properties, dict) and properties is not None:
            raise TypeError('properties must be a dictionary or None')
        self._class_name = _class_name
        self.group = group
        self.properties = properties

    def to_json(self):
        element = {'class': self._class_name, 'group': self.group}
        if self.properties is not None:
            element['properties'] = self.properties
        return element


class Entity(Element):
    CLASS = 'uk.gov.gchq.gaffer.data.element.Entity'

    def __init__(self, group, vertex, properties=None):
        super().__init__(self.CLASS, group,
                         properties)
        self.vertex = vertex

    def to_json(self):
        entity = super().to_json()
        entity['vertex'] = self.vertex
        return entity


class Edge(Element):
    CLASS = 'uk.gov.gchq.gaffer.data.element.Edge'

    def __init__(self, group, source, destination, directed, properties=None,
                 matched_vertex=None):
        super().__init__(self.CLASS, group,
                         properties)
        # Validate the arguments
        if not isinstance(directed, bool):
            raise TypeError('Directed must be a boolean')
        self.source = source
        self.destination = destination
        self.directed = directed
        self.matched_vertex = matched_vertex

    def to_json(self):
        edge = super().to_json()
        edge['source'] = self.source
        edge['destination'] = self.destination
        edge['directed'] = self.directed
        if self.matched_vertex is not None:
            edge['matchedVertex'] = self.matched_vertex

        return edge
