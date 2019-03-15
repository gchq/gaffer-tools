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
package uk.gov.gchq.gaffer.performancetesting.query;

import uk.gov.gchq.gaffer.performancetesting.TestProperties;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.EntitySeedSupplier;

/**
 * These properties are used to specify a {@link uk.gov.gchq.gaffer.performancetesting.query.QueryTest}.
 */
public class QueryTestProperties extends TestProperties {
    private static final long serialVersionUID = 3639506677531571597L;
    private static final String ID_SUPPLIER_CLASS = "gaffer.performancetesting.query.idSupplierClass";
    private static final String NUM_SEEDS = "gaffer.performancetesting.query.numSeeds";

    public QueryTestProperties() {
    }

    public String getElementIdSupplierClass() {
        return getProperty(ID_SUPPLIER_CLASS, EntitySeedSupplier.class.getName());
    }

    public void setElementIdSupplierClass(final String elementSupplierClass) {
        setProperty(ID_SUPPLIER_CLASS, elementSupplierClass);
    }

    public long getNumSeeds() {
        return Long.parseLong(getProperty(NUM_SEEDS, "" + 1000L));
    }

    public void setNumSeeds(final long numSeeds) {
        setProperty(NUM_SEEDS, "" + numSeeds);
    }
}
