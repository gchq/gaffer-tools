from fishbowl.core import *


class OperationChain(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChain"

    def __init__(self, operations=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operations = operations

    def to_json(self):
        operation_json = super().to_json()
        if self.operations is not None:
            operation_json["operations"] = self.operations
        return operation_json


class Filter(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Filter"

    def __init__(self, input=None, global_edges=None, global_entities=None, entities=None, edges=None, global_elements=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.global_edges = global_edges
        self.global_entities = global_entities
        self.entities = entities
        self.edges = edges
        self.global_elements = global_elements

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.global_edges is not None:
            operation_json["globalEdges"] = self.global_edges
        if self.global_entities is not None:
            operation_json["globalEntities"] = self.global_entities
        if self.entities is not None:
            operation_json["entities"] = self.entities
        if self.edges is not None:
            operation_json["edges"] = self.edges
        if self.global_elements is not None:
            operation_json["globalElements"] = self.global_elements
        return operation_json


class Max(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Max"

    def __init__(self, input=None, comparators=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.comparators = comparators

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.comparators is not None:
            operation_json["comparators"] = self.comparators
        return operation_json


class Validate(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Validate"

    def __init__(self, input=None, skip_invalid_elements=None, validate=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class NamedOperation(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.operation.NamedOperation"

    def __init__(self, input=None, operation_name=None, parameters=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.operation_name = operation_name
        self.parameters = parameters

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.operation_name is not None:
            operation_json["operationName"] = self.operation_name
        if self.parameters is not None:
            operation_json["parameters"] = self.parameters
        return operation_json


class SetVariable(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.SetVariable"

    def __init__(self, input=None, variable_name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.variable_name = variable_name

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.variable_name is not None:
            operation_json["variableName"] = self.variable_name
        return operation_json


class Sort(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Sort"

    def __init__(self, input=None, result_limit=None, deduplicate=None, comparators=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.result_limit = result_limit
        self.deduplicate = deduplicate
        self.comparators = comparators

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.result_limit is not None:
            operation_json["resultLimit"] = self.result_limit
        if self.deduplicate is not None:
            operation_json["deduplicate"] = self.deduplicate
        if self.comparators is not None:
            operation_json["comparators"] = self.comparators
        return operation_json


class ToStream(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToStream"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class GetJobDetails(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails"

    def __init__(self, job_id=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class ToList(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToList"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class AddElements(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.AddElements"

    def __init__(self, input=None, skip_invalid_elements=None, validate=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class GetAdjacentIds(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds"

    def __init__(self, input=None, view=None, include_incoming_out_going=None, directed_type=None, views=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.view = view
        self.include_incoming_out_going = include_incoming_out_going
        self.directed_type = directed_type
        self.views = views

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.view is not None:
            operation_json["view"] = self.view
        if self.include_incoming_out_going is not None:
            operation_json["includeIncomingOutGoing"] = self.include_incoming_out_going
        if self.directed_type is not None:
            operation_json["directedType"] = self.directed_type
        if self.views is not None:
            operation_json["views"] = self.views
        return operation_json


class AddNamedOperation(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.operation.AddNamedOperation"

    def __init__(self, overwrite_flag=None, write_access_predicate=None, score=None, read_access_roles=None, read_access_predicate=None, description=None, operation_name=None, operation_chain=None, parameters=None, write_access_roles=None, labels=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.overwrite_flag = overwrite_flag
        self.write_access_predicate = write_access_predicate
        self.score = score
        self.read_access_roles = read_access_roles
        self.read_access_predicate = read_access_predicate
        self.description = description
        self.operation_name = operation_name
        self.operation_chain = operation_chain
        self.parameters = parameters
        self.write_access_roles = write_access_roles
        self.labels = labels

    def to_json(self):
        operation_json = super().to_json()
        if self.overwrite_flag is not None:
            operation_json["overwriteFlag"] = self.overwrite_flag
        if self.write_access_predicate is not None:
            operation_json["writeAccessPredicate"] = self.write_access_predicate
        if self.score is not None:
            operation_json["score"] = self.score
        if self.read_access_roles is not None:
            operation_json["readAccessRoles"] = self.read_access_roles
        if self.read_access_predicate is not None:
            operation_json["readAccessPredicate"] = self.read_access_predicate
        if self.description is not None:
            operation_json["description"] = self.description
        if self.operation_name is not None:
            operation_json["operationName"] = self.operation_name
        if self.operation_chain is not None:
            operation_json["operationChain"] = self.operation_chain
        if self.parameters is not None:
            operation_json["parameters"] = self.parameters
        if self.write_access_roles is not None:
            operation_json["writeAccessRoles"] = self.write_access_roles
        if self.labels is not None:
            operation_json["labels"] = self.labels
        return operation_json


class GetTraits(Operation):
    CLASS = "uk.gov.gchq.gaffer.store.operation.GetTraits"

    def __init__(self, current_traits=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.current_traits = current_traits

    def to_json(self):
        operation_json = super().to_json()
        if self.current_traits is not None:
            operation_json["currentTraits"] = self.current_traits
        return operation_json


class If(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.If"

    def __init__(self, otherwise=None, input=None, condition=None, conditional=None, multi_input_wrapper=None, then=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.otherwise = otherwise
        self.input = input
        self.condition = condition
        self.conditional = conditional
        self.multi_input_wrapper = multi_input_wrapper
        self.then = then

    def to_json(self):
        operation_json = super().to_json()
        if self.otherwise is not None:
            operation_json["otherwise"] = self.otherwise
        if self.input is not None:
            operation_json["input"] = self.input
        if self.condition is not None:
            operation_json["condition"] = self.condition
        if self.conditional is not None:
            operation_json["conditional"] = self.conditional
        if self.multi_input_wrapper is not None:
            operation_json["multiInputWrapper"] = self.multi_input_wrapper
        if self.then is not None:
            operation_json["then"] = self.then
        return operation_json


class ToCsv(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToCsv"

    def __init__(self, input=None, element_generator=None, include_header=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.element_generator = element_generator
        self.include_header = include_header

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        if self.include_header is not None:
            operation_json["includeHeader"] = self.include_header
        return operation_json


class GetExports(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.GetExports"

    def __init__(self, get_exports=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.get_exports = get_exports

    def to_json(self):
        operation_json = super().to_json()
        if self.get_exports is not None:
            operation_json["getExports"] = self.get_exports
        return operation_json


class ToVertices(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToVertices"

    def __init__(self, input=None, use_matched_vertex=None, edge_vertices=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.use_matched_vertex = use_matched_vertex
        self.edge_vertices = edge_vertices

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.use_matched_vertex is not None:
            operation_json["useMatchedVertex"] = self.use_matched_vertex
        if self.edge_vertices is not None:
            operation_json["edgeVertices"] = self.edge_vertices
        return operation_json


class DeleteNamedView(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.view.DeleteNamedView"

    def __init__(self, name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.name = name

    def to_json(self):
        operation_json = super().to_json()
        if self.name is not None:
            operation_json["name"] = self.name
        return operation_json


class GetVariables(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetVariables"

    def __init__(self, variable_names=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_names = variable_names

    def to_json(self):
        operation_json = super().to_json()
        if self.variable_names is not None:
            operation_json["variableNames"] = self.variable_names
        return operation_json


class ExportToOtherAuthorisedGraph(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph"

    def __init__(self, input=None, parent_store_properties_id=None, parent_schema_ids=None, graph_id=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.parent_store_properties_id = parent_store_properties_id
        self.parent_schema_ids = parent_schema_ids
        self.graph_id = graph_id
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.parent_store_properties_id is not None:
            operation_json["parentStorePropertiesId"] = self.parent_store_properties_id
        if self.parent_schema_ids is not None:
            operation_json["parentSchemaIds"] = self.parent_schema_ids
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class GetSchema(Operation):
    CLASS = "uk.gov.gchq.gaffer.store.operation.GetSchema"

    def __init__(self, compact=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.compact = compact

    def to_json(self):
        operation_json = super().to_json()
        if self.compact is not None:
            operation_json["compact"] = self.compact
        return operation_json


class CancelScheduledJob(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.CancelScheduledJob"

    def __init__(self, job_id=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class ForEach(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.ForEach"

    def __init__(self, input=None, operation=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.operation = operation

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.operation is not None:
            operation_json["operation"] = self.operation
        return operation_json


class GetAllNamedOperations(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"

    def __init__(self, options=None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class GetSetExport(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport"

    def __init__(self, job_id=None, start=None, end=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id
        self.start = start
        self.end = end
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        if self.start is not None:
            operation_json["start"] = self.start
        if self.end is not None:
            operation_json["end"] = self.end
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class Min(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Min"

    def __init__(self, input=None, comparators=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.comparators = comparators

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.comparators is not None:
            operation_json["comparators"] = self.comparators
        return operation_json


class Aggregate(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Aggregate"

    def __init__(self, input=None, entities=None, edges=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.entities = entities
        self.edges = edges

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.entities is not None:
            operation_json["entities"] = self.entities
        if self.edges is not None:
            operation_json["edges"] = self.edges
        return operation_json


class GetAllElements(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"

    def __init__(self, view=None, directed_type=None, views=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.view = view
        self.directed_type = directed_type
        self.views = views

    def to_json(self):
        operation_json = super().to_json()
        if self.view is not None:
            operation_json["view"] = self.view
        if self.directed_type is not None:
            operation_json["directedType"] = self.directed_type
        if self.views is not None:
            operation_json["views"] = self.views
        return operation_json


class GetVariable(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetVariable"

    def __init__(self, variable_name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_name = variable_name

    def to_json(self):
        operation_json = super().to_json()
        if self.variable_name is not None:
            operation_json["variableName"] = self.variable_name
        return operation_json


class CountGroups(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.CountGroups"

    def __init__(self, input=None, limit=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.limit = limit

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.limit is not None:
            operation_json["limit"] = self.limit
        return operation_json


class AddNamedView(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.view.AddNamedView"

    def __init__(self, overwrite_flag=None, write_access_predicate=None, view=None, name=None, read_access_predicate=None, description=None, parameters=None, write_access_roles=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.overwrite_flag = overwrite_flag
        self.write_access_predicate = write_access_predicate
        self.view = view
        self.name = name
        self.read_access_predicate = read_access_predicate
        self.description = description
        self.parameters = parameters
        self.write_access_roles = write_access_roles

    def to_json(self):
        operation_json = super().to_json()
        if self.overwrite_flag is not None:
            operation_json["overwriteFlag"] = self.overwrite_flag
        if self.write_access_predicate is not None:
            operation_json["writeAccessPredicate"] = self.write_access_predicate
        if self.view is not None:
            operation_json["view"] = self.view
        if self.name is not None:
            operation_json["name"] = self.name
        if self.read_access_predicate is not None:
            operation_json["readAccessPredicate"] = self.read_access_predicate
        if self.description is not None:
            operation_json["description"] = self.description
        if self.parameters is not None:
            operation_json["parameters"] = self.parameters
        if self.write_access_roles is not None:
            operation_json["writeAccessRoles"] = self.write_access_roles
        return operation_json


class ToEntitySeeds(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class GenerateObjects(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects"

    def __init__(self, input=None, element_generator=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.element_generator = element_generator

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        return operation_json


class Transform(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Transform"

    def __init__(self, input=None, entities=None, edges=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.entities = entities
        self.edges = edges

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.entities is not None:
            operation_json["entities"] = self.entities
        if self.edges is not None:
            operation_json["edges"] = self.edges
        return operation_json


class GetGafferResultCacheExport(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport"

    def __init__(self, job_id=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class GetAllNamedViews(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.view.GetAllNamedViews"

    def __init__(self, options=None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class ValidateOperationChain(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain"

    def __init__(self, operation_chain=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operation_chain = operation_chain

    def to_json(self):
        operation_json = super().to_json()
        if self.operation_chain is not None:
            operation_json["operationChain"] = self.operation_chain
        return operation_json


class Reduce(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Reduce"

    def __init__(self, input=None, identity=None, aggregate_function=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.identity = identity
        self.aggregate_function = aggregate_function

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.identity is not None:
            operation_json["identity"] = self.identity
        if self.aggregate_function is not None:
            operation_json["aggregateFunction"] = self.aggregate_function
        return operation_json


class ExportToOtherGraph(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph"

    def __init__(self, schema=None, input=None, parent_store_properties_id=None, store_properties=None, parent_schema_ids=None, graph_id=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.schema = schema
        self.input = input
        self.parent_store_properties_id = parent_store_properties_id
        self.store_properties = store_properties
        self.parent_schema_ids = parent_schema_ids
        self.graph_id = graph_id
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.schema is not None:
            operation_json["schema"] = self.schema
        if self.input is not None:
            operation_json["input"] = self.input
        if self.parent_store_properties_id is not None:
            operation_json["parentStorePropertiesId"] = self.parent_store_properties_id
        if self.store_properties is not None:
            operation_json["storeProperties"] = self.store_properties
        if self.parent_schema_ids is not None:
            operation_json["parentSchemaIds"] = self.parent_schema_ids
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class DeleteNamedOperation(Operation):
    CLASS = "uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation"

    def __init__(self, operation_name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operation_name = operation_name

    def to_json(self):
        operation_json = super().to_json()
        if self.operation_name is not None:
            operation_json["operationName"] = self.operation_name
        return operation_json


class Limit(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Limit"

    def __init__(self, input=None, result_limit=None, truncate=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.result_limit = result_limit
        self.truncate = truncate

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.result_limit is not None:
            operation_json["resultLimit"] = self.result_limit
        if self.truncate is not None:
            operation_json["truncate"] = self.truncate
        return operation_json


class ToSet(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToSet"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class Count(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Count"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class Map(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Map"

    def __init__(self, input=None, functions=None, function=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.functions = functions
        self.function = function

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.functions is not None:
            operation_json["functions"] = self.functions
        if self.function is not None:
            operation_json["function"] = self.function
        return operation_json


class ToSingletonList(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class GetWalks(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetWalks"

    def __init__(self, input=None, operations=None, include_partial=None, results_limit=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.operations = operations
        self.include_partial = include_partial
        self.results_limit = results_limit

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.operations is not None:
            operation_json["operations"] = self.operations
        if self.include_partial is not None:
            operation_json["includePartial"] = self.include_partial
        if self.results_limit is not None:
            operation_json["resultsLimit"] = self.results_limit
        return operation_json


class DiscardOutput(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class GetJobResults(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults"

    def __init__(self, job_id=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class GenerateElements(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements"

    def __init__(self, input=None, element_generator=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.element_generator = element_generator

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        return operation_json


class GetAllJobDetails(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetAllJobDetails"

    def __init__(self, options=None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class ExportToSet(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"

    def __init__(self, input=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class ToMap(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToMap"

    def __init__(self, input=None, element_generator=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.element_generator = element_generator

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        return operation_json


class ExportToGafferResultCache(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"

    def __init__(self, input=None, op_auths=None, key=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.op_auths = op_auths
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.op_auths is not None:
            operation_json["opAuths"] = self.op_auths
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class ToArray(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToArray"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class GetElements(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetElements"

    def __init__(self, input=None, view=None, include_incoming_out_going=None, seed_matching=None, directed_type=None, views=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.view = view
        self.include_incoming_out_going = include_incoming_out_going
        self.seed_matching = seed_matching
        self.directed_type = directed_type
        self.views = views

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.view is not None:
            operation_json["view"] = self.view
        if self.include_incoming_out_going is not None:
            operation_json["includeIncomingOutGoing"] = self.include_incoming_out_going
        if self.seed_matching is not None:
            operation_json["seedMatching"] = self.seed_matching
        if self.directed_type is not None:
            operation_json["directedType"] = self.directed_type
        if self.views is not None:
            operation_json["views"] = self.views
        return operation_json


class While(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.While"

    def __init__(self, input=None, condition=None, conditional=None, max_repeats=None, multi_input_wrapper=None, operation=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.condition = condition
        self.conditional = conditional
        self.max_repeats = max_repeats
        self.multi_input_wrapper = multi_input_wrapper
        self.operation = operation

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.condition is not None:
            operation_json["condition"] = self.condition
        if self.conditional is not None:
            operation_json["conditional"] = self.conditional
        if self.max_repeats is not None:
            operation_json["maxRepeats"] = self.max_repeats
        if self.multi_input_wrapper is not None:
            operation_json["multiInputWrapper"] = self.multi_input_wrapper
        if self.operation is not None:
            operation_json["operation"] = self.operation
        return operation_json


class Join(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.join.Join"

    def __init__(self, flatten=None, input=None, join_type=None, match_key=None, collection_limit=None, match_method=None, operation=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.flatten = flatten
        self.input = input
        self.join_type = join_type
        self.match_key = match_key
        self.collection_limit = collection_limit
        self.match_method = match_method
        self.operation = operation

    def to_json(self):
        operation_json = super().to_json()
        if self.flatten is not None:
            operation_json["flatten"] = self.flatten
        if self.input is not None:
            operation_json["input"] = self.input
        if self.join_type is not None:
            operation_json["joinType"] = self.join_type
        if self.match_key is not None:
            operation_json["matchKey"] = self.match_key
        if self.collection_limit is not None:
            operation_json["collectionLimit"] = self.collection_limit
        if self.match_method is not None:
            operation_json["matchMethod"] = self.match_method
        if self.operation is not None:
            operation_json["operation"] = self.operation
        return operation_json


class CountAllElementsDefaultView(Operation):
    CLASS = "uk.gov.gchq.gaffer.mapstore.operation.CountAllElementsDefaultView"

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class OperationChainDAO(OperationChain):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChainDAO"

    def __init__(self, operations, options=None):
        super().__init__(operations=operations, options=options)

    def to_json(self):
        operation_chain_json = super().to_json()
        operation_chain_json.pop("class", None)
        return operation_chain_json
