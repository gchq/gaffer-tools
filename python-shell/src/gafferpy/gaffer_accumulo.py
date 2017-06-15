#
# Copyright 2016 Crown Copyright
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

"""
This module contains Python copies of Gaffer Accumulo Operations
"""

from gafferpy import gaffer as g


class GetElementsBetweenSets(g.GetOperation):
    def __init__(self,
                 seeds=None,
                 seeds_b=None,
                 view=None,
                 directed_type=g.DirectedType.EITHER,
                 in_out_type=g.InOutType.EITHER,
                 seed_matching_type=g.SeedMatchingType.RELATED,
                 options=None):
        super().__init__(
            class_name='uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets',
            seeds=seeds,
            view=view,
            directed_type=directed_type,
            in_out_type=in_out_type,
            seed_matching_type=seed_matching_type,
            options=options)
        self.seeds_b = seeds_b

    def to_json(self):
        operation = super().to_json()

        if self.seeds_b is not None:
            json_seeds_b = []
            for seed_b in self.seeds_b:
                if isinstance(seed_b, g.ElementSeed):
                    json_seeds_b.append(seed_b.to_json())
                elif isinstance(seed_b, str):
                    json_seeds_b.append(g.EntitySeed(seed_b).to_json())
                else:
                    raise TypeError(
                        'SeedsB argument must contain ElementSeed objects')
            operation['inputB'] = json_seeds_b
        return operation


class GetElementsWithinSet(g.GetOperation):
    def __init__(self,
                 seeds=None,
                 view=None,
                 directed_type=g.DirectedType.EITHER,
                 options=None):
        super().__init__(
            class_name='uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsWithinSet',
            seeds=seeds,
            view=view,
            directed_type=directed_type,
            in_out_type=None,
            options=options)


class GetElementsInRanges(g.GetOperation):
    def __init__(self,
                 seed_pairs=None,
                 view=None,
                 directed_type=g.DirectedType.EITHER,
                 in_out_type=g.InOutType.EITHER,
                 seed_matching_type=g.SeedMatchingType.RELATED,
                 options=None):
        super().__init__(
            class_name='uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsInRanges',
            seeds=None,
            view=view,
            directed_type=directed_type,
            in_out_type=in_out_type,
            seed_matching_type=seed_matching_type,
            options=options)
        self.seed_pairs = seed_pairs

    def to_json(self):
        operation = super().to_json()

        if self.seed_pairs is not None:
            json_seed_pairs = []
            for seed_pair in self.seed_pairs:
                if isinstance(seed_pair, g.SeedPair):
                    json_seed_pairs.append(seed_pair.to_json())
                else:
                    raise TypeError(
                        'seed_pairs argument must contain SeedPair objects')
            operation['input'] = json_seed_pairs
        return operation
