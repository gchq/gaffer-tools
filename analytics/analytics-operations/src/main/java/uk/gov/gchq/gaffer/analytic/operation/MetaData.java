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

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import java.io.Serializable;

/**
 * MetaData contains information relating to how the analytic is to be displayed
 * in the Analytic UI. It contains the icon, which should be in an SVG
 * string format, and the colour of the analytic card shown on the Analytic UI.
 * The default visualisation type is table and currently is the only one
 * supported by the Analytic UI.
 */

public class MetaData implements Serializable {

    private static final long serialVersionUID = -5681012439126964680L;
    private String icon;
    private String colour;

    public String getcolour() {
        return colour;
    }

    public void setcolour(final String colour) {
        this.colour = colour;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(final String icon) {
        this.icon = icon;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if (null == obj || getClass() != obj.getClass()) {
            return false;
        }

        final MetaData op = (MetaData) obj;

        return new EqualsBuilder().append(this.icon, op.icon)
                .append(this.colour, op.colour)
                .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(icon)
                .append(colour)
                .toHashCode();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append(icon)
                .append(colour)
                .toString();
    }
}
