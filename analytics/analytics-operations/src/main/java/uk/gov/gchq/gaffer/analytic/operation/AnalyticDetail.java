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

package uk.gov.gchq.gaffer.analytic.operation;

import com.google.common.collect.Maps;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.codehaus.jackson.annotate.JsonIgnore;

import uk.gov.gchq.gaffer.commonutil.ToStringBuilder;
import uk.gov.gchq.gaffer.user.User;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class AnalyticDetail implements Serializable {

    private static final long serialVersionUID = 704999037152944606L;
    private String analyticName;
    private String operationName;
    private String description;
    private String creatorId;
    private List<String> readAccessRoles;
    private List<String> writeAccessRoles;
    private Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
    private Map<String, String> options = Maps.newHashMap();
    private MetaData metaData;
    private OutputVisualisation outputVisualisation;
    private Integer score;

    public AnalyticDetail() {
    }

    public AnalyticDetail(final String analyticName, final String operationName, final String description,
                          final String userId, final List<String> readers,
                          final List<String> writers, final Map<String, UIMappingDetail> uiMapping,
                          final MetaData metaData,
                          final OutputVisualisation outputVisualisation, final Integer score,
                          final Map<String, String> options) {


        this.analyticName = analyticName;
        this.operationName = operationName;
        this.description = description;
        this.creatorId = userId;

        this.readAccessRoles = readers;
        this.writeAccessRoles = writers;
        this.uiMapping = uiMapping;
        this.metaData = metaData;
        this.outputVisualisation = outputVisualisation;
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

    public void setUiMapping(final Map<String, UIMappingDetail> uiMapping) {
        this.uiMapping = uiMapping;
    }

    public Integer getScore() {
        return score;
    }

    public Map<String, String> getOptions() {
        return options;
    }

    public MetaData getMetaData() {
        return metaData;
    }

    public OutputVisualisation getOutputVisualisation() {
        return outputVisualisation;
    }

    public void setOutputVisualisation(final OutputVisualisation outputVisualisation) {
        this.outputVisualisation = outputVisualisation;
    }

    @JsonIgnore
    public void setReadAccessRoles(final List<String> readAccessRoles) {
        this.readAccessRoles = readAccessRoles;
    }

    @JsonIgnore
    public void setWriteAccessRoles(final List<String> writeAccessRoles) {
        this.writeAccessRoles = writeAccessRoles;
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
                .append(creatorId, op.creatorId).append(readAccessRoles, op.readAccessRoles)
                .append(writeAccessRoles, op.writeAccessRoles).append(uiMapping, op.uiMapping)
                .append(metaData, op.metaData).append(outputVisualisation, op.outputVisualisation)
                .append(score, op.score)
                .append(options, op.options).isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(71, 3).append(analyticName).append(operationName).append(creatorId)
                .append(readAccessRoles).append(writeAccessRoles).append(uiMapping).append(metaData)
                .append(outputVisualisation).append(score).append(options).hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).appendSuper(super.toString()).append("analyticName", analyticName)
                .append("operationName", operationName).append("creatorId", creatorId)
                .append("readAccessRoles", readAccessRoles).append("writeAccessRoles", writeAccessRoles)
                .append("uiMapping", uiMapping).append("metaData", metaData)
                .append("outputVisualisation", outputVisualisation).append("score", score)
                .append("options", options).toString();
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
        private MetaData metaData;
        private OutputVisualisation outputVisualisation;
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

        public AnalyticDetail.Builder readers(final List<String> readers) {
            this.readers = readers;
            return this;
        }

        public AnalyticDetail.Builder writers(final List<String> writers) {
            this.writers = writers;
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

        public AnalyticDetail.Builder metaData(final MetaData metaData) {
            this.metaData = metaData;
            return this;
        }

        public AnalyticDetail.Builder outputVisualisation(final OutputVisualisation outputVisualisation) {
            this.outputVisualisation = outputVisualisation;
            return this;
        }

        public AnalyticDetail build() {
            return new AnalyticDetail(analyticName, operationName, description, creatorId, readers, writers, uiMapping,
                    metaData, outputVisualisation, score, options);
        }
    }
}
