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
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.poolmanager import PoolManager

from gafferpy import gaffer as g


class GafferConnector:
    """
    This class handles the connection to a Gaffer server and handles operations.
    This class is initialised with a host to connect to.
    """

    def __init__(self, host, verbose=False,
                 headers={}, auth=None, cert=None,
                 verify=True, proxies={}, protocol=None):
        """
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form,
        'hostname:1234/service-name/version'
        """
        self._host = host
        self._verbose = verbose

        # Create the session
        self._session = requests.Session()
        self._session.headers.update(headers)
        self._session.auth = auth
        self._session.cert = cert
        self._session.verify = verify
        self._session.proxies = proxies
        self._session.mount('https://', SSLAdapter(ssl_version=protocol))

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
        json_body = json.dumps(op_chain_json_obj)

        # Add content type header
        if headers is None:
            headers = {}
        headers['Content-Type'] = 'application/json;charset=utf-8'

        try:
            response = self._session.post(
                url,
                headers=headers,
                data=json_body)
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            raise ConnectionError(
                'HTTP error ' + str(error.response.status_code) + ': ' + error.response.text)

        try:
            response_json = response.json()
        except json.JSONDecodeError:
            response_json = response.text

        if self._verbose:
            print('\nQuery response:\n' + 
                  json.dumps(response_json, indent=4) + '\n')

        if response_json is not None and response_json != '':
            result = response_json
        else:
            result = None

        return g.JsonConverter.from_json(result)

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
        url = self._host + operation.get_url()

        try:
            response = self._session.get(url, headers=headers)
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            raise ConnectionError(
                'HTTP error ' + str(error.response.status_code) + ': ' + error.response.text)

        return response.text

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
        url = self._host + '/graph/operations/' + operation.get_operation()

        try:
            response = self._session.get(url, headers=headers)
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            raise ConnectionError(
                'HTTP error ' + str(error.response.status_code) + ': ' + error.response.text)

        return response.text

    def __del__(self):
        self._session.close()

class SSLAdapter(HTTPAdapter):
    """
    A subclass of the HTTPS Transport Adapter that is used to
    setup an arbitrary SSL version for the requests session.
    """
    def __init__(self, ssl_version=None, **kwargs):
        self.ssl_version = ssl_version

        super(SSLAdapter, self).__init__(**kwargs)

    def init_poolmanager(self, connections, maxsize, block=False):
        self.poolmanager = PoolManager(num_pools=connections,
                                       maxsize=maxsize,
                                       block=block,
                                       ssl_version=self.ssl_version)
