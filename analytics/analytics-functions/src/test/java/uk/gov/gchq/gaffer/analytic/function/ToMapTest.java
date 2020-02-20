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
package uk.gov.gchq.gaffer.analytic.function;

import com.google.common.collect.Lists;
import org.junit.Test;

import uk.gov.gchq.gaffer.commonutil.JsonAssert;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.IdentifierType;
import uk.gov.gchq.gaffer.data.element.function.ExtractId;
import uk.gov.gchq.gaffer.data.element.function.ExtractProperty;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.types.TypeSubTypeValue;
import uk.gov.gchq.koryphe.function.FunctionComposite;
import uk.gov.gchq.koryphe.impl.function.CallMethod;
import uk.gov.gchq.koryphe.impl.function.ToString;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ToMapTest {

    @Test
    public void shouldConvertElementsToMaps() {
        // Given
        Entity entity = new Entity.Builder()
                .group("unused")
                .vertex(new TypeSubTypeValue("type", "subType", "the value"))
                .property("count", 2000000000000000L)
                .build();

        // When

        final HashMap<String, Function> keyFunctions = new HashMap<>();
        keyFunctions.put("vertex value", new FunctionComposite()
                .compose(new ExtractId(IdentifierType.VERTEX))
                .andThen(new CallMethod("getValue")));
        keyFunctions.put("count", new FunctionComposite().compose(new ExtractProperty("count")
                .andThen(new ToString())));

        final ToMap toMap = new ToMap(keyFunctions);

        // Then

        final HashMap<String, Object> expected = new HashMap<>();
        expected.put("vertex value", "the value");
        expected.put("count", "2000000000000000");

        assertEquals(expected, toMap.apply(entity));
    }

    @Test
    public void shouldJsonSerialiseAndDeserialise() throws SerialisationException {
        // Given
        final HashMap<String, Function> keyFunctions = new HashMap<>();
        keyFunctions.put("vertex value", new FunctionComposite(Lists.newArrayList(
                new ExtractId(IdentifierType.VERTEX),
                new CallMethod("getValue"))));
        keyFunctions.put("count", new FunctionComposite(Lists.newArrayList(new ExtractProperty("count"),
                new ToString())));

        final ToMap toMap = new ToMap(keyFunctions);

        // When

        String expected = "{" +
                "\"class\":\"uk.gov.gchq.gaffer.analytic.function.ToMap\"," +
                "\"keyFunctions\":{" +
                "\"vertex value\":{" +
                "\"class\":\"uk.gov.gchq.koryphe.function.FunctionComposite\"," +
                "\"functions\":[" +
                "{" +
                "\"class\":\"uk.gov.gchq.gaffer.data.element.function.ExtractId\"," +
                "\"id\":\"VERTEX\"" +
                "}," +
                "{" +
                "\"class\":\"uk.gov.gchq.koryphe.impl.function.CallMethod\"," +
                "\"method\":\"getValue\"" +
                "}" +
                "]" +
                "}," +
                "\"count\":{" +
                "\"class\":\"uk.gov.gchq.koryphe.function.FunctionComposite\"," +
                "\"functions\":[" +
                "{" +
                "\"class\":\"uk.gov.gchq.gaffer.data.element.function.ExtractProperty\"," +
                "\"name\":\"count\"" +
                "}," +
                "{" +
                "\"class\":\"uk.gov.gchq.koryphe.impl.function.ToString\"" +
                "}" +
                "]" +
                "}" +
                "}" +
                "}";
        // Then

        JsonAssert.assertEquals(expected, new String(JSONSerialiser.serialise(toMap)));

    }

    @Test
    public void shouldSetPropertyToNullIfResultOfKeyFunctionIsNull() {
        // Given
        Edge edge = new Edge.Builder()
                .source("src")
                .dest("dst")
                .property("prop1", "someProperty")
                .build();

        // When
        Map<String, Function> keyFunctions = new HashMap<>();
        keyFunctions.put("test", new ExtractId(IdentifierType.VERTEX)); // Will return null

        ToMap toMap = new ToMap(keyFunctions);

        // Then
        Map<String, String> expected = new HashMap<>();
        expected.put("test", null);

        assertEquals(expected, toMap.apply(edge));
    }

    @Test
    public void shouldReturnNullIfTheKeyFunctionsAreNotSet() {
        // Given
        ToMap toMap = new ToMap();

        // When
        Map result = toMap.apply(32);

        // Then
        assertNull(result);

    }
}
