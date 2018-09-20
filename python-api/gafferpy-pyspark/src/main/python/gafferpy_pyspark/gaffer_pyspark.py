"""
This module contains python operation specific to gaffer pyspark
"""


from gafferpy_core import gaffer as g

class GetPythonRDDConfiguration(g.GetOperation):
    """
    A python version of the Java operation at uk.gov.gchq.gaffer.python.operation.pyspark.GetPythonRDDConfiguration.
    The operation returns a Hadoop configuration that can be used to create a python rdd
    """

    CLASS = 'uk.gov.gchq.gaffer.python.pyspark.operation.GetPythonRDDConfiguration'

    def __init__(self,
                 options=None,
                 view=None,
                 ):

        super().__init__(
            _class_name=self.CLASS,
            view=view,
            options=options)



class GetPySparkRDDOfAllElements(g.GetOperation):
    """
    An gaffer operation that returns a python rdd - the analog of GetRDDOfAllElements in the Gaffer spark library
    This operation only exists in a python version
    """
    CLASS = 'getPySparkRDDOfAllElements'

    pythonSerialiserClass=None

    def __init__(self, view=None, options=None, pythonSerialiserClass=None):

        self.pythonSerialiserClass = pythonSerialiserClass

        super().__init__(_class_name=self.CLASS, input=None, view=view, options=options)


class GetPysparkDataFrameOfElements(g.GetOperation):
    """
    returns a dataframe of elements
    """

    CLASS = 'getPysparkDataFrameOfElements'

    pythonSerialiserClass=None
    sampleFraction=None

    def __init__(self, view=None, options=None, pythonSerialiserClass=None, sampleRatio=None):

        self.pythonSerialiserClass = pythonSerialiserClass
        self.sampleRatio = sampleRatio

        super().__init__(_class_name=self.CLASS, input=None, view=view, options=options)

class AddElementsFromPysparkRDD():
    """
    Adds elements to a gaffer graph from an RDD of elements
    """

    CLASS='AddElementsFromPysparkRDD'

    def __init__(self, rdd=None, outputDirectory=None):
        self.outputDirectory=outputDirectory
        self.rdd=rdd


class ImportAccumuloKeyValueFiles(g.Operation):
    """
    imports rfiles to gaffer-accumulo from a directory
    """
    CLASS='uk.gov.gchq.gaffer.accumulostore.operation.hdfs.operation.ImportAccumuloKeyValueFiles'

    def __init__(self, inputPath=None, failurePath=None, options=None):
        self.inputPath=inputPath
        self.failurePath=failurePath
        self.options=options

        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=None)

    def to_json(self):
        operation = super().to_json()
        if self.inputPath is not None:
            operation['inputPath'] = self.inputPath
        if self.failurePath is not None:
            operation['failurePath'] = self.failurePath
        return operation












