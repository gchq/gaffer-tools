/*
 * Copyright 2016-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.operation.analytic;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.core.type.TypeReference;

import uk.gov.gchq.gaffer.operation.analytic.serialisation.SingleAnalyticOperationTypeReference;
import uk.gov.gchq.gaffer.operation.io.Output;
import uk.gov.gchq.koryphe.Since;
import uk.gov.gchq.koryphe.Summary;

import java.util.Map;

/**
 * A {@link GetAnalyticOperation} is an {@link uk.gov.gchq.gaffer.operation.Operation}
 * for retrieving all {@link AnalyticOperationDetail}s associated with a Gaffer graph.
 */
@JsonPropertyOrder(value = {"class", "analyticName"}, alphabetic = true)
@Since("1.0.0")
@Summary("Gets all available analytic operations")
public class GetAnalyticOperation implements
        Output<AnalyticOperationDetail> {
    private Map<String, String> options;
    private String analyticName;

    public String getAnalyticName() {
        return analyticName;
    }

    public void setAnalyticName(final String analyticName) {
        this.analyticName = analyticName;
    }

    @Override
    public TypeReference<AnalyticOperationDetail> getOutputTypeReference() {
        return new SingleAnalyticOperationTypeReference.SingularAnalyticOperationDetail();
    }

    @Override
    public GetAnalyticOperation shallowClone() {
        return new GetAnalyticOperation.Builder()
                .analyticName(analyticName)
                .options(options)
                .build();
    }

    @Override
    public Map<String, String> getOptions() {
        return options;
    }

    @Override
    public void setOptions(final Map<String, String> options) {
        this.options = options;
    }

    public static class Builder extends BaseBuilder<GetAnalyticOperation, Builder>
            implements Output.Builder<GetAnalyticOperation, AnalyticOperationDetail, GetAnalyticOperation.Builder> {
        public Builder() {
            super(new GetAnalyticOperation());
        }

        public GetAnalyticOperation.Builder analyticName(final String analyticName) {
            _getOp().setAnalyticName(analyticName);
            return _self();
        }
    }
}
