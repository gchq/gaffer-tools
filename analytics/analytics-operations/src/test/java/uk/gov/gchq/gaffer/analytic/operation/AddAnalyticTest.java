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
import com.google.common.collect.Sets;

import uk.gov.gchq.gaffer.analytic.operation.AddAnalytic.Builder;
import uk.gov.gchq.gaffer.commonutil.JsonAssert;
import uk.gov.gchq.gaffer.operation.OperationTest;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;

public class AddAnalyticTest extends OperationTest<AddAnalytic> {

        @Override
        public void shouldJsonSerialiseAndDeserialise() {
                Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
                uiMapping.put("result-limit", new UIMappingDetail.Builder().label("param1").userInputType("textbox")
                        .parameterName("result-limit1").build());
                Map<String, String> metaData = new HashMap<>();
                metaData.put("iconURL", "icon");
                Map<String, String> outputType = new HashMap<>();
                outputType.put("output", "table");

                AddAnalytic addAnalyticOperation = new AddAnalytic.Builder().analyticName("Test Analytic name")
                        .operationName("Test Operation name").description("Test description")
                        .overwrite(false).uiMapping(uiMapping)
                        .metaData(metaData).outputType(outputType).score(4).build();

                // When
                final byte[] json = toJson(addAnalyticOperation);
                final AddAnalytic deserialisedObj = fromJson(json);

                // Then
                JsonAssert.assertEquals(String.format("{\n" +
                        "  \"class\" : \"uk.gov.gchq.gaffer.analytic.operation.AddAnalytic\",\n" +
                        "  \"analyticName\" : \"Test Analytic name\",\n" +
                        "  \"operationName\" : \"Test Operation name\",\n" +
                        "  \"description\" : \"Test description\",\n" +
                        "  \"score\" : 4,\n" +
                        "  \"metaData\" : {\n" +
                        "    \"iconURL\" : \"icon\"\n" +
                        "  },\n" +
                        "  \"outputType\" : {\n" +
                        "    \"output\" : \"table\"\n" +
                        "  },\n" +
                        "  \"overwriteFlag\" : false,\n" +
                        "  \"uiMapping\" : {\n" +
                        "    \"result-limit\" : {\n" +
                        "      \"label\" : \"param1\",\n" +
                        "      \"userInputType\" : \"textbox\",\n" +
                        "      \"parameterName\" : \"result-limit1\"\n" +
                        "    }\n" +
                        "  }\n" +
                        "}"), new String(json));
                assertNotNull(deserialisedObj);
        }

        @Override
        public void builderShouldCreatePopulatedOperation() {
                // Given
                Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
                uiMapping.put("uiMappingConstructorTest",
                        new UIMappingDetail("Maximum Results", "String", "finalMaxResultLimit"));
                Map<String, String> options = new HashMap<>();
                options.put("option1", "example Option");
                Map<String, String> metaData = new HashMap<>();
                metaData.put("iconURL", "icon");
                Map<String, String> outputType = new HashMap<>();
                outputType.put("output", "table");

                AddAnalytic addAnalyticOperation = new Builder().analyticName("Test Analytic name")
                        .operationName("Test Operation name").description("Test description")
                        .overwrite(false).uiMapping(uiMapping)
                        .metaData(metaData).outputType(outputType).options(options).score(4).build();
                // When

                // Then
                assertEquals("Test Analytic name", addAnalyticOperation.getAnalyticName());
                assertEquals("Test Operation name", addAnalyticOperation.getOperationName());
                assertEquals("Test description", addAnalyticOperation.getDescription());
                assertFalse(addAnalyticOperation.isOverwriteFlag());
                assertEquals(uiMapping, addAnalyticOperation.getUiMapping());
                assertEquals(metaData, addAnalyticOperation.getMetaData());
                assertEquals(outputType, addAnalyticOperation.getOutputType());
                assertEquals(options, addAnalyticOperation.getOptions());
                assertEquals(4, (int) addAnalyticOperation.getScore());
        }

        @Override
        public void shouldShallowCloneOperation() {
                // Given
                Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
                uiMapping.put("uiMappingBuilderTest", new UIMappingDetail.Builder().label("Maximum Results")
                        .userInputType("String").parameterName("finalMaxResultLimit").build());
                uiMapping.put("uiMappingConstructorTest",
                        new UIMappingDetail("Maximum Results", "String", "finalMaxResultLimit"));
                Map<String, String> options = new HashMap<>();
                options.put("option1", "example Option");
                Map<String, String> metaData = new HashMap<>();
                metaData.put("iconURL", "icon");
                Map<String, String> outputType = new HashMap<>();
                outputType.put("output", "table");

                AddAnalytic addAnalyticOperation = new AddAnalytic.Builder().analyticName("Test Analytic name")
                        .operationName("Test Operation name").description("Test description")
                        .overwrite(false).uiMapping(uiMapping)
                        .metaData(metaData).outputType(outputType).options(options).score(4).build();

                // When
                AddAnalytic clone = addAnalyticOperation.shallowClone();

                // Then
                assertNotSame(addAnalyticOperation, clone);
                assertEquals("Test Analytic name", clone.getAnalyticName());
                assertEquals("Test Operation name", clone.getOperationName());
                assertEquals("Test description", clone.getDescription());
                assertFalse(clone.isOverwriteFlag());
                assertEquals(uiMapping, clone.getUiMapping());
                assertEquals(metaData, clone.getMetaData());
                assertEquals(outputType, clone.getOutputType());
                assertEquals(options, clone.getOptions());
                assertEquals(4, (int) clone.getScore());
        }

        @Override
        protected AddAnalytic getTestObject() {
                return new AddAnalytic();
        }

        protected Set<String> getRequiredFields() {
                return Sets.newHashSet("analyticName");
        }
}
