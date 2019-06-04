# Random element generation

This module allows the creation of randomly generated large-scale graphs. It is extensible in that new random element generation techniques can be used. Currently it provides an implementation of the [RMAT](http://www.cs.cmu.edu/~christos/PUBLICATIONS/siam04.pdf) graph generation technique. The user specifies the number of elements the graph should have. The nodes are longs between 0 and the number of nodes specified. Edges are generated at random between nodes. The RMAT technique ensures that the degree distribution is roughly power-law. The Edges have a simple count. The Entities also have a count and a HyperLogLogPlusPlus sketch which gives an approximation of the degree.

The class `RandomElementGenerator` can be used to produce an `Iterable` of random elements.

