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

import json
import urllib.error
import urllib.request

from gafferpy.gaffer_core import JsonConverter

from .base_client import BaseClient


class UrllibClient(BaseClient):
    '''
    This class handles the connection to a Gaffer server and handles operations.
    This class is initialised with a host to connect to.
    '''

    def __init__(self, base_url, verbose=False, headers={}, **kwargs):
        '''
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form,
        'hostname:1234/service-name/version'
        '''
        super().__init__(base_url, verbose, headers, **kwargs)

        # Create the opener
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPHandler())

    def perform_request(
            self,
            method,
            target,
            headers=None,
            body=None,
            json_result=True):
        url = self.base_url + target

        request_headers = self.merge_headers(headers)

        request = urllib.request.Request(
            url, headers=request_headers, data=body, method=method)

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

        if not json_result and method == "GET":
            return response_text

        if self.verbose:
            print('Query response: ' + response_text)

        if response_text is not None and response_text != '':
            result = json.loads(response_text)
        else:
            result = None

        if json_result:
            return result
        else:
            return JsonConverter.from_json(result)
