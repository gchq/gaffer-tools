#
# Copyright 2022 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

from gafferpy.gaffer_core import JsonConverter

import os
import shutil

OPERATION_CHAIN_DAO = "uk.gov.gchq.gaffer.operation.OperationChainDAO"

LICENSE = \
    '''#
# Copyright 2022 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

'''
GENERATED_HEADER = \
    '''"""
This module has been generated with fishbowl.
To make changes, either extend these classes or change fishbowl.
"""
'''
HEADER = LICENSE + GENERATED_HEADER


class Fishbowl:
    def __init__(self, gaffer_connector, generated_directory_path="generated"):
        self._gaffer_connector = gaffer_connector
        self.generated_directory_path = generated_directory_path
        print("Generating python Library from REST service")
        self._generate_library()
        print("done")
        print("To import operations, predicates and functions, use the following command:")
        print("from " + generated_directory_path + " import *")

    def _write_to_file(self, file_path, data):
        with open(file_path, "w+") as file:
            file.write(data)

    def _generate_library(self):

        if os.path.exists(self.generated_directory_path):
            shutil.rmtree(self.generated_directory_path)

        os.mkdir(self.generated_directory_path)

        operations_python = self._generate_operations()
        functions_python = self._generate_transform_functions()
        predicates_python = self._generate_filter_functions()
        binary_operators_python = self._generate_aggregation_functions()
        config_python = self._generate_config()

        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "functions.py"),
            functions_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "predicates.py"),
            predicates_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "binary_operators.py"),
            binary_operators_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "operations.py"),
            operations_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "config.py"),
            config_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path,
                "__init__.py"),
            "__all__ = [ \"operations\", \"predicates\", \"functions\", \"binary_operators\", \"config\" ]\n")

    def _generate_transform_functions(self):
        return self._generate_functions(
            "/graph/config/transformFunctions",
            "gaffer_functions",
            "AbstractFunction")

    def _generate_filter_functions(self):
        return self._generate_functions(
            "/graph/config/filterFunctions",
            "gaffer_predicates",
            "AbstractPredicate")

    def _generate_aggregation_functions(self):
        return self._generate_functions(
            "/graph/config/aggregationFunctions",
            "gaffer_binaryoperators",
            "AbstractBinaryOperator")

    def _generate_functions(self, path, import_path, base_class):
        # Older Gaffer versions may be missing some function end points
        try:
            functions = self._gaffer_connector.get(path, json_result=True)
        except ConnectionError:
            print(f"{path} not present, skipping")
            return ""

        functions_python = [HEADER]
        functions_python.append(
            f"from gafferpy.{import_path} import {base_class}\n\n")

        for fn in functions:
            # functions is a list of function classes
            function_fields = self._gaffer_connector.get(
                "/graph/config/serialisedFields/" + fn, json_result=True)

            # Map of fields to snake case fields
            function_field_mappings = dict()
            for field in function_fields:
                function_field_mappings[field] = JsonConverter.to_snake_case(
                    field)

            functions_python.append(
                "class " +
                fn.rsplit(
                    ".",
                    1)[1].replace(
                    "$",
                    "") +
                f"({base_class}):")
            functions_python.append("    CLASS = \"" + fn + "\"\n")
            functions_python.append(
                "    def __init__(self, " +
                "=None, ".join(
                    function_field_mappings.values()) +
                "=None):" if len(function_fields) > 0 else "    def __init__(self):")
            functions_python.append(
                "        super().__init__(_class_name=self.CLASS)")
            for field in function_field_mappings.values():
                functions_python.append(
                    "        self." + field + " = " + field)
            functions_python.append("")

            functions_python.append("    def to_json(self):")
            if len(function_fields) == 0:
                functions_python.append("        return super().to_json()")
            else:
                functions_python.append(
                    "        function_json = super().to_json()")
                for field in function_field_mappings.keys():
                    functions_python.append(
                        "        if self." +
                        function_field_mappings[field] +
                        " is not None:")
                    functions_python.append(
                        "            function_json[\"" +
                        field +
                        "\"] = self." +
                        function_field_mappings[field])
                functions_python.append("        return function_json")
            functions_python.append("\n")

        return "\n".join(functions_python)

    def _generate_operations(self):
        # spring-rest has an endpoint for every store operation, even ones unsupported by the store
        # Check if this is supported: 2.0.0+, 1.23.0+
        try:
            operation_summaries = self._gaffer_connector.get(
                "/graph/operations/details/all", json_result=True)
        except ConnectionError:
            operation_summaries = self._gaffer_connector.get(
                "/graph/operations/details", json_result=True)

        operations_python = [HEADER]
        operations_python.append(
            "from gafferpy.gaffer_operations import Operation\n\n")

        for operation in operation_summaries:
            # Don't add OperationChainDAO as this has a field called class
            # which breaks python
            if operation["name"] != OPERATION_CHAIN_DAO:
                operations_python.append(
                    "class " +
                    operation["name"].rsplit(
                        ".",
                        1)[1] +
                    "(Operation):")
                operations_python.append(
                    "    CLASS = \"" + operation["name"] + "\"\n")

                # Create a list of field names
                fields = []
                for field in operation["fields"]:
                    field_name = field["name"]
                    if field_name != "options":
                        field["camel_name"] = JsonConverter.to_snake_case(
                            field_name)
                        fields.append(field)

                if len(fields) > 0:
                    def_line = "    def __init__(self, "
                    defs = []
                    for field in fields:
                        if field["required"]:
                            defs = [field["camel_name"] + ", "] + defs
                        else:
                            defs.append(field["camel_name"] + "=None, ")
                    def_line += "".join(defs)
                    def_line += "options=None):"
                    operations_python.append(def_line)
                else:
                    operations_python.append(
                        "    def __init__(self, options=None):")
                operations_python.append(
                    "        super().__init__(_class_name=self.CLASS, options=options)")
                for field_name in [field["camel_name"] for field in fields]:
                    operations_python.append(
                        "        self." + field_name + " = " + field_name)
                operations_python.append("")
                operations_python.append("    def to_json(self):")
                if len(fields) == 0:
                    operations_python.append(
                        "        return super().to_json()")
                else:
                    operations_python.append(
                        "        operation_json = super().to_json()")
                    for field in fields:
                        operations_python.append(
                            "        if self." + field["camel_name"] + " is not None:")
                        operations_python.append(
                            "            operation_json[\"" +
                            field["name"] +
                            "\"] = self." +
                            field["camel_name"])
                    operations_python.append("        return operation_json")
                operations_python.append("\n")

        # Add the OperationChainDAO afterwards instead
        operations_python.append("class OperationChainDAO(OperationChain):")
        operations_python.append(
            "    CLASS = \"" +
            OPERATION_CHAIN_DAO +
            "\"\n")
        operations_python.append(
            "    def __init__(self, operations, options=None):")
        operations_python.append(
            "        super().__init__(operations=operations, options=options)\n")
        operations_python.append("    def to_json(self):")
        operations_python.append(
            "        operation_chain_json = super().to_json()")
        operations_python.append(
            "        operation_chain_json.pop(\"class\", None)")
        operations_python.append("        return operation_chain_json\n")

        return "\n".join(operations_python)

    def _generate_config(self):
        # Gaffer 2 spring-rest uses openapi3 rather than swagger2
        try:
            api_summaries = self._gaffer_connector.get(
                "/v3/api-docs", json_result=True)
        except ConnectionError:
            api_summaries = self._gaffer_connector.get(
                "/swagger.json", json_result=True)

        config_python = [HEADER]
        config_python.append("from gafferpy.gaffer_config import GetGraph\n\n")

        for path, data in api_summaries["paths"].items():
            if path.startswith("/graph/") and "get" in data:
                name = path.replace("/graph", "")
                name = name.replace("/config", "")

                # Remove parameters from class name
                if "{" in name:
                    name = name.split("{")[0] + path.split("}")[-1]
                    name = name.replace("//", "/")

                name = name.strip("/")
                # Make CamelCase class name from path
                name = "Get" + "".join([name[0].upper() + name[1:]
                                        for name in name.split("/")])

                param_python = ""
                param_format_python = ""
                if "{" in path:
                    param = path.split("{")[-1].split("}")[0]
                    param_python = f", {JsonConverter.to_snake_case(param)}=''"
                    param_format_python = f".format({param}={JsonConverter.to_snake_case(param)})"

                config_python.append(f"class {name}(GetGraph):")
                config_python.append(f"    def __init__(self{param_python}):")
                config_python.append(
                    f"        super().__init__('{path}'{param_format_python})")
                config_python.append("\n")

        return "\n".join(config_python)

    def get_connector(self):
        return self._gaffer_connector

    def tear_down(self):
        self._gaffer_connector.close_connection()
        shutil.rmtree(self.generated_directory_path)
