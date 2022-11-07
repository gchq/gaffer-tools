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

import os
import re
import shutil
from jinja2 import Environment, FileSystemLoader
from gafferpy.gaffer_core import JsonConverter


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
        if data:
            with open(file_path, "w+") as file:
                file.write(data)

    def _get_config_name(self, url):
        name = url.replace("/graph", "").replace("/config", "")
        # Remove parameter
        name = re.sub(r"\/\{.*\}", "", name)
        # Make CamelCase class name
        name = name.strip("/")
        name = "Get" + "".join([name[0].upper() + name[1:] for name in name.split("/")])
        return name

    def _get_function_dict(self):
        return {
            "short_name": lambda n: n.rsplit(".", 1)[1].replace("$", ""),
            "snake_case": JsonConverter.to_snake_case,
            "get_fields": lambda f: self._gaffer_connector.get(
                f"/graph/config/serialisedFields/{f}", json_result=True),
            "config_name": self._get_config_name,
            "get_config_parameter": lambda n: re.sub(r".*\{", "", re.sub(r"\}.*", "", n))
        }

    def _generate_library(self):
        parent_dir = os.path.dirname(__file__)
        templates_dir = os.path.join(parent_dir, "templates")
        file_loader = FileSystemLoader(templates_dir)
        self.env = Environment(loader=file_loader)

        operations_python = self._generate_operations()
        functions_python = self._generate_transform_functions()
        predicates_python = self._generate_filter_functions()
        binary_operators_python = self._generate_aggregation_functions()
        config_python = self._generate_config()

        if os.path.exists(self.generated_directory_path):
            shutil.rmtree(self.generated_directory_path)

        os.mkdir(self.generated_directory_path)

        self._write_to_file(
            os.path.join(self.generated_directory_path, "functions.py"), functions_python)
        self._write_to_file(
            os.path.join(self.generated_directory_path, "predicates.py"), predicates_python)
        self._write_to_file(
            os.path.join(
                self.generated_directory_path, "binary_operators.py"), binary_operators_python)
        self._write_to_file(
            os.path.join(self.generated_directory_path, "operations.py"), operations_python)
        self._write_to_file(
            os.path.join(self.generated_directory_path, "config.py"), config_python)
        self._write_to_file(
            os.path.join(self.generated_directory_path, "__init__.py"),
            "__all__ = [\"operations\", \"predicates\", \"functions\", \"binary_operators\", \"config\"]\n")

    def _generate_transform_functions(self):
        return self._generate_functions(
            "transformFunctions",
            "gaffer_functions",
            "AbstractFunction")

    def _generate_filter_functions(self):
        return self._generate_functions(
            "filterFunctions",
            "gaffer_predicates",
            "AbstractPredicate")

    def _generate_aggregation_functions(self):
        return self._generate_functions(
            "aggregationFunctions",
            "gaffer_binaryoperators",
            "AbstractBinaryOperator")

    def _generate_functions(self, path, import_path, base_class):
        # Older Gaffer versions may be missing some function end points
        try:
            functions = self._gaffer_connector.get(f"/graph/config/{path}", json_result=True)
        except ConnectionError:
            print(f"/graph/config/{path} not present, skipping")
            return ""

        functions = sorted(functions)

        function_template = self.env.get_template("functions.py.j2")
        function_template.globals.update(self._get_function_dict())
        return function_template.render(
            functions=functions,
            import_path=import_path,
            base_class=base_class)

    def _generate_operations(self):
        # spring-rest has an endpoint for every store operation, even ones unsupported by the store
        # Check if this is supported: 2.0.0+, 1.23.0+
        try:
            operation_summaries = self._gaffer_connector.get(
                "/graph/operations/details/all", json_result=True)
        except ConnectionError:
            try:
                operation_summaries = self._gaffer_connector.get(
                    "/graph/operations/details", json_result=True)
            except ConnectionError:
                print(f"/graph/operations/details/ not present, skipping operations")
                return ""

        operation_summaries = sorted(operation_summaries, key=lambda op: op["name"])

        template = self.env.get_template("operations.py.j2")
        template.globals.update(self._get_function_dict())
        return template.render(operations=operation_summaries)

    def _generate_config(self):
        # Gaffer 2 spring-rest uses openapi3 rather than swagger2
        try:
            api_summaries = self._gaffer_connector.get("/v3/api-docs", json_result=True)
        except ConnectionError:
            try:
                api_summaries = self._gaffer_connector.get("/swagger.json", json_result=True)
            except ConnectionError:
                print(f"swagger information not present, skipping config")
                return ""

        configs = []
        for path, data in api_summaries["paths"].items():
            if path.startswith("/graph/") and "get" in data:
                configs.append(path)

        template = self.env.get_template("config.py.j2")
        template.globals.update(self._get_function_dict())
        return template.render(configs=configs)

    def get_connector(self):
        return self._gaffer_connector

    def tear_down(self):
        self._gaffer_connector.close_connection()
        shutil.rmtree(self.generated_directory_path)
