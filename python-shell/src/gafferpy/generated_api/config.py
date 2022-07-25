from gafferpy.gaffer_config import GetGraph


class GetJobs(GetGraph):
    def __init__(self):
        super().__init__('/graph/jobs')


class GetStatus(GetGraph):
    def __init__(self):
        super().__init__('/graph/status')


class GetOperations(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations')


class GetOperations(GetGraph):
    def __init__(self, class_name=''):
        super().__init__('/graph/operations/{className}'.format(className=class_name))


class GetOperationsNext(GetGraph):
    def __init__(self, class_name=''):
        super().__init__('/graph/operations/{className}/next'.format(className=class_name))


class GetOperationsExample(GetGraph):
    def __init__(self, class_name=''):
        super().__init__('/graph/operations/{className}/example'.format(className=class_name))


class GetOperationsDetails(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations/details')


class GetOperationsDetailsAll(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations/details/all')


class GetJobs(GetGraph):
    def __init__(self, id=''):
        super().__init__('/graph/jobs/{id}'.format(id=id))


class GetJobsResults(GetGraph):
    def __init__(self, id=''):
        super().__init__('/graph/jobs/{id}/results'.format(id=id))


class GetTransformFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/transformFunctions')


class GetStoreTraits(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/storeTraits')


class GetSerialisedFields(GetGraph):
    def __init__(self, class_name=''):
        super().__init__('/graph/config/serialisedFields/{className}'.format(className=class_name))


class GetSerialisedFieldsClasses(GetGraph):
    def __init__(self, class_name=''):
        super().__init__('/graph/config/serialisedFields/{className}/classes'.format(className=class_name))


class GetSchema(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/schema')


class GetObjectGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/objectGenerators')


class GetId(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/graphId')


class GetFilterFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/filterFunctions')


class GetFilterFunctions(GetGraph):
    def __init__(self, input_class=''):
        super().__init__('/graph/config/filterFunctions/{inputClass}'.format(inputClass=input_class))


class GetElementGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/elementGenerators')


class GetDescription(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/description')


class GetAggregationFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/aggregationFunctions')

