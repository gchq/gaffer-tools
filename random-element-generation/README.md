<!--
Copyright 2017 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

Random element generation
=========================

This module allows the creation of randomly generated large-scale graphs. Currently it uses the [RMAT](http://www.cs.cmu.edu/~christos/PUBLICATIONS/siam04.pdf) graph generation technique. The user specifies the number of nodes and edges the graph should have. The nodes are longs between 0 and the number of nodes specified. Edges are generated at random between nodes. The RMAT technique ensures that the degree distribution is roughly power-law. The Edges have a simple count. The Entities also have a count and a HyperLogLogPlusPlus sketch which gives an approximation to the degree.

The Example class shows how to add random data to a Gaffer graph backed by Accumulo.

Planned improvements:

- Power-law repetition of Edges: Typically some of the Edges in a graph will have a count of 1, while others may have a large count. (Note that this is a different issue to having a power-law degree distribution.) This could be achieved by maintaining a cache of some of the previously emitted edges in the generator and periodically re-emitting some of these edges, using a preferential attachment approach to ensure that some of the elements in the cache are emitted many more times than others.
- Configurable creation of arbitrary properties on the Elements: For example, generation of a FreqMap on every Edge.
- Bulk import: Provide an graphGeneration of using the RandomElementGenerator in a bulk import job.
- Large-scale testing:
    - Functional testing: It would be useful to be able to run test suites on a cluster that add a large amount of random elements, in such a way that queries can be run and their results verified, to ensure that at scale, aggregation is happening correctly, and that no data is lost.
    - Performance testing: Measure the sustained ingest rate and query rate. Ideally it would be possible, using Apache Slider, to deploy Accumulo, Gaffer, and multiple ingest and query clients to a YARN cluster with one command, and to receive metrics about ingest rates, etc.
