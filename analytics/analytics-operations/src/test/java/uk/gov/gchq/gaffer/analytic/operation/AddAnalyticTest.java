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
import com.google.common.collect.Sets;

import uk.gov.gchq.gaffer.analytic.function.ToMap;
import uk.gov.gchq.gaffer.commonutil.JsonAssert;
import uk.gov.gchq.gaffer.data.element.function.ExtractProperty;
import uk.gov.gchq.gaffer.operation.OperationTest;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;


public class AddAnalyticTest extends OperationTest<AddAnalytic> {
        public static final String USER = "User";

        @Override
        public void shouldJsonSerialiseAndDeserialise() {
                Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
                uiMapping.put("result-limit", new UIMappingDetail.Builder().label("param1").userInputType("textbox")
                                .parameterName("result-limit1").build());
                MetaData metaData = new MetaData();
                metaData.setIcon("icon");
                Map<String, Function> keyFunctions = new HashMap<>();
                keyFunctions.put("prop 1", new ExtractProperty("prop1"));

                AddAnalytic addAnalyticOperation = new AddAnalytic.Builder().analyticName("Test Analytic name")
                                .operationName("Test Operation name").description("Test description")
                                .readAccessRoles(USER).writeAccessRoles(USER).overwrite(false).uiMapping(uiMapping)
                                .metaData(metaData).outputVisualisation(new OutputVisualisation().outputAdapter(new ToMap(keyFunctions))).score(4).build();

                // When
                final byte[] json = toJson(addAnalyticOperation);
                final AddAnalytic deserialisedObj = fromJson(json);

                // Then
                JsonAssert.assertEquals(String.format("{\n"
                                + "  \"class\": \"uk.gov.gchq.gaffer.analytic.operation.AddAnalytic\",\n"
                                + "  \"analyticName\": \"Test Analytic name\",\n"
                                + "  \"operationName\": \"Test Operation name\",\n"
                                + "  \"description\": \"Test description\",\n" + "  \"score\": 4,\n"
                                + "  \"metaData\": {\n" + "    \"icon\": \"icon\"\n" + "   },\n"
                                + "  \"outputVisualisation\": {\n"
                                + "    \"visualisationType\": \"TABLE\",\n"
                                + "    \"outputAdapter\": {\n"
                                + "      \"class\": \"uk.gov.gchq.gaffer.analytic.function.ToMap\",\n"
                                + "      \"keyFunctions\": {\n"
                                + "        \"prop 1\": {\n"
                                + "          \"class\": \"uk.gov.gchq.gaffer.data.element.function.ExtractProperty\",\n"
                                + "          \"name\": \"prop1\"\n"
                                + "        }\n"
                                + "      }\n"
                                + "    }\n"
                                + "  },\n"
                                + "  \"overwriteFlag\": false,\n" + "   \"readAccessRoles\": [" + " \"User\"" + " ],\n"
                                + "  \"uiMapping\": {\n" + "    \"result-limit\": {\n"
                                + "      \"label\": \"param1\",\n" + "      \"userInputType\" : \"textbox\",\n"
                                + "      \"parameterName\" : \"result-limit1\"\n" + "      }\n" + "  },\n"
                                + "  \"writeAccessRoles\" : [" + " \"User\"" + " ]\n" + "}"), new String(json));
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
                MetaData metaData = new MetaData();
                metaData.setIcon("icon");
                Map<String, Function> keyFunctions = new HashMap<>();
                keyFunctions.put("prop 1", new ExtractProperty("prop1"));
                OutputVisualisation outputVisualisation = new OutputVisualisation().outputAdapter(new ToMap(keyFunctions));

                AddAnalytic addAnalyticOperation = new AddAnalytic.Builder().analyticName("Test Analytic name")
                                .operationName("Test Operation name").description("Test description")
                                .readAccessRoles(USER).writeAccessRoles(USER).overwrite(false).uiMapping(uiMapping)
                                .metaData(metaData).outputVisualisation(outputVisualisation).options(options).score(4).build();
                // When

                // Then
                assertEquals("Test Analytic name", addAnalyticOperation.getAnalyticName());
                assertEquals("Test Operation name", addAnalyticOperation.getOperationName());
                assertEquals("Test description", addAnalyticOperation.getDescription());
                assertEquals(Collections.singletonList(USER), addAnalyticOperation.getReadAccessRoles());
                assertEquals(Collections.singletonList(USER), addAnalyticOperation.getWriteAccessRoles());
                assertFalse(addAnalyticOperation.isOverwriteFlag());
                assertEquals(uiMapping, addAnalyticOperation.getUiMapping());
                assertEquals(metaData, addAnalyticOperation.getMetaData());
                assertEquals(outputVisualisation, addAnalyticOperation.getOutputVisualisation());
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
                MetaData metaData = new MetaData();
                metaData.setIcon("icon");
                Map<String, Function> keyFunctions = new HashMap<>();
                keyFunctions.put("prop 1", new ExtractProperty("prop1"));
                OutputVisualisation outputVisualisation = new OutputVisualisation().outputAdapter(new ToMap(keyFunctions));


            AddAnalytic addAnalyticOperation = new AddAnalytic.Builder().analyticName("Test Analytic name")
                                .operationName("Test Operation name").description("Test description")
                                .readAccessRoles(USER).writeAccessRoles(USER).overwrite(false).uiMapping(uiMapping)
                                .metaData(metaData).outputVisualisation(outputVisualisation).options(options).score(4).build();

                // When
                AddAnalytic clone = addAnalyticOperation.shallowClone();

                // Then
                assertNotSame(addAnalyticOperation, clone);
                assertEquals("Test Analytic name", clone.getAnalyticName());
                assertEquals("Test Operation name", clone.getOperationName());
                assertEquals("Test description", clone.getDescription());
                assertEquals(Collections.singletonList(USER), clone.getReadAccessRoles());
                assertEquals(Collections.singletonList(USER), clone.getWriteAccessRoles());
                assertFalse(clone.isOverwriteFlag());
                assertEquals(uiMapping, clone.getUiMapping());
                assertEquals(metaData, clone.getMetaData());
                assertEquals(outputVisualisation, clone.getOutputVisualisation());
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
