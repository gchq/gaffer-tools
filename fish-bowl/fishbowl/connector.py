import urllib.request
import urllib.error
import json
import ssl
import getpass
from fishbowl.util import to_json


class GafferConnector:
    def __init__(self, host):
        self._host = host

        self._opener = urllib.request.build_opener(
            urllib.request.HTTPHandler())

        self.__print_status()

    def execute(self, operation, headers={}):
        operation_json = to_json(operation)

        json_body = bytes(json.dumps(operation_json), "ascii")
        headers["Content-Type"] = "application/json;charset=utf-8"

        request = urllib.request.Request(self._host + "/graph/operations/execute", headers=headers, data=json_body)

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

        if response_text is not None and response_text is not '':
            return json.loads(response_text)
        else:
            return None

    def get(self, path):
        request = urllib.request.Request(self._host + path)

        try:
            response = self._opener.open(request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        return json.loads(response.read().decode('utf-8'))

    def __print_status(self):
        status = self.get("/graph/status")
        print(status)

    def close_connection(self):
        self._opener.close()


class PKIGafferConnector(GafferConnector):
    def __init__(self, host, pki, protocol=None):
        """
        This initialiser sets up a connection to the specified Gaffer server as
        per gafferConnector.GafferConnector and
        requires the additional pki object.
        """
        super().__init__(host=host)
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=pki.get_ssl_context(protocol)))


class PkiCredentials:
    """
    This class holds a set of PKI credentials. These are loaded from a PEM file
    which should contain the private key and the public keys for the entire
    certificate chain.
    """

    def __init__(self, cert_filename, password=None):
        """
        Construct the credentials class from a PEM file. If a password is not
        supplied and the file is password-protected then the password will be
        requested.
        """

        # Read the contents of the certificate file to check that it is
        # readable
        with open(cert_filename, 'r') as cert_file:
            self._cert_file_contents = cert_file.read()
            cert_file.close()

        # Remember the filename
        self._cert_filename = cert_filename

        # Obtain the password if required and remember it
        if password is None:
            password = getpass.getpass('Password for PEM certificate file: ')
        self._password = password

    def get_ssl_context(self, protocol=None):
        """
        This method returns a SSL context based on the file that was specified
        when this object was created.

        Arguments:
         - An optional protocol. SSLv2 is used by default.

        Returns:
         - The SSL context
        """

        # Validate the arguments
        if protocol is None:
            protocol = ssl.PROTOCOL_SSLv2

        # Create an SSL context from the stored file and password.
        ssl_context = ssl.SSLContext(protocol)
        ssl_context.load_cert_chain(self._cert_filename,
                                    password=self._password)

        # Return the context
        return ssl_context

    def __str__(self):
        return 'Certificates from ' + self._cert_filename
