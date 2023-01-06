#
# Copyright 2022 Crown Copyright
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

"""
This module has been generated with fishbowl.
To make changes, either extend these classes or change fishbowl.
"""

import typing

import gafferpy.gaffer_core
import gafferpy.gaffer_functions
import gafferpy.gaffer_operations
from gafferpy.gaffer_operations import Operation


class ImportAccumuloKeyValueFiles(Operation):
    """
    Imports Accumulo key value files

    Args:
        input_path: 
        failure_path: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.accumulostore.operation.hdfs.operation.ImportAccumuloKeyValueFiles"

    def __init__(
            self,
            input_path: str,
            failure_path: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input_path = input_path
        self.failure_path = failure_path

    def to_json(self):
        operation_json = super().to_json()
        if self.input_path is not None:
            operation_json["inputPath"] = self.input_path
        if self.failure_path is not None:
            operation_json["failurePath"] = self.failure_path
        return operation_json


class GetElementsBetweenSets(Operation):
    """
    Gets edges that exist between 2 sets and entities in the first set

    Args:
        input: 
        view: 
        include_incoming_out_going: Should the edges point towards, or away from your seeds
        input_b: 
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            view: gafferpy.gaffer_operations.View = None,
            include_incoming_out_going: str = None,
            input_b: typing.List[typing.Any] = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.view = view
        self.include_incoming_out_going = include_incoming_out_going
        self.input_b = input_b
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
        if self.input_b is not None:
            operation_json["inputB"] = self.input_b
        if self.directed_type is not None:
            operation_json["directedType"] = self.directed_type
        if self.views is not None:
            operation_json["views"] = self.views
        return operation_json


class GetElementsInRanges(Operation):
    """
    Gets elements that have vertices within a given range

    Args:
        input: 
        view: 
        include_incoming_out_going: Should the edges point towards, or away from your seeds
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsInRanges"

    def __init__(
            self,
            input: typing.List[typing.Tuple[gafferpy.gaffer_core.ElementSeed, gafferpy.gaffer_core.ElementSeed]] = None,
            view: gafferpy.gaffer_operations.View = None,
            include_incoming_out_going: str = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
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


class GetElementsWithinSet(Operation):
    """
    Gets edges with both vertices in a given set and entities with vertices in a given set

    Args:
        input: 
        view: 
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsWithinSet"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            view: gafferpy.gaffer_operations.View = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.view = view
        self.directed_type = directed_type
        self.views = views

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.view is not None:
            operation_json["view"] = self.view
        if self.directed_type is not None:
            operation_json["directedType"] = self.directed_type
        if self.views is not None:
            operation_json["views"] = self.views
        return operation_json


