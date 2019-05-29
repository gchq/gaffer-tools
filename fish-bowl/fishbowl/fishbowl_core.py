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

