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

import com.google.common.collect.Maps;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import uk.gov.gchq.gaffer.commonutil.ToStringBuilder;
import uk.gov.gchq.gaffer.user.User;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class AnalyticOperationDetail implements Serializable {

    private String analyticName;
    private String operationName;
    private String description;
    private String creatorId;
    private List<String> readAccessRoles;
    private List<String> writeAccessRoles;
    private Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
    private Map<String, String> options = Maps.newHashMap();
    private Map<String, String> metaData = Maps.newHashMap();
    private Map<String, String> outputType = Maps.newHashMap();
    private Integer score;

    public AnalyticOperationDetail() {
    }

    public AnalyticOperationDetail(final String analyticName, final String operationName, final String description,
                                   final String userId, final List<String> readers,
                                   final List<String> writers, final Map<String, UIMappingDetail> uiMapping,
                                   final Map<String, String> metaData, final Map<String, String> outputType,
                                   final Integer score, final Map<String, String> options) {

        if (null == operationName || operationName.isEmpty()) {
            throw new IllegalArgumentException("Operation Name must not be empty");
        }

        if (null == analyticName || analyticName.isEmpty()) {
            throw new IllegalArgumentException("Analytic Name must not be empty");
        }

        this.analyticName = analyticName;
        this.operationName = operationName;
        this.description = description;
        this.creatorId = userId;

        this.readAccessRoles = readers;
        this.writeAccessRoles = writers;
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

    public List<String> getReadAccessRoles() {
        return readAccessRoles;
    }

    public List<String> getWriteAccessRoles() {
        return writeAccessRoles;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public Map<String, UIMappingDetail> getUiMapping() {
        return uiMapping;
    }

    public void setUiMapping(Map<String, UIMappingDetail> parameters) {
        this.uiMapping = parameters;
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

        final AnalyticOperationDetail op = (AnalyticOperationDetail) obj;

        return new EqualsBuilder()
                .append(analyticName, op.analyticName)
                .append(operationName, op.operationName)
                .append(creatorId, op.creatorId)
                .append(readAccessRoles, op.readAccessRoles)
                .append(writeAccessRoles, op.writeAccessRoles)
                .append(uiMapping, op.uiMapping)
                .append(metaData, op.metaData)
                .append(outputType, op.outputType)
                .append(score, op.score)
                .append(options, op.options)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(71, 3)
                .append(analyticName)
                .append(operationName)
                .append(creatorId)
                .append(readAccessRoles)
                .append(writeAccessRoles)
                .append(uiMapping)
                .append(metaData)
                .append(outputType)
                .append(score)
                .append(options)
                .hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .appendSuper(super.toString())
                .append("analyticName", analyticName)
                .append("operationName", operationName)
                .append("creatorId", creatorId)
                .append("readAccessRoles", readAccessRoles)
                .append("writeAccessRoles", writeAccessRoles)
                .append("uiMapping", uiMapping)
                .append("metaData", metaData)
                .append("outputType", outputType)
                .append("score", score)
                .append("options", options)
                .toString();
    }

    public boolean hasReadAccess(final User user) {
        return hasAccess(user, readAccessRoles, null);
    }

    public boolean hasReadAccess(final User user, final String adminAuth) {
        return hasAccess(user, readAccessRoles, adminAuth);
    }

    public boolean hasWriteAccess(final User user) {
        return hasAccess(user, writeAccessRoles, null);
    }

    public boolean hasWriteAccess(final User user, final String adminAuth) {
        return hasAccess(user, writeAccessRoles, adminAuth);
    }

    private boolean hasAccess(final User user, final List<String> roles, final String adminAuth) {
        if (null != roles) {
            for (final String role : roles) {
                if (user.getOpAuths().contains(role)) {
                    return true;
                }
            }
        }
        if (StringUtils.isNotBlank(adminAuth)) {
            if (user.getOpAuths().contains(adminAuth)) {
                return true;
            }
        }
        return user.getUserId().equals(creatorId);
    }

    public static final class Builder {
        private String analyticName;
        private String operationName;
        private String description;
        private String creatorId;
        private List<String> readers;
        private List<String> writers;
        private Map<String, UIMappingDetail> uiMapping;
        private Map<String, String> metaData;
        private Map<String, String> outputType;
        private Integer score;
        private Map<String, String> options;

        public AnalyticOperationDetail.Builder creatorId(final String creatorId) {
            this.creatorId = creatorId;
            return this;
        }

        public AnalyticOperationDetail.Builder analyticName(final String analyticName) {
            this.analyticName = analyticName;
            return this;
        }

        public AnalyticOperationDetail.Builder operationName(final String operationName) {
            this.operationName = operationName;
            return this;
        }

        public AnalyticOperationDetail.Builder description(final String description) {
            this.description = description;
            return this;
        }

        public AnalyticOperationDetail.Builder uiMapping(final Map<String, UIMappingDetail> uiMapping) {
            this.uiMapping = uiMapping;
            return this;
        }

        public AnalyticOperationDetail.Builder readers(final List<String> readers) {
            this.readers = readers;
            return this;
        }

        public AnalyticOperationDetail.Builder writers(final List<String> writers) {
            this.writers = writers;
            return this;
        }

        public AnalyticOperationDetail.Builder score(final Integer score) {
            this.score = score;
            return this;
        }

        public AnalyticOperationDetail.Builder options(final Map<String, String> options) {
            this.options = options;
            return this;
        }

        public AnalyticOperationDetail.Builder metaData(final Map<String, String> metaData) {
            this.metaData = metaData;
            return this;
        }

        public AnalyticOperationDetail.Builder outputType(final Map<String, String> outputType) {
            this.outputType = outputType;
            return this;
        }

        public AnalyticOperationDetail build() {
            return new AnalyticOperationDetail(analyticName, operationName, description, creatorId, readers, writers, uiMapping, metaData, outputType, score, options);
        }
    }
}
