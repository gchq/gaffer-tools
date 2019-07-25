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
package uk.gov.gchq.gaffer.randomelementgeneration;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

/**
 *
 */
public final class Constants {

    /**
     * These values are taken from @see
     * <a href="http://www.graph500.org/specifications#sec-3_3">the Graph500 specifications</a>.
     */
    @SuppressFBWarnings("MS_MUTABLE_ARRAY")
    public static final double[] RMAT_PROBABILITIES = new double[]{0.57, 0.19, 0.19, 1.0 - 0.57 - 0.19 - 0.19};

    private Constants() {

    }
}
