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

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import uk.gov.gchq.gaffer.commonutil.ToStringBuilder;

import java.io.Serializable;

/**
 * Simple POJO providing parameter details for {@link AnalyticDetail}s.
 */
@JsonDeserialize(builder = UIMappingDetail.Builder.class)
public class UIMappingDetail implements Serializable {
    private static final long serialVersionUID = -8831132798507985469L;
    private String label;
    private String userInputType;
    private String parameterName;
    private Class inputClass;

    public UIMappingDetail(final String label, final String userInputType, final String parameterName) {
        this(label, userInputType, parameterName, null);
    }

    public UIMappingDetail(final String label, final String userInputType, final String parameterName, final Class inputClass) {
        if (null == label) {
            throw new IllegalArgumentException("label must not be empty");
        }
        if (null == userInputType) {
            throw new IllegalArgumentException("userInputType must not be empty");
        }
        if (null == parameterName) {
            throw new IllegalArgumentException("parameterName must not be empty");
        }

        this.label = label;
        this.userInputType = userInputType;
        this.parameterName = parameterName;
        this.inputClass = inputClass;
    }

    public String getLabel() {
        return label;
    }

    public String getUserInputType() {
        return userInputType;
    }

    public String getParameterName() {
        return parameterName;
    }

    public Class getInputClass() {
        return inputClass;
    }

    public void setInputClass(final Class inputClass) {
        this.inputClass = inputClass;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if (null == obj || getClass() != obj.getClass()) {
            return false;
        }

        final UIMappingDetail pd = (UIMappingDetail) obj;

        return new EqualsBuilder()
                .append(label, pd.label)
                .append(userInputType, pd.userInputType)
                .append(parameterName, pd.parameterName)
                .append(inputClass, pd.inputClass)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(71, 5)
                .append(label)
                .append(userInputType)
                .append(parameterName)
                .append(inputClass)
                .hashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .appendSuper(super.toString())
                .append("label", label)
                .append("userInputType", userInputType)
                .append("parameterName", parameterName)
                .append("inputClass", inputClass)
                .toString();
    }

    @JsonPOJOBuilder(withPrefix = "")
    public static final class Builder {
        private String label;
        private String userInputType;
        private String parameterName;
        private Class inputClass;

        public Builder label(final String label) {
            this.label = label;
            return this;
        }

        public Builder userInputType(final String userInputType) {
            this.userInputType = userInputType;
            return this;
        }

        public Builder parameterName(final String parameterName) {
            this.parameterName = parameterName;
            return this;
        }

        public Builder inputClass(final Class inputClass) {
            this.inputClass = inputClass;
            return this;
        }

        public UIMappingDetail build() {
            return new UIMappingDetail(label, userInputType, parameterName, inputClass);
        }
    }
}
