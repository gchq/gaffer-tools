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

try:
    import requests
    from requests.adapters import HTTPAdapter
    from requests.packages.urllib3.poolmanager import PoolManager
    _REQUESTS_AVAILABLE = True

    class SSLAdapter(HTTPAdapter):
        '''
        A subclass of the HTTPS Transport Adapter that is used to
        setup an arbitrary SSL version for the requests session.
        '''

        def __init__(self, ssl_version=None, **kwargs):
            self.ssl_version = ssl_version

            super(SSLAdapter, self).__init__(**kwargs)

        def init_poolmanager(self, connections, maxsize, block=False):
            self.poolmanager = PoolManager(num_pools=connections,
                                        maxsize=maxsize,
                                        block=block,
                                        ssl_version=self.ssl_version)

except ImportError:
    _REQUESTS_AVAILABLE = False

from gafferpy import gaffer as g

from .base_client import BaseClient


class RequestsClient(BaseClient):
    '''
    This class handles the connection to a Gaffer server and handles operations.
    This class is initialised with a host to connect to.
    '''
    def __init__(self, base_url, verbose=False, headers={}, config={}):
        if not _REQUESTS_AVAILABLE:
            raise ValueError(
                "You must have 'requests' installed to use RequestsClient"
            )

        super().__init__(base_url, verbose, headers, config)

        # Create the session
        self._session = requests.Session()
        self._session.headers.update(headers)
            
        self._session.auth = self.config.get("auth", None)
        self._session.cert = self.config.get("cert", None)
        self._session.verify = self.config.get("verify", True)
        self._session.proxies = self.config.get("proxies", {})
        protocol = self.config.get("protocol", None)
        self._session.mount('https://', SSLAdapter(ssl_version=protocol))

    def perform_request(self, method, target, headers=None, body=None):
        url = self.base_url + target

        request_headers = self.merge_headers(headers)

        request = requests.Request(method, url, headers=request_headers, data=body)
        prepared_request = self._session.prepare_request(request)

        try:
            response = self._session.send(prepared_request)
            response.raise_for_status()
        except requests.exceptions.HTTPError as error:
            raise ConnectionError(
                'HTTP error ' + str(error.response.status_code) + ': ' + error.response.text)

        ## TODO: Fix json transform
        try:
            response_json = response.json()
        except json.JSONDecodeError:
            response_json = response.text

        if self.verbose:
            print('\nQuery response:\n' +
                  json.dumps(response_json, indent=4) + '\n')

        if response_json is not None and response_json != '':
            result = response_json
        else:
            result = None

        return g.JsonConverter.from_json(result)

        #return response.text

    def __del__(self):
        self._session.close()
