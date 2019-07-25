#
# Copyright 2016-2019 Crown Copyright
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
import urllib.error
import urllib.request

from gafferpy import gaffer as g


class GafferConnector:
    """
    This class handles the connection to a Gaffer server and handles operations.
    This class is initialised with a host to connect to.
    """

    def __init__(self, host, verbose=False):
        """
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form,
        'hostname:1234/service-name/version'
        """
        self._host = host
        self._verbose = verbose

        # Create the opener
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPHandler())

    def execute_operation(self, operation, headers={}):
        """
        This method queries Gaffer with the single provided operation.
        """
        return self.execute_operations([operation], headers)

    def execute_operations(self, operations, headers={}):
        """
        This method queries Gaffer with the provided array of operations.
        """
        return self.execute_operation_chain(g.OperationChain(operations),
                                            headers)

    def execute_operation_chain(self, operation_chain, headers={}):
        """
        This method queries Gaffer with the provided operation chain.
        """

        # Construct the full URL path to the Gaffer server
        url = self._host + '/graph/operations/execute'

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
        headers['Content-Type'] = 'application/json;charset=utf-8'

        request = urllib.request.Request(url, headers=headers, data=json_body)

        try:
            response = self._opener.open(request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)
        response_text = response.read().decode('utf-8')

        if self._verbose:
            print('Query response: ' + response_text)

        if response_text is not None and response_text is not '':
            result = json.loads(response_text)
        else:
            result = None

        return g.JsonConverter.from_json(result)

    def execute_get(self, operation, headers={}):
        url = self._host + operation.get_url()
        headers['Content-Type'] = 'application/json;charset=utf-8'
        request = urllib.request.Request(url, headers=headers)

        try:
            response = self._opener.open(request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        return response.read().decode('utf-8')

    def is_operation_supported(self, operation=None, headers={}):
        url = self._host + '/graph/operations/' + operation.get_operation()
        headers['Content-Type'] = 'application/json;charset=utf-8'

        request = urllib.request.Request(url, headers=headers)

        try:
            response = self._opener.open(request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        response_text = response.read().decode('utf-8')

        return response_text
