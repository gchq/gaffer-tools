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

package uk.gov.gchq.gaffer.python.data.converter.pyspark;

import org.apache.spark.api.python.Converter;
import org.apache.spark.sql.Row;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.spark.operation.dataframe.ConvertElementToRow;

public class ElementToRowConverter implements Converter<Element, Row> {

    @Override
    public Row convert(final Element element) {
//        ConvertElementToRow convertElementToRow = new ConvertElementToRow();
//        Row result = convertElementToRow.apply(element);
        return null;
    }
}
