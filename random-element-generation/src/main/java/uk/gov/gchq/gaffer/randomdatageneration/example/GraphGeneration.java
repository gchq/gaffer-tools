/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package uk.gov.gchq.gaffer.randomdatageneration.example;

import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.operation.OperationChain;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.impl.add.AddElements;
import uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllEdges;
import uk.gov.gchq.gaffer.operation.impl.get.GetAllEntities;
import uk.gov.gchq.gaffer.randomdatageneration.Constants;
import uk.gov.gchq.gaffer.randomdatageneration.generator.RandomElementGenerator;
import uk.gov.gchq.gaffer.randomdatageneration.generator.RandomElementGeneratorWithRepeats;
import uk.gov.gchq.gaffer.user.User;

import java.util.Arrays;
import java.util.Collections;
import java.util.stream.StreamSupport;

/**
 *
 */
public class GraphGeneration {
    private Graph graph;
    private long numNodes;
    private long numEdges;
    private double[] probabilities;
    private boolean withRepeats = false;
    private double repeatProbability;

    public GraphGeneration() {

    }

    public GraphGeneration(final Graph graph,
                           final long numNodes,
                           final long numEdges,
                           final double[] probabilities) {
        this.graph = graph;
        this.numNodes = numNodes;
        this.numEdges = numEdges;
        this.probabilities = Arrays.copyOf(probabilities, probabilities.length);
        this.withRepeats = false;
    }

    public GraphGeneration(final Graph graph,
                           final long numNodes,
                           final long numEdges,
                           final double[] probabilities,
                           final double repeatProbability) {
        this.graph = graph;
        this.numNodes = numNodes;
        this.numEdges = numEdges;
        this.probabilities = Arrays.copyOf(probabilities, probabilities.length);
        this.withRepeats = true;
        this.repeatProbability = repeatProbability;
    }

    public void run() throws OperationException {
        final RandomElementGenerator elementGenerator;
        if (!withRepeats) {
            elementGenerator = new RandomElementGenerator(numNodes, numEdges, probabilities);
        } else {
            elementGenerator = new RandomElementGeneratorWithRepeats(numNodes, numEdges, probabilities, repeatProbability);
        }
        final OperationChain addOpChain = new OperationChain.Builder()
                .first(new GenerateElements.Builder<String>()
                        .generator(elementGenerator)
                        .objects(Collections.singleton(""))
                        .build())
                .then(new AddElements())
                .build();
        graph.execute(addOpChain, new User());
    }

    public static class Builder {
        private final GraphGeneration graphGeneration;

        public Builder() {
            graphGeneration = new GraphGeneration();
        }

        public Builder graph(final Graph graph) {
            graphGeneration.graph = graph;
            return this;
        }

        public Builder numNodes(final long numNodes) {
            graphGeneration.numNodes = numNodes;
            return this;
        }

        public Builder numEdges(final long numEdges) {
            graphGeneration.numEdges = numEdges;
            return this;
        }

        public Builder probabilities(final double[] probabilities) {
            graphGeneration.probabilities = probabilities;
            return this;
        }

        public Builder repeatProbability(final double repeatProbability) {
            graphGeneration.withRepeats = true;
            graphGeneration.repeatProbability = repeatProbability;
            return this;
        }

        public GraphGeneration build() {
            return graphGeneration;
        }
    }

    public static void main(final String[] args) throws OperationException {
        final Graph graph = new Graph.Builder()
                .storeProperties(GraphGeneration.class.getResourceAsStream("/mockaccumulostore.properties"))
                .addSchema(GraphGeneration.class.getResourceAsStream("/schema/DataSchema.json"))
                .addSchema(GraphGeneration.class.getResourceAsStream("/schema/DataTypes.json"))
                .addSchema(GraphGeneration.class.getResourceAsStream("/schema/StoreTypes.json"))
                .build();

        final GraphGeneration graphGeneration = new GraphGeneration.Builder()
                .graph(graph)
                .numNodes(1000)
                .numEdges(10000L)
                .probabilities(new Constants().rmatProbabilities)
                .build();

        graphGeneration.run();

        final GetAllEntities getAllEntities = new GetAllEntities.Builder().build();
        CloseableIterable<Entity> entities = graph.execute(getAllEntities, new User());
        System.out.println("Number of entities = " + StreamSupport.stream(entities.spliterator(), false).count());

        final GetAllEdges getAllEdges = new GetAllEdges.Builder().build();
        CloseableIterable<Edge> edges = graph.execute(getAllEdges, new User());
        System.out.println("Number of edges = " + StreamSupport.stream(edges.spliterator(), false).count());
    }
}
