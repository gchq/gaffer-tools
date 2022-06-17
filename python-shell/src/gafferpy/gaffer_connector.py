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

from gafferpy import gaffer as g

from gafferpy.client import UrllibClient, RequestsClient, PkiClient

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

    def __init__(self, host, verbose=False, headers={}, config={}, client_class=UrllibClient):
        """
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form,
        'hostname:1234/service-name/version'
        """

        if isinstance(client_class, str):
            if client_class not in CLIENT_CLASS_NAMES:
                options = "', '".join(CLIENT_CLASS_NAMES.keys())
                raise ValueError(
                    f"Unknown option for client_class: '{client_class}'. "
                    f"Available options are: '{options}'"
                )
            client_class = CLIENT_CLASS_NAMES[client_class]

        self.client = client_class(host, verbose, headers, config)

    def execute_operation(self, operation, headers=None):
        """
        This method queries Gaffer with the single provided operation.
        """
        return self.execute_operations([operation], headers)

    def execute_operations(self, operations, headers=None):
        """
        This method queries Gaffer with the provided array of operations.
        """
        return self.execute_operation_chain(g.OperationChain(operations),
                                            headers)

    def execute_operation_chain(self, operation_chain, headers=None):
        """
        This method queries Gaffer with the provided operation chain.
        """
        target = '/graph/operations/execute'

        ## TODO: Handle json recursively
        if hasattr(operation_chain, "to_json"):
            op_chain_json_obj = operation_chain.to_json()
        else:
            op_chain_json_obj = operation_chain

        # Query Gaffer
        if self._verbose:
            print('\nQuery operations:\n' +
                  json.dumps(op_chain_json_obj, indent=4) + '\n')

        # Convert the query dictionary into JSON and post the query to Gaffer
        json_body = bytes(json.dumps(op_chain_json_obj), 'ascii')
        ##^ TODO: Handle json recursively

        return self.client.perform_request(
            "POST",
            target,
            headers,
            json_body
        )

    def execute_get(self, operation, headers=None):
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

        return self.client.perform_request(
            "GET",
            target,
            headers
        )

    def is_operation_supported(self, operation, headers=None):
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

        target = '/graph/operations/' + operation.get_operation()

        return self.client.perform_request(
            "GET",
            target,
            headers
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