class SummariseGroupOverRanges(Operation):
    """
    Gets summarised Elements for each group

    Args:
        input: 
        view: 
        include_incoming_out_going: Should the edges point towards, or away from your seeds
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.accumulostore.operation.impl.SummariseGroupOverRanges"

    def __init__(
            self,
            input: typing.List[typing.Tuple[gafferpy.gaffer_core.ElementSeed, gafferpy.gaffer_core.ElementSeed]] = None,
            view: gafferpy.gaffer_operations.View = None,
            include_incoming_out_going: str = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
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


class AddGraph(Operation):
    """
    Adds a new Graph to the federated store

    Args:
        graph_id: 
        schema: 
        write_access_predicate: 
        store_properties: 
        parent_properties_id: 
        read_access_predicate: 
        graph_auths: 
        is_public: 
        parent_schema_ids: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.AddGraph"

    def __init__(
            self,
            graph_id: str,
            schema: typing.Dict = None,
            write_access_predicate: typing.Any = None,
            store_properties: typing.Dict = None,
            parent_properties_id: str = None,
            read_access_predicate: typing.Any = None,
            graph_auths: typing.Set[str] = None,
            is_public: bool = None,
            parent_schema_ids: typing.List[str] = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.schema = schema
        self.write_access_predicate = write_access_predicate
        self.store_properties = store_properties
        self.parent_properties_id = parent_properties_id
        self.read_access_predicate = read_access_predicate
        self.graph_auths = graph_auths
        self.is_public = is_public
        self.parent_schema_ids = parent_schema_ids
        self.graph_id = graph_id
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.schema is not None:
            operation_json["schema"] = self.schema
        if self.write_access_predicate is not None:
            operation_json["writeAccessPredicate"] = self.write_access_predicate
        if self.store_properties is not None:
            operation_json["storeProperties"] = self.store_properties
        if self.parent_properties_id is not None:
            operation_json["parentPropertiesId"] = self.parent_properties_id
        if self.read_access_predicate is not None:
            operation_json["readAccessPredicate"] = self.read_access_predicate
        if self.graph_auths is not None:
            operation_json["graphAuths"] = self.graph_auths
        if self.is_public is not None:
            operation_json["isPublic"] = self.is_public
        if self.parent_schema_ids is not None:
            operation_json["parentSchemaIds"] = self.parent_schema_ids
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class AddGraphWithHooks(Operation):
    """
    Adds a new Graph with hooks to the federated store

    Args:
        schema: 
        write_access_predicate: 
        store_properties: 
        parent_properties_id: 
        read_access_predicate: 
        graph_auths: 
        is_public: 
        parent_schema_ids: 
        graph_id: 
        hooks: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.AddGraphWithHooks"

    def __init__(
            self,
            schema: typing.Dict = None,
            write_access_predicate: typing.Any = None,
            store_properties: typing.Dict = None,
            parent_properties_id: str = None,
            read_access_predicate: typing.Any = None,
            graph_auths: typing.Set[str] = None,
            is_public: bool = None,
            parent_schema_ids: typing.List[str] = None,
            graph_id: str = None,
            hooks: typing.List[typing.Any] = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.schema = schema
        self.write_access_predicate = write_access_predicate
        self.store_properties = store_properties
        self.parent_properties_id = parent_properties_id
        self.read_access_predicate = read_access_predicate
        self.graph_auths = graph_auths
        self.is_public = is_public
        self.parent_schema_ids = parent_schema_ids
        self.graph_id = graph_id
        self.hooks = hooks
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.schema is not None:
            operation_json["schema"] = self.schema
        if self.write_access_predicate is not None:
            operation_json["writeAccessPredicate"] = self.write_access_predicate
        if self.store_properties is not None:
            operation_json["storeProperties"] = self.store_properties
        if self.parent_properties_id is not None:
            operation_json["parentPropertiesId"] = self.parent_properties_id
        if self.read_access_predicate is not None:
            operation_json["readAccessPredicate"] = self.read_access_predicate
        if self.graph_auths is not None:
            operation_json["graphAuths"] = self.graph_auths
        if self.is_public is not None:
            operation_json["isPublic"] = self.is_public
        if self.parent_schema_ids is not None:
            operation_json["parentSchemaIds"] = self.parent_schema_ids
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.hooks is not None:
            operation_json["hooks"] = self.hooks
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class ChangeGraphAccess(Operation):
    """
    Changes the protection used for accessing graphs

    Args:
        graph_id: 
        owner_user_id: 
        graph_auths: 
        is_public: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Boolean
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.ChangeGraphAccess"

    def __init__(
            self,
            graph_id: str,
            owner_user_id: str = None,
            graph_auths: typing.Set[str] = None,
            is_public: bool = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.owner_user_id = owner_user_id
        self.graph_auths = graph_auths
        self.is_public = is_public
        self.graph_id = graph_id
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.owner_user_id is not None:
            operation_json["ownerUserId"] = self.owner_user_id
        if self.graph_auths is not None:
            operation_json["graphAuths"] = self.graph_auths
        if self.is_public is not None:
            operation_json["isPublic"] = self.is_public
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class ChangeGraphId(Operation):
    """
    Changes the Id of a graph

    Args:
        graph_id: 
        new_graph_id: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Boolean
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.ChangeGraphId"

    def __init__(
            self,
            graph_id: str,
            new_graph_id: str = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.new_graph_id = new_graph_id
        self.graph_id = graph_id
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.new_graph_id is not None:
            operation_json["newGraphId"] = self.new_graph_id
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class FederatedOperation(Operation):
    """
    Federates a payload operation across given graphs and merges the results with a given function.

    Args:
        skip_failed_federated_execution: 
        input: 
        graph_ids: 
        operation: 
        merge_function: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.FederatedOperation"

    def __init__(
            self,
            skip_failed_federated_execution: typing.Any = None,
            input: typing.Any = None,
            graph_ids: typing.List[str] = None,
            operation: gafferpy.gaffer_operations.Operation = None,
            merge_function: typing.Any = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.skip_failed_federated_execution = skip_failed_federated_execution
        self.input = input
        self.graph_ids = graph_ids
        self.operation = operation
        self.merge_function = merge_function
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.skip_failed_federated_execution is not None:
            operation_json["skipFailedFederatedExecution"] = self.skip_failed_federated_execution
        if self.input is not None:
            operation_json["input"] = self.input
        if self.graph_ids is not None:
            operation_json["graphIds"] = self.graph_ids
        if self.operation is not None:
            operation_json["operation"] = self.operation
        if self.merge_function is not None:
            operation_json["mergeFunction"] = self.merge_function
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class GetAllGraphIds(Operation):
    """
    Gets the ids of all available Graphs from a federated store

    Args:
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.lang.String>
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.GetAllGraphIds"

    def __init__(
            self,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class GetAllGraphInfo(Operation):
    """
    Gets graph info of selected Graphs from the FederatedStore

    Args:
        graph_ids: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.util.Map<java.lang.String,java.lang.Object>
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.GetAllGraphInfo"

    def __init__(
            self,
            graph_ids: typing.List[str] = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_ids = graph_ids
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.graph_ids is not None:
            operation_json["graphIds"] = self.graph_ids
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class RemoveGraph(Operation):
    """
    Removes a Graph from the federated store

    Args:
        graph_id: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Boolean
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.RemoveGraph"

    def __init__(
            self,
            graph_id: str,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_id = graph_id
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class RemoveGraphAndDeleteAllData(Operation):
    """
    Used to tell a graph to delete all data, before being removed.

    Args:
        graph_id: 
        user_requesting_admin_usage: 
        options: Additional map of options
    Returns:
        java.lang.Boolean
    """
    CLASS = "uk.gov.gchq.gaffer.federatedstore.operation.RemoveGraphAndDeleteAllData"

    def __init__(
            self,
            graph_id: str = None,
            user_requesting_admin_usage: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_id = graph_id
        self.user_requesting_admin_usage = user_requesting_admin_usage

    def to_json(self):
        operation_json = super().to_json()
        if self.graph_id is not None:
            operation_json["graphId"] = self.graph_id
        if self.user_requesting_admin_usage is not None:
            operation_json["userRequestingAdminUsage"] = self.user_requesting_admin_usage
        return operation_json


class AddElementsFromHdfs(Operation):
    """
    Adds elements from hdfs

    Args:
        job_initialiser: 
        input_mapper_pairs: 
        failure_path: 
        output_path: 
        splits_file_path: 
        num_map_tasks: 
        working_path: 
        min_reduce_tasks: 
        max_reduce_tasks: 
        min_map_tasks: 
        use_provided_splits: 
        command_line_args: 
        partitioner: 
        max_map_tasks: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.hdfs.operation.AddElementsFromHdfs"

    def __init__(
            self,
            job_initialiser: typing.Any,
            input_mapper_pairs: typing.Dict[str, str],
            failure_path: str,
            output_path: str,
            splits_file_path: str = None,
            num_map_tasks: int = None,
            working_path: str = None,
            min_reduce_tasks: int = None,
            max_reduce_tasks: int = None,
            min_map_tasks: int = None,
            use_provided_splits: bool = None,
            command_line_args: typing.List[str] = None,
            partitioner: typing.Any = None,
            max_map_tasks: int = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_initialiser = job_initialiser
        self.splits_file_path = splits_file_path
        self.num_map_tasks = num_map_tasks
        self.working_path = working_path
        self.input_mapper_pairs = input_mapper_pairs
        self.min_reduce_tasks = min_reduce_tasks
        self.max_reduce_tasks = max_reduce_tasks
        self.min_map_tasks = min_map_tasks
        self.use_provided_splits = use_provided_splits
        self.command_line_args = command_line_args
        self.failure_path = failure_path
        self.output_path = output_path
        self.partitioner = partitioner
        self.max_map_tasks = max_map_tasks
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.job_initialiser is not None:
            operation_json["jobInitialiser"] = self.job_initialiser
        if self.splits_file_path is not None:
            operation_json["splitsFilePath"] = self.splits_file_path
        if self.num_map_tasks is not None:
            operation_json["numMapTasks"] = self.num_map_tasks
        if self.working_path is not None:
            operation_json["workingPath"] = self.working_path
        if self.input_mapper_pairs is not None:
            operation_json["inputMapperPairs"] = self.input_mapper_pairs
        if self.min_reduce_tasks is not None:
            operation_json["minReduceTasks"] = self.min_reduce_tasks
        if self.max_reduce_tasks is not None:
            operation_json["maxReduceTasks"] = self.max_reduce_tasks
        if self.min_map_tasks is not None:
            operation_json["minMapTasks"] = self.min_map_tasks
        if self.use_provided_splits is not None:
            operation_json["useProvidedSplits"] = self.use_provided_splits
        if self.command_line_args is not None:
            operation_json["commandLineArgs"] = self.command_line_args
        if self.failure_path is not None:
            operation_json["failurePath"] = self.failure_path
        if self.output_path is not None:
            operation_json["outputPath"] = self.output_path
        if self.partitioner is not None:
            operation_json["partitioner"] = self.partitioner
        if self.max_map_tasks is not None:
            operation_json["maxMapTasks"] = self.max_map_tasks
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class SampleDataForSplitPoints(Operation):
    """
    Creates a splits file by sampling given data

    Args:
        splits_file_path: 
        job_initialiser: 
        input_mapper_pairs: 
        output_path: 
        num_map_tasks: 
        min_reduce_tasks: 
        num_splits: 
        max_reduce_tasks: 
        min_map_tasks: 
        use_provided_splits: 
        command_line_args: 
        compression_codec: 
        partitioner: 
        proportion_to_sample: 
        max_map_tasks: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.hdfs.operation.SampleDataForSplitPoints"

    def __init__(
            self,
            splits_file_path: str,
            job_initialiser: typing.Any,
            input_mapper_pairs: typing.Dict[str, str],
            output_path: str,
            num_map_tasks: int = None,
            min_reduce_tasks: int = None,
            num_splits: int = None,
            max_reduce_tasks: int = None,
            min_map_tasks: int = None,
            use_provided_splits: bool = None,
            command_line_args: typing.List[str] = None,
            compression_codec: typing.Any = None,
            partitioner: typing.Any = None,
            proportion_to_sample: float = None,
            max_map_tasks: int = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.splits_file_path = splits_file_path
        self.job_initialiser = job_initialiser
        self.num_map_tasks = num_map_tasks
        self.input_mapper_pairs = input_mapper_pairs
        self.min_reduce_tasks = min_reduce_tasks
        self.num_splits = num_splits
        self.max_reduce_tasks = max_reduce_tasks
        self.min_map_tasks = min_map_tasks
        self.use_provided_splits = use_provided_splits
        self.command_line_args = command_line_args
        self.output_path = output_path
        self.compression_codec = compression_codec
        self.partitioner = partitioner
        self.proportion_to_sample = proportion_to_sample
        self.max_map_tasks = max_map_tasks
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.splits_file_path is not None:
            operation_json["splitsFilePath"] = self.splits_file_path
        if self.job_initialiser is not None:
            operation_json["jobInitialiser"] = self.job_initialiser
        if self.num_map_tasks is not None:
            operation_json["numMapTasks"] = self.num_map_tasks
        if self.input_mapper_pairs is not None:
            operation_json["inputMapperPairs"] = self.input_mapper_pairs
        if self.min_reduce_tasks is not None:
            operation_json["minReduceTasks"] = self.min_reduce_tasks
        if self.num_splits is not None:
            operation_json["numSplits"] = self.num_splits
        if self.max_reduce_tasks is not None:
            operation_json["maxReduceTasks"] = self.max_reduce_tasks
        if self.min_map_tasks is not None:
            operation_json["minMapTasks"] = self.min_map_tasks
        if self.use_provided_splits is not None:
            operation_json["useProvidedSplits"] = self.use_provided_splits
        if self.command_line_args is not None:
            operation_json["commandLineArgs"] = self.command_line_args
        if self.output_path is not None:
            operation_json["outputPath"] = self.output_path
        if self.compression_codec is not None:
            operation_json["compressionCodec"] = self.compression_codec
        if self.partitioner is not None:
            operation_json["partitioner"] = self.partitioner
        if self.proportion_to_sample is not None:
            operation_json["proportionToSample"] = self.proportion_to_sample
        if self.max_map_tasks is not None:
            operation_json["maxMapTasks"] = self.max_map_tasks
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class CountAllElementsDefaultView(Operation):
    """
    Counts all elements

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Long
    """
    CLASS = "uk.gov.gchq.gaffer.mapstore.operation.CountAllElementsDefaultView"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class AddNamedOperation(Operation):
    """
    Adds a new named operation

    Args:
        overwrite_flag: 
        write_access_predicate: 
        score: 
        read_access_roles: 
        read_access_predicate: 
        description: 
        operation_name: 
        operation_chain: 
        parameters: 
        write_access_roles: 
        labels: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.named.operation.AddNamedOperation"

    def __init__(
            self,
            overwrite_flag: bool = None,
            write_access_predicate: typing.Any = None,
            score: int = None,
            read_access_roles: typing.List[str] = None,
            read_access_predicate: typing.Any = None,
            description: str = None,
            operation_name: str = None,
            operation_chain: typing.Any = None,
            parameters: typing.Dict[str, typing.Any] = None,
            write_access_roles: typing.List[str] = None,
            labels: typing.List[str] = None,
            options: typing.Dict[str, str] = None):
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


class DeleteNamedOperation(Operation):
    """
    Deletes a named operation

    Args:
        operation_name: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation"

    def __init__(
            self,
            operation_name: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operation_name = operation_name

    def to_json(self):
        operation_json = super().to_json()
        if self.operation_name is not None:
            operation_json["operationName"] = self.operation_name
        return operation_json


class GetAllNamedOperations(Operation):
    """
    Gets all available named operations

    Args:
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.named.operation.NamedOperationDetail>
    """
    CLASS = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class NamedOperation(Operation):
    """
    Runs a named operation

    Args:
        operation_name: 
        input: 
        parameters: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.named.operation.NamedOperation"

    def __init__(
            self,
            operation_name: str,
            input: typing.List[typing.Any] = None,
            parameters: typing.Dict[str, typing.Any] = None,
            options: typing.Dict[str, str] = None):
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


class AddNamedView(Operation):
    """
    Adds a new named view

    Args:
        view: 
        name: 
        overwrite_flag: 
        write_access_predicate: 
        read_access_predicate: 
        description: 
        parameters: 
        write_access_roles: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.named.view.AddNamedView"

    def __init__(
            self,
            view: typing.Any,
            name: str,
            overwrite_flag: bool = None,
            write_access_predicate: typing.Any = None,
            read_access_predicate: typing.Any = None,
            description: str = None,
            parameters: typing.Dict[str, typing.Any] = None,
            write_access_roles: typing.List[str] = None,
            options: typing.Dict[str, str] = None):
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


class DeleteNamedView(Operation):
    """
    Deletes a named view

    Args:
        name: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.named.view.DeleteNamedView"

    def __init__(
            self,
            name: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.name = name

    def to_json(self):
        operation_json = super().to_json()
        if self.name is not None:
            operation_json["name"] = self.name
        return operation_json


class GetAllNamedViews(Operation):
    """
    Gets all available named views

    Args:
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.elementdefinition.view.NamedViewDetail>
    """
    CLASS = "uk.gov.gchq.gaffer.named.view.GetAllNamedViews"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class OperationChain(Operation):
    """
    A chain of operations where the results are passed between each operation

    Args:
        operations: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChain"

    def __init__(
            self,
            operations: typing.List[gafferpy.gaffer_operations.Operation] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operations = operations

    def to_json(self):
        operation_json = super().to_json()
        if self.operations is not None:
            operation_json["operations"] = self.operations
        return operation_json


class ExportToOtherAuthorisedGraph(Operation):
    """
    Exports elements to another authorised Graph

    Args:
        graph_id: 
        input: 
        parent_store_properties_id: 
        parent_schema_ids: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph"

    def __init__(
            self,
            graph_id: str,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            parent_store_properties_id: str = None,
            parent_schema_ids: typing.List[str] = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class ExportToOtherGraph(Operation):
    """
    Exports elements to another Graph

    Args:
        graph_id: 
        schema: 
        input: 
        parent_store_properties_id: 
        store_properties: 
        parent_schema_ids: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph"

    def __init__(
            self,
            graph_id: str,
            schema: typing.Dict = None,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            parent_store_properties_id: str = None,
            store_properties: typing.Dict = None,
            parent_schema_ids: typing.List[str] = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class Count(Operation):
    """
    Counts the number of items

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Long
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Count"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class CountGroups(Operation):
    """
    Counts the different element groups

    Args:
        input: 
        limit: 
        options: Additional map of options
    Returns:
        uk.gov.gchq.gaffer.data.GroupCounts
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.CountGroups"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            limit: int = None,
            options: typing.Dict[str, str] = None):
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


class DiscardOutput(Operation):
    """
    Discards the results from the previous operation

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"

    def __init__(
            self,
            input: typing.Any = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ForEach(Operation):
    """
    Runs supplied operation on Iterable of inputs

    Args:
        input: 
        operation: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.ForEach"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            operation: gafferpy.gaffer_operations.Operation = None,
            options: typing.Dict[str, str] = None):
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


class GenerateSplitPointsFromSample(Operation):
    """
    Generates split points from the supplied Iterable

    Args:
        input: 
        num_splits: 
        options: Additional map of options
    Returns:
        java.util.List<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GenerateSplitPointsFromSample"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            num_splits: int = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.num_splits = num_splits

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.num_splits is not None:
            operation_json["numSplits"] = self.num_splits
        return operation_json


class GetVariable(Operation):
    """
    Gets a variable from the Context variable map

    Args:
        variable_name: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetVariable"

    def __init__(
            self,
            variable_name: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_name = variable_name

    def to_json(self):
        operation_json = super().to_json()
        if self.variable_name is not None:
            operation_json["variableName"] = self.variable_name
        return operation_json


class GetVariables(Operation):
    """
    Gets all variables from the Context variable map

    Args:
        variable_names: 
        options: Additional map of options
    Returns:
        java.util.Map<java.lang.String,java.lang.Object>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetVariables"

    def __init__(
            self,
            variable_names: typing.List[str] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_names = variable_names

    def to_json(self):
        operation_json = super().to_json()
        if self.variable_names is not None:
            operation_json["variableNames"] = self.variable_names
        return operation_json


class GetWalks(Operation):
    """
    Walks around the Graph, returning the full walks taken

    Args:
        input: 
        operations: 
        include_partial: 
        conditional: 
        results_limit: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.graph.Walk>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.GetWalks"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            operations: typing.Any = None,
            include_partial: bool = None,
            conditional: gafferpy.gaffer_operations.Conditional = None,
            results_limit: int = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.operations = operations
        self.include_partial = include_partial
        self.conditional = conditional
        self.results_limit = results_limit

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.operations is not None:
            operation_json["operations"] = self.operations
        if self.include_partial is not None:
            operation_json["includePartial"] = self.include_partial
        if self.conditional is not None:
            operation_json["conditional"] = self.conditional
        if self.results_limit is not None:
            operation_json["resultsLimit"] = self.results_limit
        return operation_json


class If(Operation):
    """
    Conditionally runs an operation or an alternative operation

    Args:
        otherwise: 
        input: 
        condition: 
        conditional: 
        multi_input_wrapper: 
        then: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.If"

    def __init__(
            self,
            otherwise: gafferpy.gaffer_operations.Operation = None,
            input: typing.Any = None,
            condition: bool = None,
            conditional: gafferpy.gaffer_operations.Conditional = None,
            multi_input_wrapper: typing.Any = None,
            then: gafferpy.gaffer_operations.Operation = None,
            options: typing.Dict[str, str] = None):
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


class Limit(Operation):
    """
    Limits the number of items

    Args:
        result_limit: 
        input: 
        truncate: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Limit"

    def __init__(
            self,
            result_limit: int,
            input: typing.List[typing.Any] = None,
            truncate: bool = None,
            options: typing.Dict[str, str] = None):
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


class Map(Operation):
    """
    Maps an input to an output using provided functions

    Args:
        functions: 
        input: 
        function: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Map"

    def __init__(
            self,
            functions: typing.List[typing.Any],
            input: typing.Any = None,
            function: typing.Any = None,
            options: typing.Dict[str, str] = None):
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


class Reduce(Operation):
    """
    Reduces an input to an output with a single value using provided function

    Args:
        aggregate_function: 
        input: 
        identity: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Reduce"

    def __init__(
            self,
            aggregate_function: gafferpy.gaffer_binaryoperators.BinaryOperator,
            input: typing.List[typing.Any] = None,
            identity: typing.Any = None,
            options: typing.Dict[str, str] = None):
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


class SampleElementsForSplitPoints(Operation):
    """
    Samples an iterable of elements and generates split points

    Args:
        input: 
        num_splits: 
        proportion_to_sample: 
        options: Additional map of options
    Returns:
        java.util.List<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.SampleElementsForSplitPoints"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            num_splits: int = None,
            proportion_to_sample: float = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.num_splits = num_splits
        self.proportion_to_sample = proportion_to_sample

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.num_splits is not None:
            operation_json["numSplits"] = self.num_splits
        if self.proportion_to_sample is not None:
            operation_json["proportionToSample"] = self.proportion_to_sample
        return operation_json


class ScoreOperationChain(Operation):
    """
    Scores an OperationChain

    Args:
        operation_chain: A chain of operations where the results are passed between each operation
        options: Additional map of options
    Returns:
        java.lang.Integer
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.ScoreOperationChain"

    def __init__(
            self,
            operation_chain: gafferpy.generated_api.operations.OperationChain = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operation_chain = operation_chain

    def to_json(self):
        operation_json = super().to_json()
        if self.operation_chain is not None:
            operation_json["operationChain"] = self.operation_chain
        return operation_json


class SetVariable(Operation):
    """
    Sets a variable in the Context

    Args:
        input: 
        variable_name: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.SetVariable"

    def __init__(
            self,
            input: typing.Any = None,
            variable_name: str = None,
            options: typing.Dict[str, str] = None):
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


class SplitStoreFromFile(Operation):
    """
    Splits a store based on a file of split points

    Args:
        input_path: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.SplitStoreFromFile"

    def __init__(
            self,
            input_path: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input_path = input_path

    def to_json(self):
        operation_json = super().to_json()
        if self.input_path is not None:
            operation_json["inputPath"] = self.input_path
        return operation_json


class SplitStoreFromIterable(Operation):
    """
    Splits a store based on an iterable of split points

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.SplitStoreFromIterable"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class Validate(Operation):
    """
    Validates elements based on the schema

    Args:
        input: 
        skip_invalid_elements: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.Validate"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            skip_invalid_elements: bool = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
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


class ValidateOperationChain(Operation):
    """
    Validates an OperationChain

    Args:
        operation_chain: A chain of operations where the results are passed between each operation
        options: Additional map of options
    Returns:
        uk.gov.gchq.koryphe.ValidationResult
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain"

    def __init__(
            self,
            operation_chain: gafferpy.generated_api.operations.OperationChain,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.operation_chain = operation_chain

    def to_json(self):
        operation_json = super().to_json()
        if self.operation_chain is not None:
            operation_json["operationChain"] = self.operation_chain
        return operation_json


class While(Operation):
    """
    Repeatedly executes an operation while a condition is met

    Args:
        input: 
        condition: 
        conditional: 
        max_repeats: 
        multi_input_wrapper: 
        operation: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.While"

    def __init__(
            self,
            input: typing.Any = None,
            condition: bool = None,
            conditional: gafferpy.gaffer_operations.Conditional = None,
            max_repeats: int = None,
            multi_input_wrapper: typing.Any = None,
            operation: gafferpy.gaffer_operations.Operation = None,
            options: typing.Dict[str, str] = None):
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


class AddElements(Operation):
    """
    Adds elements

    Args:
        input: 
        skip_invalid_elements: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.AddElements"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            skip_invalid_elements: bool = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
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


class AddElementsFromFile(Operation):
    """
    Adds elements from a file

    Args:
        element_generator: 
        filename: 
        parallelism: 
        skip_invalid_elements: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromFile"

    def __init__(
            self,
            element_generator: typing.Any,
            filename: str,
            parallelism: int = None,
            skip_invalid_elements: bool = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.element_generator = element_generator
        self.filename = filename
        self.parallelism = parallelism
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        if self.filename is not None:
            operation_json["filename"] = self.filename
        if self.parallelism is not None:
            operation_json["parallelism"] = self.parallelism
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class AddElementsFromKafka(Operation):
    """
    Adds elements from Kafka

    Args:
        element_generator: 
        bootstrap_servers: 
        group_id: 
        topic: 
        parallelism: 
        consume_as: 
        skip_invalid_elements: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromKafka"

    def __init__(
            self,
            element_generator: typing.Any,
            bootstrap_servers: typing.List[str],
            group_id: str,
            topic: str,
            parallelism: int = None,
            consume_as: typing.Any = None,
            skip_invalid_elements: bool = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.element_generator = element_generator
        self.bootstrap_servers = bootstrap_servers
        self.group_id = group_id
        self.parallelism = parallelism
        self.topic = topic
        self.consume_as = consume_as
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        if self.bootstrap_servers is not None:
            operation_json["bootstrapServers"] = self.bootstrap_servers
        if self.group_id is not None:
            operation_json["groupId"] = self.group_id
        if self.parallelism is not None:
            operation_json["parallelism"] = self.parallelism
        if self.topic is not None:
            operation_json["topic"] = self.topic
        if self.consume_as is not None:
            operation_json["consumeAs"] = self.consume_as
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class AddElementsFromSocket(Operation):
    """
    Adds elements from a socket

    Args:
        element_generator: 
        hostname: 
        port: 
        delimiter: 
        parallelism: 
        skip_invalid_elements: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromSocket"

    def __init__(
            self,
            element_generator: typing.Any,
            hostname: str,
            port: int,
            delimiter: str = None,
            parallelism: int = None,
            skip_invalid_elements: bool = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.element_generator = element_generator
        self.hostname = hostname
        self.port = port
        self.delimiter = delimiter
        self.parallelism = parallelism
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        if self.hostname is not None:
            operation_json["hostname"] = self.hostname
        if self.port is not None:
            operation_json["port"] = self.port
        if self.delimiter is not None:
            operation_json["delimiter"] = self.delimiter
        if self.parallelism is not None:
            operation_json["parallelism"] = self.parallelism
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class CsvToElements(Operation):
    """
    Adds elements from a openCypher CSV file

    Args:
        input: 
        trim: 
        delimiter: 
        null_string: 
        skip_invalid_elements: 
        csv_format: 
        validate: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.add.CsvToElements"

    def __init__(
            self,
            input: typing.List[str] = None,
            trim: bool = None,
            delimiter: str = None,
            null_string: str = None,
            skip_invalid_elements: bool = None,
            csv_format: typing.Any = None,
            validate: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.trim = trim
        self.delimiter = delimiter
        self.null_string = null_string
        self.skip_invalid_elements = skip_invalid_elements
        self.csv_format = csv_format
        self.validate = validate

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.trim is not None:
            operation_json["trim"] = self.trim
        if self.delimiter is not None:
            operation_json["delimiter"] = self.delimiter
        if self.null_string is not None:
            operation_json["nullString"] = self.null_string
        if self.skip_invalid_elements is not None:
            operation_json["skipInvalidElements"] = self.skip_invalid_elements
        if self.csv_format is not None:
            operation_json["csvFormat"] = self.csv_format
        if self.validate is not None:
            operation_json["validate"] = self.validate
        return operation_json


class Max(Operation):
    """
    Extracts the maximum element based on provided Comparators

    Args:
        comparators: 
        input: 
        options: Additional map of options
    Returns:
        uk.gov.gchq.gaffer.data.element.Element
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Max"

    def __init__(
            self,
            comparators: typing.Any,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            options: typing.Dict[str, str] = None):
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


class Min(Operation):
    """
    Extracts the minimum element based on provided Comparators

    Args:
        comparators: 
        input: 
        options: Additional map of options
    Returns:
        uk.gov.gchq.gaffer.data.element.Element
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Min"

    def __init__(
            self,
            comparators: typing.Any,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            options: typing.Dict[str, str] = None):
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


class Sort(Operation):
    """
    Sorts elements based on provided Comparators and can be used to extract the top 'n' elements

    Args:
        comparators: 
        input: 
        result_limit: 
        deduplicate: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.compare.Sort"

    def __init__(
            self,
            comparators: typing.Any,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            result_limit: int = None,
            deduplicate: bool = None,
            options: typing.Dict[str, str] = None):
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


class GetExports(Operation):
    """
    Fetches multiple exports

    Args:
        get_exports: 
        options: Additional map of options
    Returns:
        java.util.Map<java.lang.String,java.util.Set<java.lang.Object>>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.GetExports"

    def __init__(
            self,
            get_exports: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.get_exports = get_exports

    def to_json(self):
        operation_json = super().to_json()
        if self.get_exports is not None:
            operation_json["getExports"] = self.get_exports
        return operation_json


class ExportToLocalFile(Operation):
    """
    Exports elements to a local file

    Args:
        file_path: 
        input: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.lang.String>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.localfile.ExportToLocalFile"

    def __init__(
            self,
            file_path: str,
            input: typing.List[str] = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.file_path = file_path
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.file_path is not None:
            operation_json["filePath"] = self.file_path
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class ImportFromLocalFile(Operation):
    """
    Fetches data from a local file

    Args:
        file_path: 
        job_id: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.lang.String>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.localfile.ImportFromLocalFile"

    def __init__(
            self,
            file_path: str,
            job_id: str = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id
        self.file_path = file_path
        self.key = key

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        if self.file_path is not None:
            operation_json["filePath"] = self.file_path
        if self.key is not None:
            operation_json["key"] = self.key
        return operation_json


class ExportToGafferResultCache(Operation):
    """
    Exports to a cache backed by a Gaffer graph

    Args:
        input: 
        op_auths: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"

    def __init__(
            self,
            input: typing.Any = None,
            op_auths: typing.Set[str] = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class GetGafferResultCacheExport(Operation):
    """
    Fetches data from a Gaffer result cache

    Args:
        job_id: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport"

    def __init__(
            self,
            job_id: str = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class ExportToSet(Operation):
    """
    Exports results to a Set

    Args:
        input: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Object
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet"

    def __init__(
            self,
            input: typing.Any = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class GetSetExport(Operation):
    """
    Fetches data from a Set cache

    Args:
        job_id: 
        start: 
        end: 
        key: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport"

    def __init__(
            self,
            job_id: str = None,
            start: int = None,
            end: int = None,
            key: str = None,
            options: typing.Dict[str, str] = None):
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


class Aggregate(Operation):
    """
    Aggregates elements

    Args:
        input: 
        entities: 
        edges: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Aggregate"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            entities: typing.Dict[str, gafferpy.gaffer_operations.AggregatePair] = None,
            edges: typing.Dict[str, gafferpy.gaffer_operations.AggregatePair] = None,
            options: typing.Dict[str, str] = None):
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


class Filter(Operation):
    """
    Filters elements

    Args:
        input: 
        global_edges: 
        global_entities: 
        entities: 
        edges: 
        global_elements: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Filter"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            global_edges: gafferpy.generated_api.predicates.ElementFilter = None,
            global_entities: gafferpy.generated_api.predicates.ElementFilter = None,
            entities: typing.Dict[str, gafferpy.generated_api.predicates.ElementFilter] = None,
            edges: typing.Dict[str, gafferpy.generated_api.predicates.ElementFilter] = None,
            global_elements: gafferpy.generated_api.predicates.ElementFilter = None,
            options: typing.Dict[str, str] = None):
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


class Transform(Operation):
    """
    Transforms elements

    Args:
        input: 
        entities: 
        edges: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.function.Transform"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            entities: typing.Dict[str, gafferpy.generated_api.functions.ElementTransformer] = None,
            edges: typing.Dict[str, gafferpy.generated_api.functions.ElementTransformer] = None,
            options: typing.Dict[str, str] = None):
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


class GenerateElements(Operation):
    """
    Generates elements from objects using provided generators

    Args:
        element_generator: 
        input: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements"

    def __init__(
            self,
            element_generator: typing.Any,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
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


class GenerateObjects(Operation):
    """
    Generates objects from elements using provided generators

    Args:
        element_generator: 
        input: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects"

    def __init__(
            self,
            element_generator: typing.Any,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            options: typing.Dict[str, str] = None):
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


class GetAdjacentIds(Operation):
    """
    Performs a single hop down related edges

    Args:
        input: 
        view: 
        include_incoming_out_going: Should the edges point towards, or away from your seeds
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.id.EntityId>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            view: gafferpy.gaffer_operations.View = None,
            include_incoming_out_going: str = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
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


class GetAllElements(Operation):
    """
    Gets all elements compatible with a provided View

    Args:
        view: 
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"

    def __init__(
            self,
            view: gafferpy.gaffer_operations.View = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
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


class GetElements(Operation):
    """
    Gets elements related to provided seeds

    Args:
        input: 
        view: 
        include_incoming_out_going: Should the edges point towards, or away from your seeds
        directed_type: Is the Edge directed?
        views: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.data.element.Element>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetElements"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            view: gafferpy.gaffer_operations.View = None,
            include_incoming_out_going: str = None,
            directed_type: str = None,
            views: typing.List[gafferpy.gaffer_operations.View] = None,
            options: typing.Dict[str, str] = None):
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


class GetFromEndpoint(Operation):
    """
    Gets data from an endpoint

    Args:
        endpoint: 
        options: Additional map of options
    Returns:
        java.lang.String
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetFromEndpoint"

    def __init__(
            self,
            endpoint: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.endpoint = endpoint

    def to_json(self):
        operation_json = super().to_json()
        if self.endpoint is not None:
            operation_json["endpoint"] = self.endpoint
        return operation_json


class CancelScheduledJob(Operation):
    """
    Cancels a scheduled job

    Args:
        job_id: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.CancelScheduledJob"

    def __init__(
            self,
            job_id: str,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class GetAllJobDetails(Operation):
    """
    Gets all running and historic job details

    Args:
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.jobtracker.JobDetail>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetAllJobDetails"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class GetJobDetails(Operation):
    """
    Gets the details of a single job

    Args:
        job_id: 
        options: Additional map of options
    Returns:
        uk.gov.gchq.gaffer.jobtracker.JobDetail
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails"

    def __init__(
            self,
            job_id: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class GetJobResults(Operation):
    """
    Gets the results of a job

    Args:
        job_id: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults"

    def __init__(
            self,
            job_id: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json["jobId"] = self.job_id
        return operation_json


class Join(Operation):
    """
    Joins two iterables based on a join type

    Args:
        flatten: 
        input: 
        join_type: 
        match_key: 
        collection_limit: 
        match_method: 
        operation: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.join.Join"

    def __init__(
            self,
            flatten: bool = None,
            input: typing.List[typing.Any] = None,
            join_type: str = None,
            match_key: str = None,
            collection_limit: int = None,
            match_method: typing.Any = None,
            operation: gafferpy.gaffer_operations.Operation = None,
            options: typing.Dict[str, str] = None):
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


class ToArray(Operation):
    """
    Converts an Iterable to an Array

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Object[]
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToArray"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToCsv(Operation):
    """
    Converts elements to CSV Strings

    Args:
        input: 
        element_generator: Generates a CSV string for each element
        include_header: 
        csv_format: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.lang.String>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToCsv"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            element_generator: gafferpy.generated_api.functions.CsvGenerator = None,
            include_header: bool = None,
            csv_format: typing.Any = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.element_generator = element_generator
        self.include_header = include_header
        self.csv_format = csv_format

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.element_generator is not None:
            operation_json["elementGenerator"] = self.element_generator
        if self.include_header is not None:
            operation_json["includeHeader"] = self.include_header
        if self.csv_format is not None:
            operation_json["csvFormat"] = self.csv_format
        return operation_json


class ToEntitySeeds(Operation):
    """
    Converts an objects into EntitySeeds

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<uk.gov.gchq.gaffer.operation.data.EntitySeed>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToList(Operation):
    """
    Converts an Iterable to a List

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.util.List<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToList"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToMap(Operation):
    """
    Converts elements to a Map of key-value pairs

    Args:
        element_generator: Generates a Map for each element
        input: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.util.Map<java.lang.String,java.lang.Object>>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToMap"

    def __init__(
            self,
            element_generator: gafferpy.generated_api.functions.MapGenerator,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            options: typing.Dict[str, str] = None):
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


class ToOpenCypherCsv(Operation):
    """
    Converts elements to CSV Strings

    Args:
        input: 
        neo4j_format: 
        options: Additional map of options
    Returns:
        java.lang.Iterable<java.lang.String>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToOpenCypherCsv"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.Element] = None,
            neo4j_format: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.neo4j_format = neo4j_format

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        if self.neo4j_format is not None:
            operation_json["neo4jFormat"] = self.neo4j_format
        return operation_json


class ToSet(Operation):
    """
    Converts an Iterable to a Set

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.util.Set<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToSet"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToSingletonList(Operation):
    """
    Converts a single input of type T to a List

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.util.List<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList"

    def __init__(
            self,
            input: typing.Any = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToStream(Operation):
    """
    Converts an Iterable to a Stream

    Args:
        input: 
        options: Additional map of options
    Returns:
        java.util.stream.Stream<T>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToStream"

    def __init__(
            self,
            input: typing.List[typing.Any] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            operation_json["input"] = self.input
        return operation_json


class ToVertices(Operation):
    """
    Converts element ids into vertices

    Args:
        input: 
        use_matched_vertex: Choose whether to extract vertices based on how the seeds match the edges
        edge_vertices: Choose whether to extract the edge vertices
        options: Additional map of options
    Returns:
        java.lang.Iterable<?>
    """
    CLASS = "uk.gov.gchq.gaffer.operation.impl.output.ToVertices"

    def __init__(
            self,
            input: typing.List[gafferpy.gaffer_core.ElementSeed] = None,
            use_matched_vertex: str = None,
            edge_vertices: str = None,
            options: typing.Dict[str, str] = None):
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


class GetProxyProperties(Operation):
    """
    Gets ONLY the Proxy Properties value from the Proxy store

    Args:
        options: Additional map of options
    Returns:
        java.util.Map<java.lang.String,java.lang.Object>
    """
    CLASS = "uk.gov.gchq.gaffer.proxystore.operation.GetProxyProperties"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class GetProxyUrl(Operation):
    """
    Gets the Proxy URL value from the store properties

    Args:
        options: Additional map of options
    Returns:
        java.lang.String
    """
    CLASS = "uk.gov.gchq.gaffer.proxystore.operation.GetProxyUrl"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class DeleteAllData(Operation):
    """
    This operation is used to self delete all retained data

    Args:
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.DeleteAllData"

    def __init__(
            self,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class DeleteAllData(Operation):
    """
    This operation is used to self delete all retained data
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.DeleteAllData"

    def __init__(
            self,
            options=None):
        super().__init__(_class_name=self.CLASS, options=options)

    def to_json(self):
        return super().to_json()


class GetSchema(Operation):
    """
    Gets the Schema of a Graph

    Args:
        compact: 
        options: Additional map of options
    Returns:
        uk.gov.gchq.gaffer.store.schema.Schema
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.GetSchema"

    def __init__(
            self,
            compact: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.compact = compact

    def to_json(self):
        operation_json = super().to_json()
        if self.compact is not None:
            operation_json["compact"] = self.compact
        return operation_json


class GetTraits(Operation):
    """
    An Operation used for getting traits from the Store

    Args:
        current_traits: 
        options: Additional map of options
    Returns:
        java.util.Set<uk.gov.gchq.gaffer.store.StoreTrait>
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.GetTraits"

    def __init__(
            self,
            current_traits: bool = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.current_traits = current_traits

    def to_json(self):
        operation_json = super().to_json()
        if self.current_traits is not None:
            operation_json["currentTraits"] = self.current_traits
        return operation_json


class HasTrait(Operation):
    """
    An Operation that will see if a Store has a given trait

    Args:
        current_traits: 
        trait: The features of the Gaffer store - i.e does it support query aggregation?
        options: Additional map of options
    Returns:
        java.lang.Boolean
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.HasTrait"

    def __init__(
            self,
            current_traits: bool = None,
            trait: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.current_traits = current_traits
        self.trait = trait

    def to_json(self):
        operation_json = super().to_json()
        if self.current_traits is not None:
            operation_json["currentTraits"] = self.current_traits
        if self.trait is not None:
            operation_json["trait"] = self.trait
        return operation_json


class AddSchemaToLibrary(Operation):
    """
    Adds a Schema to the GraphLibrary

    Args:
        schema: 
        id: 
        parent_schema_ids: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.add.AddSchemaToLibrary"

    def __init__(
            self,
            schema: typing.Dict,
            id: str,
            parent_schema_ids: typing.List[str] = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.schema = schema
        self.id = id
        self.parent_schema_ids = parent_schema_ids

    def to_json(self):
        operation_json = super().to_json()
        if self.schema is not None:
            operation_json["schema"] = self.schema
        if self.id is not None:
            operation_json["id"] = self.id
        if self.parent_schema_ids is not None:
            operation_json["parentSchemaIds"] = self.parent_schema_ids
        return operation_json


class AddStorePropertiesToLibrary(Operation):
    """
    Adds StoreProperties to the GraphLibrary

    Args:
        store_properties: 
        id: 
        parent_properties_id: 
        options: Additional map of options
    Returns:
        java.lang.Void
    """
    CLASS = "uk.gov.gchq.gaffer.store.operation.add.AddStorePropertiesToLibrary"

    def __init__(
            self,
            store_properties: typing.Dict,
            id: str,
            parent_properties_id: str = None,
            options: typing.Dict[str, str] = None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.store_properties = store_properties
        self.parent_properties_id = parent_properties_id
        self.id = id

    def to_json(self):
        operation_json = super().to_json()
        if self.store_properties is not None:
            operation_json["storeProperties"] = self.store_properties
        if self.parent_properties_id is not None:
            operation_json["parentPropertiesId"] = self.parent_properties_id
        if self.id is not None:
            operation_json["id"] = self.id
        return operation_json


class OperationChainDAO(OperationChain):
    """
    Simple data access object, enabling (de)serialisation of an OperationChain
    """
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChainDAO"

    def __init__(self, operations, options=None):
        super().__init__(operations=operations, options=options)

    def to_json(self):
        operation_chain_json = super().to_json()
        operation_chain_json.pop("class", None)
        return operation_chain_json
