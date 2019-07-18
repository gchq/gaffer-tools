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

import unittest

from gafferpy_core.gaffer_core import JoinType, MatchKey

from gafferpy_core import gaffer_operations as op
from gafferpy_core import gaffer_binaryoperators as bp
from gafferpy_core import gaffer_config as conf
from gafferpy_core import gaffer_functions as func

class gaffer_operations_test(unittest.TestCase):

    __generatorClass = func.ElementGenerator("uk.gov.gchq.gaffer.doc.operation.generator.ElementGenerator")

    def test_AddElements_can_be_instantiated(self):
        add_op = op.AddElements()
        assert add_op is not None

    def test_AddElementsFromFile_can_be_instantiated(self):
        add_op = op.AddElementsFromCsv()
        assert add_op is not None

    def test_AddElementsFromHdfsQuickstart_can_be_instantiated(self):
        add_op = op.AddElementsFromHdfsQuickstart()
        assert add_op is not None
    
    def test_AddElementsFromKafka_can_be_instantiated(self):
        add_op = op.AddElementsFromKafka(topic="",group_id="",bootstrap_servers="", element_generator="")
        assert add_op is not None
    
    def test_AddElementsFromSocket_can_be_instantiated(self):
        add_op = op.AddElementsFromSocket(element_generator="")
        assert add_op is not None
    
    def test_AddNamedView_can_be_instantiated(self):
        add_op = op.AddNamedView(view=op.View(), name="b")
        assert add_op is not None
    
    def test_Aggregrate_can_be_instantiated(self):
        agg_op = op.Aggregate()
        assert agg_op is not None
    
    def test_Count_can_be_instantiated(self):
        agg_op = op.Count()
        assert agg_op is not None

    def test_CountGroups_can_be_instantiated(self):
        agg_op = op.CountGroups()
        assert agg_op is not None

    def test_DeleteNamedView_can_be_instantiated(self):
        delete_op = op.DeleteNamedView(name="")
        assert delete_op is not None

    def test_ExportToGafferResultCache_can_be_instantiated(self):
        export_op = op.ExportToGafferResultCache()
        assert export_op is not None
        
    def test_ExportToOtherAuthorisedGraph_can_be_instantiated(self):
        export_op = op.ExportToOtherAuthorisedGraph()
        assert export_op is not None

    def test_ExportToOtherGraph_can_be_instantiated(self):
        export_op = op.ExportToOtherGraph()
        assert export_op is not None

    def test_ExportToSet_can_be_instantiated(self):
        export_op = op.ExportToSet()
        assert export_op is not None

    def test_Filter_can_be_instantiated(self):
        filter_op = op.Filter()
        assert filter_op is not None

    def test_GenerateElements_can_be_instantiated(self):
        generateElements = op.GenerateElements(element_generator=self.__generatorClass)
        assert generateElements is not None 

    def test_GenerateObjects_can_be_instantiated(self):
        generateObject = op.GenerateObjects(element_generator=self.__generatorClass)
        assert generateObject is not None

    def test_GetAdjacentIds_can_be_instantiated(self):
        get_op = op.GetAdjacentIds()
        assert get_op is not None

    def test_GetAllElements_can_be_instantiated(self):
        get_op = op.GetAllElements()
        assert get_op is not None

    def test_GetAllJobDetails_can_be_instantiated(self):
        get_op = op.GetAllJobDetails()
        assert get_op is not None

    def test_GetAllNamedViews_can_be_instantiated(self):
        get_op = op.GetAllNamedViews()
        assert get_op is not None

    def test_GetElements_can_be_instantiated(self):
        get_op = op.GetElements()
        assert get_op is not None

    def test_GetGafferResultCacheExport_can_be_instantiated(self):
        get_op = op.GetGafferResultCacheExport()
        assert get_op is not None

    def test_GetJobResults_can_be_instantiated(self):
        get_op = op.GetJobResults(job_id=0)
        assert get_op is not None

    def test_GetSchema_can_be_instantiated(self):
        get_op = conf.GetSchema()
        assert get_op is not None

    def test_GetSetExport_can_be_instantiated(self):
        get_op = conf.GetSchema()
        assert get_op is not None

    def test_GetTraits_can_be_instantiated(self):
        get_op = op.GetTraits(current_traits="")
        assert get_op is not None

    def test_GetWalks_can_be_instantiated(self):
        get_op = op.GetWalks()
        assert get_op is not None
    
    def test_If_can_be_instantiated(self):
        if_op = op.If()
        assert if_op is not None

    def test_Join_can_be_instantiated(self):
        join_op = op.Join(join_type=JoinType.INNER, match_key=MatchKey.LEFT)
        assert join_op is not None

    def test_Limit_can_be_instantiated(self):
        limit = op.Limit(result_limit=0)
        assert limit is not None

    def test_Map_can_be_instantiated(self):
        map = op.Map(functions="")
        assert map is not None

    def test_Max_can_be_instantiated(self):
        max = op.Max(comparators="")
        assert max is not None

    # def test_In_can_be_instantiated(self):
    #     IN = op.In()
    #     assert IN is not None

    def test_NamedOperation_can_be_instantiated(self):
        named_op = op.NamedOperation(operation_name="test")
        assert named_op is not None

    # def test_Reduce_can_be_instantiated(self): TODO: ADD A REDUCE OPERATION
    #     reduce = op.Reduce() 
    #     assert reduce is not None

    def test_ScoreOperationChain_can_be_instantiated(self):
        op_chain = op.OperationChain(operations=op.GetAllElements())
        score_op_chain = op.ScoreOperationChain(operation_chain=op_chain)
        assert score_op_chain is not None

    def test_Sort_can_be_instantiated(self):
        sort = op.Sort(comparators="")
        assert sort is not None

    def test_ToArray_can_be_instantiated(self):
        to_array = op.ToArray()
        assert to_array is not None

    def test_ToCsv_can_be_instantiated(self):
        to_csv = op.ToCsv(element_generator=func.CsvGenerator()) 
        assert to_csv is not None

    def test_ToEntitySeeds_can_be_instantiated(self):
        to_entity_seeds = op.ToEntitySeeds()
        assert to_entity_seeds is not None

    def test_ToList_can_be_instantiated(self):
        to_list = op.ToList()
        assert to_list is not None

    def test_ToMap_can_be_instantiated(self):
        to_map = op.ToMap(element_generator=func.MapGenerator())
        assert to_map is not None

    def test_ToSet_can_be_instantiated(self):
        to_set = op.ToSet()
        assert to_set is not None

    # def test_ToSingletonList_can_be_instantiated(self): TODO: ADD SINGLETON LIST
    #     to_singleton_list = op.ToSingletonList()
    #     assert to_singleton_list is not None

    def test_ToStream_can_be_instantiated(self):
        to_stream = op.ToStream()
        assert to_stream is not None

    def test_ToVertices_can_be_instantiated(self):
        to_vertices = op.ToVertices()
        assert to_vertices is not None

    def test_Transform_can_be_instantiated(self):
        transform = op.Transform()
        assert transform is not None

    def test_While_can_be_instantiated(self):
        WHILE = op.While()
        assert WHILE is not None

    def test_binaryOperator_Context_Converter(self):
        binary_op = bp.binary_operator_context_converter(obj={"class": "uk.gov.gchq.koryphe.impl.binaryoperator.And"})
        assert binary_op is not None

    def test_binaryOperator_Convert(self):
        bp_convert = bp.binary_operator_converter(obj={"class": "uk.gov.gchq.koryphe.impl.binaryoperator.And"})
        assert bp_convert is not None

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_operations_test)
    unittest.TextTestRunner(verbosity=2).run(suite)