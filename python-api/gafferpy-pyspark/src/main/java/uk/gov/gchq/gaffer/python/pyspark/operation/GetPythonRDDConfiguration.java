/*
 * Copyright 2016-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.python.pyspark.operation;

import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.hadoop.conf.Configuration;
import uk.gov.gchq.gaffer.data.element.id.DirectedType;
import uk.gov.gchq.gaffer.data.elementdefinition.view.View;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.operation.graph.GraphFilters;
import uk.gov.gchq.gaffer.operation.io.Output;
import uk.gov.gchq.gaffer.python.pyspark.util.TypeReferencePySparkImpl;


import java.util.Map;

/**
 * A Gaffer operation for generating a Hadoop conf that can be used to construct a spark RDD.
 */

public class GetPythonRDDConfiguration implements Output<Configuration>, GraphFilters {

    private Map<String, String> options;
    private View view;
    private DirectedType directedType;

    public GetPythonRDDConfiguration(){}

    @Override
    public Map<String, String> getOptions() {
        return options;
    }

    @Override
    public void setOptions(final Map<String, String> options) {
        this.options = options;
    }

    @Override
    public TypeReference<Configuration> getOutputTypeReference() {
        return new TypeReferencePySparkImpl.HadoopConfiguration();
    }

    @Override
    public View getView() {
        return view;
    }

    @Override
    public void setView(final View view) {
        this.view = view;
    }

    @Override
    public DirectedType getDirectedType() {
        return directedType;
    }

    @Override
    public void setDirectedType(final DirectedType directedType) {
        this.directedType = directedType;
    }

    @Override
    public GetPythonRDDConfiguration shallowClone() {
        return new Builder()
                .options(options)
                .view(view)
                .directedType(directedType)
                .build();
    }

    public static class Builder extends Operation.BaseBuilder<GetPythonRDDConfiguration, Builder>
            implements Output.Builder<GetPythonRDDConfiguration, Configuration, Builder>,
            GraphFilters.Builder<GetPythonRDDConfiguration, Builder>,
            Operation.Builder<GetPythonRDDConfiguration, Builder> {
        public Builder() {
            super(new GetPythonRDDConfiguration());
        }
    }




}
