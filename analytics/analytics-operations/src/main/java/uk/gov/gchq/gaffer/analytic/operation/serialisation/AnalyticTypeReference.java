/*
 * Copyright 2019-2020 Crown Copyright
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

package uk.gov.gchq.gaffer.analytic.operation.serialisation;

import com.fasterxml.jackson.core.type.TypeReference;

import uk.gov.gchq.gaffer.analytic.operation.AnalyticDetail;
import uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable;

/**
 * {@link TypeReference} objects for analytic operations.
 */
public final class AnalyticTypeReference {
    private AnalyticTypeReference() {
        // Private constructor to prevent instantiation.
    }

    public static class SingularAnalyticOperationDetail extends TypeReference<AnalyticDetail> {
    }

    public static class IterableAnalyticOperationDetail extends TypeReference<CloseableIterable<AnalyticDetail>> {
    }

}
