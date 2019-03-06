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
package uk.gov.gchq.gaffer.performancetesting.ingest;

import uk.gov.gchq.gaffer.performancetesting.TestProperties;
import uk.gov.gchq.gaffer.randomelementgeneration.supplier.RmatElementSupplier;

/**
 * These properties are used to specify a {@link uk.gov.gchq.gaffer.performancetesting.ingest.IngestMetrics}.
 */
public class ElementIngestTestProperties extends TestProperties {
    private static final long serialVersionUID = 8594474188709038747L;
    private static final String ELEMENT_SUPPLIER_CLASS = "gaffer.performancetesting.ingest.elementSupplierClass";
    private static final String NUMBER_OF_ELEMENTS = "gaffer.performancetesting.ingest.numberOfElements";

    public ElementIngestTestProperties() {

    }

    public String getElementSupplierClass() {
        return getProperty(ELEMENT_SUPPLIER_CLASS, RmatElementSupplier.class.getName());
    }

    public void setElementSupplierClass(final String elementSupplierClass) {
        setProperty(ELEMENT_SUPPLIER_CLASS, elementSupplierClass);
    }

    public long getNumElements() {
        return Long.parseLong(getProperty(NUMBER_OF_ELEMENTS));
    }

    public void setNumElements(final long numEdges) {
        if (numEdges <= 0L) {
            throw new IllegalArgumentException("The number of edges must be greater than 0.");
        }
        setProperty(NUMBER_OF_ELEMENTS, "" + numEdges);
    }
}
