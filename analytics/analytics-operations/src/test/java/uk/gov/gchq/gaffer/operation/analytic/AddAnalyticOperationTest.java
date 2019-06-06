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

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import uk.gov.gchq.gaffer.commonutil.JsonAssert;
import uk.gov.gchq.gaffer.operation.OperationTest;
import uk.gov.gchq.gaffer.operation.analytic.AddAnalyticOperation.Builder;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;

public class AddAnalyticOperationTest extends OperationTest<AddAnalyticOperation> {
    public static final String USER = "User";

    @Override
    public void shouldJsonSerialiseAndDeserialise() {
        Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
        uiMapping.put("result-limit", new UIMappingDetail.Builder()
                .label("param1")
                .userInputType("textbox")
                .parameterName("result-limit1")
                .build());
        Map<String, String> metaData = new HashMap<>();
        metaData.put("iconURL", "icon");
        Map<String, String> outputType = new HashMap<>();
        outputType.put("output", "table");

        AddAnalyticOperation AddAnalyticOperation = new AddAnalyticOperation.Builder()
                .analyticName("Test Analytic name")
                .operationName("Test Operation name")
                .description("Test description")
                .readAccessRoles(USER)
                .writeAccessRoles(USER)
                .overwrite(false)
                .uiMapping(uiMapping)
                .metaData(metaData)
                .outputType(outputType)
                .score(4)
                .build();

        // When
        final byte[] json = toJson(AddAnalyticOperation);
        final AddAnalyticOperation deserialisedObj = fromJson(json);

        // Then
        JsonAssert.assertEquals(String.format("{\n" +
                "   \"class\": \"uk.gov.gchq.gaffer.operation.analytic.AddAnalyticOperation\",\n" +
                "   \"analyticName\": \"Test Analytic name\",\n" +
                "   \"operationName\": \"Test Operation name\",\n" +
                "   \"description\": \"Test description\",\n" +
                "   \"uiMapping\": {\n" +
                "      \"result-limit\": {\n" +
                "         \"label\": \"param1\",\n" +
                "         \"userInputType\": \"textbox\",\n" +
                "         \"parameterName\": \"result-limit1\"\n" +
                "      }\n" +
                "   },\n" +
                "   \"score\": 4,\n" +
                "   \"metaData\": {\n" +
                "      \"iconURL\": \"icon\"\n" +
                "   },\n" +
                "   \"outputType\": {\n" +
                "      \"output\": \"table\"\n" +
                "   },\n" +
                "   \"overwriteFlag\": false,\n" +
                "   \"readAccessRoles\": [\n" +
                "      \"User\"\n" +
                "   ],\n" +
                "   \"writeAccessRoles\": [\n" +
                "      \"User\"\n" +
                "   ]\n" +
                "}"), new String(json));
        assertNotNull(deserialisedObj);
    }

    @Override
    public void builderShouldCreatePopulatedOperation() {
        // Given
        Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
        uiMapping.put("uiMappingConstructorTest", new UIMappingDetail("Maximum Results", "String", "finalMaxResultLimit"));
        Map<String, String> options = new HashMap<>();
        options.put("option1", "example Option");
        Map<String, String> metaData = new HashMap<>();
        metaData.put("iconURL", "icon");
        Map<String, String> outputType = new HashMap<>();
        outputType.put("output", "table");

        AddAnalyticOperation AddAnalyticOperation = new Builder()
                .analyticName("Test Analytic name")
                .operationName("Test Operation name")
                .description("Test description")
                .readAccessRoles(USER)
                .writeAccessRoles(USER)
                .overwrite(false)
                .uiMapping(uiMapping)
                .metaData(metaData)
                .outputType(outputType)
                .options(options)
                .score(4)
                .build();
        // When

        // Then
        assertEquals("Test Analytic name", AddAnalyticOperation.getAnalyticName());
        assertEquals("Test Operation name", AddAnalyticOperation.getOperationName());
        assertEquals("Test description", AddAnalyticOperation.getDescription());
        assertEquals(Collections.singletonList(USER), AddAnalyticOperation.getReadAccessRoles());
        assertEquals(Collections.singletonList(USER), AddAnalyticOperation.getWriteAccessRoles());
        assertFalse(AddAnalyticOperation.isOverwriteFlag());
        assertEquals(uiMapping, AddAnalyticOperation.getUiMapping());
        assertEquals(metaData, AddAnalyticOperation.getMetaData());
        assertEquals(outputType, AddAnalyticOperation.getOutputType());
        assertEquals(options, AddAnalyticOperation.getOptions());
        assertEquals(4, (int) AddAnalyticOperation.getScore());
    }

    @Override
    public void shouldShallowCloneOperation() {
        // Given
        Map<String, UIMappingDetail> uiMapping = Maps.newHashMap();
        uiMapping.put("uiMappingBuilderTest", new UIMappingDetail.Builder()
                .label("Maximum Results")
                .userInputType("String")
                .parameterName("finalMaxResultLimit")
                .build());
        uiMapping.put("uiMappingConstructorTest", new UIMappingDetail("Maximum Results", "String", "finalMaxResultLimit"));
        Map<String, String> options = new HashMap<>();
        options.put("option1", "example Option");
        Map<String, String> metaData = new HashMap<>();
        metaData.put("iconURL", "icon");
        Map<String, String> outputType = new HashMap<>();
        outputType.put("output", "table");

        AddAnalyticOperation AddAnalyticOperation = new AddAnalyticOperation.Builder()
                .analyticName("Test Analytic name")
                .operationName("Test Operation name")
                .description("Test description")
                .readAccessRoles(USER)
                .writeAccessRoles(USER)
                .overwrite(false)
                .uiMapping(uiMapping)
                .metaData(metaData)
                .outputType(outputType)
                .options(options)
                .score(4)
                .build();

        // When
        AddAnalyticOperation clone = AddAnalyticOperation.shallowClone();

        // Then
        assertNotSame(AddAnalyticOperation, clone);
        assertEquals("Test Analytic name", clone.getAnalyticName());
        assertEquals("Test Operation name", clone.getOperationName());
        assertEquals("Test description", clone.getDescription());
        assertEquals(Collections.singletonList(USER), clone.getReadAccessRoles());
        assertEquals(Collections.singletonList(USER), clone.getWriteAccessRoles());
        assertFalse(clone.isOverwriteFlag());
        assertEquals(uiMapping, clone.getUiMapping());
        assertEquals(metaData, clone.getMetaData());
        assertEquals(outputType, clone.getOutputType());
        assertEquals(options, clone.getOptions());
        assertEquals(4, (int) clone.getScore());
    }


    @Override
    protected AddAnalyticOperation getTestObject() {
        return new AddAnalyticOperation();
    }

    protected Set<String> getRequiredFields() {
        return Sets.newHashSet("analyticName");
    }
}
