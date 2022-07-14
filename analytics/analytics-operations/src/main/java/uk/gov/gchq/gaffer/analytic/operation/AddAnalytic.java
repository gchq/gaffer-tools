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

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import uk.gov.gchq.gaffer.commonutil.Required;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.koryphe.Since;
import uk.gov.gchq.koryphe.Summary;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Objects.isNull;

@JsonPropertyOrder(value = {"class", "analyticName", "operationName", "description", "score"}, alphabetic = true)
@Since("1.10.0")
@Summary("Adds a new analytic")
public class AddAnalytic implements Operation {
    @Required
    private String analyticName;
    private String operationName;
    private String description;
    private List<String> readAccessRoles = new ArrayList<>();
    private List<String> writeAccessRoles = new ArrayList<>();
    private boolean overwriteFlag = false;
    private Map<String, UIMappingDetail> uiMapping;
    private Map<String, String> options;
    private Integer score;
    private MetaData metaData;
    private OutputVisualisation outputVisualisation;

    public boolean isOverwriteFlag() {
        return overwriteFlag;
    }

    public void setOverwriteFlag(final boolean overwriteFlag) {
        this.overwriteFlag = overwriteFlag;
    }

    public void setAnalyticName(final String analyticName) {
        this.analyticName = analyticName;
    }

    public String getAnalyticName() {
        return analyticName;
    }

    public String getOperationName() {
        return operationName;
    }

    public void setOperationName(final String operationName) {
        this.operationName = operationName;
    }

    public List<String> getReadAccessRoles() {
        return readAccessRoles;
    }

    public void setReadAccessRoles(final List<String> readAccessRoles) {
        this.readAccessRoles = readAccessRoles;
    }

    public List<String> getWriteAccessRoles() {
        return writeAccessRoles;
    }

    public void setWriteAccessRoles(final List<String> writeAccessRoles) {
        this.writeAccessRoles = writeAccessRoles;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public void setUiMapping(final Map<String, UIMappingDetail> uiMapping) {
        this.uiMapping = uiMapping;
    }

    public Map<String, UIMappingDetail> getUiMapping() {
        return uiMapping;
    }

    public void setMetaData(final MetaData metaData) {
        this.metaData = metaData;
    }

    public MetaData getMetaData() {
        return metaData;
    }


    @Override
    public AddAnalytic shallowClone() {
        return new AddAnalytic.Builder().analyticName(analyticName).operationName(operationName)
                .description(description).readAccessRoles(readAccessRoles.toArray(new String[readAccessRoles.size()]))
                .writeAccessRoles(writeAccessRoles.toArray(new String[writeAccessRoles.size()]))
                .overwrite(overwriteFlag).uiMapping(uiMapping).metaData(metaData).outputVisualisation(outputVisualisation)
                .options(options).score(score).build();
    }

    @Override
    public Map<String, String> getOptions() {
        return options;
    }

    @Override
    public void setOptions(final Map<String, String> options) {
        this.options = options;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(final Integer score) {
        this.score = score;
    }

    public OutputVisualisation getOutputVisualisation() {
        return outputVisualisation;
    }

    public void setOutputVisualisation(final OutputVisualisation outputVisualisation) {
        this.outputVisualisation = outputVisualisation;
    }

    public static class Builder extends BaseBuilder<AddAnalytic, AddAnalytic.Builder> {
        public Builder() {
            super(new AddAnalytic());
        }

        public AddAnalytic.Builder analyticName(final String analyticName) {
            _getOp().setAnalyticName(analyticName);
            return _self();
        }

        public AddAnalytic.Builder operationName(final String name) {
            _getOp().setOperationName(name);
            return _self();
        }

        public AddAnalytic.Builder description(final String description) {
            _getOp().setDescription(description);
            return _self();
        }

        public AddAnalytic.Builder readAccessRoles(final String... roles) {
            Collections.addAll(_getOp().getReadAccessRoles(), roles);
            return _self();
        }

        public AddAnalytic.Builder writeAccessRoles(final String... roles) {
            Collections.addAll(_getOp().getWriteAccessRoles(), roles);
            return _self();
        }

        public AddAnalytic.Builder uiMapping(final Map<String, UIMappingDetail> uiMapping) {
            _getOp().setUiMapping(uiMapping);
            return _self();
        }

        public AddAnalytic.Builder uiMapping(final String name, final UIMappingDetail detail) {
            Map<String, UIMappingDetail> uiMapping = _getOp().getUiMapping();
            if (isNull(uiMapping)) {
                uiMapping = new HashMap<>();
                _getOp().setUiMapping(uiMapping);
            }
            uiMapping.put(name, detail);
            return _self();
        }

        public AddAnalytic.Builder metaData(final MetaData metaData) {
            _getOp().setMetaData(metaData);
            return _self();
        }

        public AddAnalytic.Builder outputVisualisation(final OutputVisualisation outputVisualisation) {
            _getOp().setOutputVisualisation(outputVisualisation);
            return _self();
        }

        public AddAnalytic.Builder overwrite(final boolean overwriteFlag) {
            _getOp().setOverwriteFlag(overwriteFlag);
            return _self();
        }

        public AddAnalytic.Builder overwrite() {
            return overwrite(true);
        }

        public AddAnalytic.Builder score(final Integer score) {
            _getOp().setScore(score);
            return _self();
        }
    }

}
