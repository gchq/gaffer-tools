import re
from fishbowl.core import ToJson

"""
Convert string from camelCase to snake_case
"""


def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


"""
Write data to a file
"""


def write_to_file(file_path, data):
    file = open(file_path, "w+")
    file.write(data)
    file.close()


"""
Returns a json serializable dictionary based off an object
"""


def to_json(obj):
    if obj is None:
        return None

    if isinstance(obj, list):
        serialized_list = []

        for thing in obj:
            serialized_list.append(to_json(thing))

        return serialized_list

    if isinstance(obj, ToJson):
        return to_json(obj.to_json())

    if isinstance(obj, dict):
        serialized_map = {}

        for key in obj.keys():
            serialized_map[to_json(key)] = to_json(obj[key])

        return serialized_map

    return obj
