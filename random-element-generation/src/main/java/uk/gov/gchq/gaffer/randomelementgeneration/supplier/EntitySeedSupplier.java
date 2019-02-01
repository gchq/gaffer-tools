/*
 * Copyright 2017-2019 Crown Copyright
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
package uk.gov.gchq.gaffer.randomelementgeneration.supplier;

import uk.gov.gchq.gaffer.operation.data.EntitySeed;

import java.util.Random;

public class EntitySeedSupplier implements ElementSeedSupplier<EntitySeed> {
    protected final Random random = new Random();
    private final long maxNodeId;
    private final int numBits;

    public EntitySeedSupplier(final long maxNodeId) {
        this.maxNodeId = maxNodeId;
        this.numBits = (int) (Math.log(maxNodeId) / Math.log(2));
    }

    @Override
    public EntitySeed get() {
        // Random number in range 0 to 1 << (numBits - 1)
        long id = 0L;
        for (int i = 0; i < numBits; i++) {
            if (random.nextDouble() < 0.5D) {
                id = id ^ (1 << i);
            }
        }
        return new EntitySeed(id);
    }
}
