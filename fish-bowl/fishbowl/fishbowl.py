from fishbowl.fishbowl_core import *
from fishbowl.fishbowl_util import *

import urllib.request
import urllib.error
import os
import shutil

OPERATION_CHAIN_DAO = "uk.gov.gchq.gaffer.operation.OperationChainDAO"


class Fishbowl:
    def __init__(self, endpoint, generated_directory_path="g"):
        self.gaffer_endpoint = endpoint

        # Create the opener
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPHandler())

        self.__print_status()

        self.generated_directory_path = generated_directory_path
        print("Generating python Library from REST service")
        self.__generate_library()

    def __generate_library(self):

        if os.path.exists(self.generated_directory_path):
            shutil.rmtree(self.generated_directory_path)

        os.mkdir(self.generated_directory_path)

        operations_python = self.__generate_operations()
        functions_python = self.__generate_functions("/graph/config/transformFunctions")
        predicates_python = self.__generate_functions("/graph/config/filterFunctions")

        write_to_file(os.path.join(self.generated_directory_path, "functions.py"), functions_python)
        write_to_file(os.path.join(self.generated_directory_path, "predicates.py"), predicates_python)
        write_to_file(os.path.join(self.generated_directory_path, "operations.py"), operations_python)
        write_to_file(os.path.join(self.generated_directory_path, "__init__.py"),
                      "__all__ = [ \"operations\", \"predicates\", \"functions\" ]\n")

    def __generate_functions(self, path):
        functions_request = urllib.request.Request(self.gaffer_endpoint + path)

        try:
            response = self._opener.open(functions_request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        response_text = response.read().decode('utf-8')
        # functions is a list of function classes
        functions = json.loads(response_text)

        functions_python = ["from fishbowl.fishbowl_core import *\n\n"]

        for fn in functions:
            serialised_fields_request = urllib.request.Request(self.gaffer_endpoint + "/graph/config/serialisedFields/"
                                                               + fn)
            try:
                response = self._opener.open(serialised_fields_request)
            except urllib.error.HTTPError as error:
                error_body = error.read().decode('utf-8')
                new_error_string = ('HTTP error ' +
                                    str(error.code) + ' ' +
                                    error.reason + ': ' +
                                    error_body)
                print(new_error_string)
                # Do some counting of error messages and throw if count reaches certain limit

            response_text = response.read().decode('utf-8')
            # functions is a list of function classes
            function_fields = json.loads(response_text)

            # Map of fields to snake case fields
            function_field_mappings = dict()
            for field in function_fields:
                function_field_mappings[field] = camel_to_snake(field)

            functions_python.append("class " + fn.rsplit(".", 1)[1].replace("$", "") + "(Base):")
            functions_python.append("    CLASS = \"" + fn + "\"\n")
            functions_python.append("    def __init__(self, " + "=None, ".join(function_field_mappings.values()) +
                                    "=None):" if len(function_fields) > 0 else
                                    "    def __init__(self):")
            functions_python.append("        super().__init__(_class_name=self.CLASS)")
            for field in function_field_mappings.values():
                functions_python.append("        self." + field + " = " + field)
            functions_python.append("")

            functions_python.append("    def to_json(self):")
            if len(function_fields) == 0:
                functions_python.append("        return super().to_json()")
            else:
                functions_python.append("        function_json = super().to_json()")
                for field in function_field_mappings.keys():
                    functions_python.append("        if self." + function_field_mappings[field] + " is not None:")
                    functions_python.append(
                        "            function_json[\"" + field + "\"] = self." + function_field_mappings[field])
                functions_python.append("        return function_json")
            functions_python.append("\n")

        return "\n".join(functions_python)

    def __generate_operations(self):
        operations_request = urllib.request.Request(self.gaffer_endpoint + "/graph/operations/details")
        try:
            response = self._opener.open(operations_request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        response_text = response.read().decode('utf-8')

        operation_summaries = json.loads(response_text)

        operations_python = ["from fishbowl.fishbowl_core import *\n\n"]

        for operation in operation_summaries:
            # Don't add OperationChainDAO as this has a field called class which breaks python
            if operation["name"] != OPERATION_CHAIN_DAO:
                operations_python.append("class " + operation["name"].rsplit(".", 1)[1] + "(Operation):")
                operations_python.append("    CLASS = \"" + operation["name"] + "\"\n")

                # Create a list of field names
                fields = {}
                for field in operation["fields"]:
                    field_name = field["name"]
                    if field_name != "options":
                        fields[field_name] = camel_to_snake(field_name)

                operations_python.append("    def __init__(self, " + "=None, ".join(fields.values()) +
                                         "=None, options=None):" if len(fields) > 0 else
                                         "    def __init__(self, options=None):")
                operations_python.append("        super().__init__(_class_name=self.CLASS, options=options)")
                for field in fields.values():
                    operations_python.append("        self." + field + " = " + field)
                operations_python.append("")
                operations_python.append("    def to_json(self):")
                if len(fields) == 0:
                    operations_python.append("        return super().to_json()")
                else:
                    operations_python.append("        operation_json = super().to_json()")
                    for field in fields.keys():
                        operations_python.append("        if self." + fields[field] + " is not None:")
                        operations_python.append(
                            "            operation_json[\"" + field + "\"] = self." + fields[field])
                    operations_python.append("        return operation_json")
                operations_python.append("\n")

        # Add the OperationChainDAO afterwards instead
        operations_python.append("class OperationChainDAO(OperationChain):")
        operations_python.append("    CLASS = \"" + OPERATION_CHAIN_DAO + "\"\n")
        operations_python.append("    def __init__(self, operations, options=None):")
        operations_python.append("        super().__init__(operations=operations, options=options)\n")
        operations_python.append("    def to_json(self):")
        operations_python.append("        operation_chain_json = super().to_json()")
        operations_python.append("        operation_chain_json.pop(\"class\", None)")
        operations_python.append("        return operation_chain_json\n")

        return "\n".join(operations_python)

    def __print_status(self):
        status_request = urllib.request.Request(self.gaffer_endpoint + "/graph/status")
        try:
            response = self._opener.open(status_request)
        except urllib.error.HTTPError as error:
            error_body = error.read().decode('utf-8')
            new_error_string = ('HTTP error ' +
                                str(error.code) + ' ' +
                                error.reason + ': ' +
                                error_body)
            raise ConnectionError(new_error_string)

        response_text = response.read().decode('utf-8')

        print(response_text)

    def tear_down(self):
        self._opener.close()
        shutil.rmtree(self.generated_directory_path)
