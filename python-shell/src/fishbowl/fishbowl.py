from gafferpy.gaffer_core import JsonConverter

import os
import shutil

OPERATION_CHAIN_DAO = "uk.gov.gchq.gaffer.operation.OperationChainDAO"


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

        self._write_to_file(os.path.join(self.generated_directory_path, "functions.py"), functions_python)
        self._write_to_file(os.path.join(self.generated_directory_path, "predicates.py"), predicates_python)
        self._write_to_file(os.path.join(self.generated_directory_path, "operations.py"), operations_python)
        self._write_to_file(os.path.join(self.generated_directory_path, "__init__.py"),
                      "__all__ = [ \"operations\", \"predicates\", \"functions\" ]\n")

    def _generate_transform_functions(self):
        return self._generate_functions("/graph/config/transformFunctions", "gaffer_functions", "AbstractFunction")

    def _generate_filter_functions(self):
        return self._generate_functions("/graph/config/filterFunctions", "gaffer_predicates", "AbstractPredicate")

    def _generate_aggregation_functions(self):
        return self._generate_functions("/graph/config/aggregationFunctions", "gaffer_binaryoperators", "AbstractBinaryOperator")

    def _generate_functions(self, path, import_path, base_class):
        # functions is a list of function classes
        functions = self._gaffer_connector.get(path, json_result=True)

        functions_python = [f"from gafferpy.{import_path} import {base_class}\n\n"]

        for fn in functions:
            # functions is a list of function classes
            function_fields = self._gaffer_connector.get("/graph/config/serialisedFields/" + fn, json_result=True)

            # Map of fields to snake case fields
            function_field_mappings = dict()
            for field in function_fields:
                function_field_mappings[field] = JsonConverter.to_snake_case(field)

            functions_python.append("class " + fn.rsplit(".", 1)[1].replace("$", "") + f"({base_class}):")
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

    def _generate_operations(self):
        # Gaffer 2 spring-rest has an endpoint for every store operation, even ones unsupported by the store
        try:
            operation_summaries = self._gaffer_connector.get("/graph/operations/details/all", json_result=True)
        except ConnectionError:
            operation_summaries = self._gaffer_connector.get("/graph/operations/details", json_result=True)

        operations_python = ["from gafferpy.gaffer_operations import Operation\n\n"]

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
                        fields[field_name] = JsonConverter.to_snake_case(field_name)

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

    def get_connector(self):
        return self._gaffer_connector

    def tear_down(self):
        self._gaffer_connector.close_connection()
        shutil.rmtree(self.generated_directory_path)
