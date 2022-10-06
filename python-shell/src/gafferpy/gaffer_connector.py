#
# Copyright 2016-2022 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""
This module queries a Gaffer REST API
"""

import json

from gafferpy.client import UrllibClient, RequestsClient, PkiClient
from gafferpy.gaffer_core import ToJson
from gafferpy.gaffer_config import IsOperationSupported
from gafferpy.gaffer_operations import OperationChain


CLIENT_CLASS_NAMES = {
    "urllib": UrllibClient,
    "requests": RequestsClient,
    "pki": PkiClient
}


class GafferConnector:
    """
    This class handles the connection to a Gaffer server and handles operations.
    This class is initialised with a host to connect to.
    """

    def __init__(
            self,
            host,
            verbose=False,
            headers={},
            client_class=UrllibClient,
            **kwargs):
        """
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form: 'hostname:1234/service-name/version'.
        Note that spring-rest endpoints do not require the version.
        """

        if isinstance(client_class, str):
            if client_class not in CLIENT_CLASS_NAMES:
                options = "", "".join(CLIENT_CLASS_NAMES.keys())
                raise ValueError(
                    f"Unknown option for client_class: '{client_class}'. "
                    f"Available options are: '{options}'"
                )
            client_class = CLIENT_CLASS_NAMES[client_class]

        self.client = client_class(host, verbose, headers, **kwargs)

    def execute(self, operation, headers=None):
        """
        This method queries Gaffer with the single provided operation.
        """
        return self.execute_operation(operation, headers)

    def execute_operation(self, operation, headers=None):
        """
        This method queries Gaffer with the single provided operation.
        """
        return self.execute_operations([operation], headers)

    def execute_operations(self, operations, headers=None):
        """
        This method queries Gaffer with the provided array of operations.
        """
        return self.execute_operation_chain(OperationChain(operations),
                                            headers)

    def execute_operation_chain(self, operation_chain, headers=None):
        """
        This method queries Gaffer with the provided operation chain.
        """
        target = '/graph/operations/execute'

        op_chain_json_obj = ToJson.recursive_to_json(operation_chain)

        # Query Gaffer
        if self._verbose:
            print("\nQuery operations:\n" +
                  json.dumps(op_chain_json_obj, indent=4) + "\n")

        # Convert the query dictionary into JSON and post the query to Gaffer
        json_body = bytes(json.dumps(op_chain_json_obj), "ascii")

        return self.client.perform_request(
            "POST",
            target,
            headers,
            json_body
        )

    def execute_get(self, operation, headers=None, json_result=False):
        """
        This method queries Gaffer with a GET request to a specified endpoint.

        The operation parameter expects an input of the form: g.<OperationClass>, where <OperationClass> must inherit
        from the class 'gafferpy.gaffer_config.GetGraph'.

        The following are accepted inputs:
            g.GetFilterFunctions()
            g.GetTransformFunctions()
            g.GetClassFilterFunctions()
            g.GetElementGenerators()
            g.GetObjectGenerators()
            g.GetOperations()
            g.GetSerialisedFields()
            g.GetStoreTraits()

        Example:
              gc.execute_get(
                operation = g.GetOperations()
              )
        """
        target = operation.get_url()

        return self.get(target, headers, json_result)

    def is_operation_supported(
            self,
            operation,
            headers=None,
            json_result=False):
        """
        This method queries the Gaffer API to provide details about operations
        Returns a JSON array containing details about the operation.

        The operation parameter expects an input of the form:
            g.IsOperationSupported(
                operation='uk.gov.gchq.gaffer.operation.impl.get.GetElements'
            )
            or you can use:
            g.IsOperationSupported(
                operation=g.GetElements().CLASS
            )
        Example:
            gc.is_operation_supported(
                operation = g.IsOperationSupported(
                    operation='uk.gov.gchq.gaffer.operation.impl.get.GetElements'
                )
            )
        """

        if isinstance(operation, IsOperationSupported):
            target = "/graph/operations/" + operation.get_operation()
        else:
            target = "/graph/operations/" + operation.CLASS

        return self.get(target, headers, json_result)

    def get(self, url, headers=None, json_result=False):
        return self.client.perform_request(
            "GET",
            url,
            headers,
            json_result=json_result
        )

    @property
    def _host(self):
        return self.client.base_url

    @property
    def _verbose(self):
        return self.client.verbose

    @property
    def _headers(self):
        return self.client.headers
