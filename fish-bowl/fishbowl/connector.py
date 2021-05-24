import json
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.poolmanager import PoolManager

from fishbowl.util import to_json


class GafferConnector:
    def __init__(self, host, verbose=False,
                 headers={}, auth=None, cert=None,
                 verify=True, proxies={}, protocol=None):
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

        self.__print_status()

    def execute(self, operation, headers={}):
        operation_json = to_json(operation)
        json_body = json.dumps(operation_json)

        headers["Content-Type"] = "application/json;charset=utf-8"

        if self._verbose:
            print('\nQuery operations:\n' +
                  json.dumps(operation_json, indent=4) + '\n')

        try:
            response = self._session.post(
                self._host + "/graph/operations/execute",
                headers=headers,
                data=json_body)
            response.raise_for_status()
        except requests.exceptions.HTTPError:
            raise ConnectionError(
                f'HTTP error {response.status_code}: {response.text}')

        try:
            response_json = response.json()
        except json.JSONDecodeError:
            response_json = response.text

        if self._verbose:
            print('\nQuery response:\n' + 
                  json.dumps(response_json, indent=4) + '\n')

        if response_json is not None and response_json is not '':
            return response_json
        else:
            return None

    def get(self, path):
        try:
            response = self._session.get(self._host + path)
            response.raise_for_status()
        except requests.exceptions.HTTPError:
            raise ConnectionError(
                f'HTTP error {response.status_code}: {response.text}')

        try:
            response_json = response.json()
        except json.JSONDecodeError:
            response_json = response.text

        if response_json is not None and response_json is not '':
            return response_json
        else:
            return None

    def __print_status(self):
        status = self.get("/graph/status")
        print(status)

    def close_connection(self):
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