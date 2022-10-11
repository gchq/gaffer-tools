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

import urllib.error
import urllib.request

from .urllib_client import UrllibClient


class PkiClient(UrllibClient):
    def __init__(self, base_url, verbose=False, headers={}, **kwargs):
        '''
        This initialiser sets up a connection to the specified Gaffer server.

        The host (and port) of the Gaffer server, should be in the form,
        'hostname:1234/service-name/version'
        '''
        super().__init__(base_url, verbose, headers, **kwargs)

        # Fail if none pki, protocol None
        pki = kwargs["pki"]
        protocol = kwargs["protocol"]
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=pki.get_ssl_context(protocol)))
