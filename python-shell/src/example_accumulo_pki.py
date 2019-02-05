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

import example_accumulo
from gafferpy import gaffer_connector_pki


def run(host, verbose=False, pki_cert='cert.pem'):
    # Store your PKI certificate in file cert.pem
    pki = gaffer_connector_pki.PkiCredentials(pki_cert)

    example_accumulo.run_with_connector(create_connector(host, pki, verbose))


def create_connector(host, pki, verbose=False):
    return gaffer_connector_pki.GafferConnector(host, pki, verbose)


if __name__ == "__main__":
    run('localhost:8080/rest/latest')
