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

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;

import java.io.Serializable;
import java.util.function.Function;

/**
 * TODO meaningful comment
 */
public class OutputVisualisation implements Serializable {

    private static final long serialVersionUID = 471605385474366632L;
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private VisualisationType visualisationType = VisualisationType.TABLE;
    // Stored as string so it can be serialised.
    private String outputAdapter;

    @JsonGetter("outputAdapter")
    public Function getOutputAdapter() {
        if (outputAdapter == null) {
            return null;
        }
        try {
            return JSONSerialiser.deserialise(outputAdapter, Function.class);
        } catch (final SerialisationException e) {
            throw new RuntimeException("Failed to deserialise keyFunction", e);
        }
    }

    @JsonSetter("outputAdapter")
    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "class")
    public void setOutputAdapter(final Function outputAdapter) {
        if (outputAdapter == null) {
            this.outputAdapter = null;
        } else {
            try {
                this.outputAdapter = new String(JSONSerialiser.serialise(outputAdapter));
            } catch (final SerialisationException e) {
                throw new RuntimeException("Failed to serialise Function", e);
            }
        }
    }

    public OutputVisualisation outputAdapter(final Function outputAdapter) {
        setOutputAdapter(outputAdapter);
        return this;
    }

//  TODO see if it's possible to work without these methods. Don't want to expose the underlying storage mechanism if I can help it.

//    public String getOutputAdapter() {
//        return outputAdapter;
//    }
//
//    public void setOutputAdapter(final String outputAdapter) {
//        this.outputAdapter = outputAdapter;
//    }
//
//    public OutputVisualisation outputAdapter(final String outputAdapter) {
//        this.outputAdapter =
//    }

    public VisualisationType getVisualisationType() {
        return this.visualisationType;
    }

    public void setVisualisationType(final VisualisationType visualisationType) {
        this.visualisationType = visualisationType;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if (null == obj || getClass() != obj.getClass()) {
            return false;
        }

        final OutputVisualisation op = (OutputVisualisation) obj;

        return new EqualsBuilder().append(this.outputAdapter, op.outputAdapter)
                .append(this.visualisationType, op.visualisationType)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(outputAdapter)
                .append(visualisationType)
                .toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append(visualisationType)
                .append(outputAdapter)
                .toString();
    }
}
