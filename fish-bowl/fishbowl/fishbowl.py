from fishbowl.util import *

import os
import shutil

OPERATION_CHAIN_DAO = "uk.gov.gchq.gaffer.operation.OperationChainDAO"


class Fishbowl:
    def __init__(self, gaffer_connector, generated_directory_path="generated"):
        self._gaffer_connector = gaffer_connector
        self.generated_directory_path = generated_directory_path
        print("Generating python Library from REST service")
        self.__generate_library()
        print("done")
        print("To import operations, predicates and functions, use the following command:")
        print("from " + generated_directory_path + " import *")

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
        # functions is a list of function classes
        functions = self._gaffer_connector.get(path)

        functions_python = ["from fishbowl.core import *\n\n"]

        for fn in functions:
            # functions is a list of function classes
            function_fields = self._gaffer_connector.get("/graph/config/serialisedFields/" + fn)

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
        operation_summaries = self._gaffer_connector.get("/graph/operations/details")

        operations_python = ["from fishbowl.core import *\n\n"]

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

    def get_connector(self):
        return self._gaffer_connector

    def tear_down(self):
        self._gaffer_connector.close_connection()
        shutil.rmtree(self.generated_directory_path)
