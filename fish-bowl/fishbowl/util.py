from fishbowl.core import ToJson

# JsonConverter
def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


# Move this
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
