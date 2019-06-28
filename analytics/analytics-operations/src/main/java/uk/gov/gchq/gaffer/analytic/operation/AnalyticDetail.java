/*
 * Copyright 2019 Crown Copyright
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

package uk.gov.gchq.gaffer.analytic.operation;

import com.google.common.collect.Maps;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import uk.gov.gchq.gaffer.commonutil.ToStringBuilder;

import java.io.Serializable;
import java.util.Map;

public class AnalyticDetail implements Serializable {

    private String analyticName;
    private String operationName;
    private String description;
    private String creatorId;
    private Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
    private Map<String, String> options = Maps.newHashMap();
    private Map<String, String> metaData = Maps.newHashMap();
    private Map<String, String> outputType = Maps.newHashMap();
    private Integer score;

    public AnalyticDetail() {
    }

    public AnalyticDetail(final String analyticName, final String operationName, final String description,
                          final String userId, final Map<String, UIMappingDetail> uiMapping,
                          final Map<String, String> metaData, final Map<String, String> outputType,
                          final Integer score, final Map<String, String> options) {

        if (null == operationName || operationName.isEmpty()) {
            throw new IllegalArgumentException("Operation Name must not be empty.");
        }

        if (null == analyticName || analyticName.isEmpty()) {
            throw new IllegalArgumentException("Analytic Name must not be empty.");
        }

        this.analyticName = analyticName;
        this.operationName = operationName;
        this.description = description;
        this.creatorId = userId;

        this.uiMapping = uiMapping;
        this.metaData = metaData;
        this.outputType = outputType;
        this.score = score;
        this.options = options;
    }

    public String getAnalyticName() {
        return analyticName;
    }

    public String getOperationName() {
        return operationName;
    }

    public String getDescription() {
        return description;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public Map<String, UIMappingDetail> getUiMapping() {
        return uiMapping;
    }

    public void setUiMapping(final Map<String, UIMappingDetail> uiMapping) {
        this.uiMapping = uiMapping;
    }

    public Integer getScore() {
        return score;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public Map<String, String> getMetaData() {
        return metaData;
    }

    public Map<String, String> getOutputType() {
        return outputType;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if (null == obj || getClass() != obj.getClass()) {
            return false;
        }

        final AnalyticDetail op = (AnalyticDetail) obj;

        return new EqualsBuilder().append(analyticName, op.analyticName).append(operationName, op.operationName)
                .append(creatorId, op.creatorId).append(uiMapping, op.uiMapping)
                .append(metaData, op.metaData).append(outputType, op.outputType).append(score, op.score)
                .append(options, op.options).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(71, 3).append(analyticName).append(operationName).append(creatorId)
                .append(uiMapping).append(metaData).append(outputType)
                .append(score).append(options).hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).appendSuper(super.toString()).append("analyticName", analyticName)
                .append("operationName", operationName).append("creatorId", creatorId)
                .append("uiMapping", uiMapping).append("metaData", metaData).append("outputType", outputType)
                .append("score", score).append("options", options).toString();
    }

    public static final class Builder {
        private String analyticName;
        private String operationName;
        private String description;
        private String creatorId;
        private Map<String, UIMappingDetail> uiMapping;
        private Map<String, String> metaData;
        private Map<String, String> outputType;
        private Integer score;
        private Map<String, String> options;

        public AnalyticDetail.Builder creatorId(final String creatorId) {
            this.creatorId = creatorId;
            return this;
        }

        public AnalyticDetail.Builder analyticName(final String analyticName) {
            this.analyticName = analyticName;
            return this;
        }

        public AnalyticDetail.Builder operationName(final String operationName) {
            this.operationName = operationName;
            return this;
        }

        public AnalyticDetail.Builder description(final String description) {
            this.description = description;
            return this;
        }

        public AnalyticDetail.Builder uiMapping(final Map<String, UIMappingDetail> uiMapping) {
            this.uiMapping = uiMapping;
            return this;
        }

        public AnalyticDetail.Builder score(final Integer score) {
            this.score = score;
            return this;
        }

        public AnalyticDetail.Builder options(final Map<String, String> options) {
            this.options = options;
            return this;
        }

        public AnalyticDetail.Builder metaData(final Map<String, String> metaData) {
            this.metaData = metaData;
            return this;
        }

        public AnalyticDetail.Builder outputType(final Map<String, String> outputType) {
            this.outputType = outputType;
            return this;
        }

        public AnalyticDetail build() {
            return new AnalyticDetail(analyticName, operationName, description, creatorId, uiMapping,
                    metaData, outputType, score, options);
        }
    }
}
