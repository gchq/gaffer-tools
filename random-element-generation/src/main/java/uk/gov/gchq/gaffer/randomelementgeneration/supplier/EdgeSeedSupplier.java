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

import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.operation.data.EdgeSeed;

import java.util.Random;

public class EdgeSeedSupplier implements ElementSeedSupplier<EdgeSeed> {
    protected final Random random = new Random();
    private final EntitySeedSupplier entitySeedSupplier;

    public EdgeSeedSupplier(final long maxNodeId) {
        this.entitySeedSupplier = new EntitySeedSupplier(maxNodeId);
    }

    @Override
    public EdgeSeed get() {
        return new EdgeSeed(entitySeedSupplier.get(), entitySeedSupplier.get(), DirectedType.EITHER);
    }
}
