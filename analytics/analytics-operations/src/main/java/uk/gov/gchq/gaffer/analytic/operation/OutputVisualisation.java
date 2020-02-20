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

import com.fasterxml.jackson.annotation.JsonGetter;
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
 * An OutputVisualisation contains information relating to how data is displayed
 * in the Analytic UI. It contains the method of visualisation and how to adapt
 * the results into something which complies with the UI's expected format.
 * The default visualisation type is table and currently is the only one
 * supported by the Analytic UI.
 *
 * The outputAdapter must be JSON serialisable.
 *
 * The table visualisation expects values in a key value format.
 */

public class OutputVisualisation implements Serializable {

    private static final long serialVersionUID = 471605385474366632L;
    private VisualisationType visualisationType = VisualisationType.TABLE;
    // Stored as string so it can be serialised.
    private String outputAdapter;
    private Class outputAdapterClass;

    @JsonGetter("outputAdapter")
    public Function getOutputAdapter() {
        if (outputAdapter == null) {
            return null;
        }
        try {
            return (Function) JSONSerialiser.deserialise(outputAdapter, outputAdapterClass);
        } catch (final SerialisationException e) {
            throw new RuntimeException("Failed to deserialise output adapter", e);
        }
    }

    @JsonSetter("outputAdapter")
    @JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "class")
    public void setOutputAdapter(final Function outputAdapter) {
        if (outputAdapter == null) {
            this.outputAdapter = null;
        } else {
            try {
                this.outputAdapterClass = outputAdapter.getClass();
                this.outputAdapter = new String(JSONSerialiser.serialise(outputAdapter));
            } catch (final SerialisationException e) {
                throw new RuntimeException("Failed to serialise output adapter", e);
            }
        }
    }

    public OutputVisualisation outputAdapter(final Function outputAdapter) {
        setOutputAdapter(outputAdapter);
        return this;
    }

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
