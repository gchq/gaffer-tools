#
# Copyright 2022 Crown Copyright
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

class BaseClient:
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
        self.base_url = base_url
        self.verbose = verbose
        self.headers = headers
        self.headers.setdefault(
            'Content-Type',
            'application/json;charset=utf-8')

    def perform_request(
            self,
            method,
            target,
            headers=None,
            body=None,
            json_result=True):
        raise NotImplementedError()

    def merge_headers(self, headers):
        request_headers = self.headers.copy()
        if headers:
            request_headers.update(headers)
        return request_headers
