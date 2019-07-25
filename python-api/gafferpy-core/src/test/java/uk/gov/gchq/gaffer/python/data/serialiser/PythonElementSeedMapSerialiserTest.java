/*
 * Copyright 2016-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.python.data.serialiser;

import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.data.element.id.EdgeId;
import uk.gov.gchq.gaffer.operation.data.EdgeSeed;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.python.util.Constants;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class PythonElementSeedMapSerialiserTest {

    private String source = "source";
    private DirectedType directedType = DirectedType.DIRECTED;

    @Test
    public void testCanDefaultSerialiseEdgeSeed() {

        EdgeSeed edgeSeed = new EdgeSeed();
        edgeSeed.setIdentifiers(source, "dest", directedType);

        Map<String, Object> edgeSeedMap = new HashMap<>();

        edgeSeedMap.put(Constants.TYPE.getValue(), Constants.EDGE_SEED);
        edgeSeedMap.put(Constants.SOURCE.getValue(), source);
        edgeSeedMap.put(Constants.DESTINATION.getValue(), "dest");
        edgeSeedMap.put(Constants.DIRECTED.getValue(), directedType);
        edgeSeedMap.put(Constants.MATCHED_VERTEX.getValue(), EdgeId.MatchedVertex.SOURCE);

        PythonElementSeedMapSerialiser serialiser = new PythonElementSeedMapSerialiser();

        assertEquals(edgeSeedMap, serialiser.serialise(edgeSeed));

    }

    @Test
    public void testCanDefaultSerialiseEntitySeed() {

        EntitySeed entitySeed = new EntitySeed();
        entitySeed.setVertex(source);

        Map<String, Object> entitySeedMap = new HashMap<>();

        entitySeedMap.put(Constants.TYPE.getValue(), Constants.ENTITY_SEED);
        entitySeedMap.put(Constants.VERTEX.getValue(), source);

        PythonElementSeedMapSerialiser serialiser = new PythonElementSeedMapSerialiser();

        assertEquals(entitySeedMap, serialiser.serialise(entitySeed));

    }

}
