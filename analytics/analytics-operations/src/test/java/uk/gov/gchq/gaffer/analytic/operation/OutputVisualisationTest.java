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

import org.junit.Test;

import uk.gov.gchq.gaffer.analytic.function.ToMap;
import uk.gov.gchq.koryphe.impl.function.Identity;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class OutputVisualisationTest {

    @Test
    public void shouldGetAndSetOutputAdapter() {
        // Given
        OutputVisualisation outputVisualisation = new OutputVisualisation();

        // When
        Map<String, Function> keyFunctions = new HashMap<>();
        keyFunctions.put("blah", new Identity());
        outputVisualisation.setOutputAdapter(new ToMap(keyFunctions));

        // Then
        assertEquals(ToMap.class, outputVisualisation.getOutputAdapter().getClass());
        assertEquals(keyFunctions, ((ToMap) outputVisualisation.getOutputAdapter()).getKeyFunctions());
    }

    @Test
    public void shouldThrowExceptionIfOutputAdapterIsNotJsonSerialisable() {
        // Given
        OutputVisualisation outputVisualisation = new OutputVisualisation();

        // When
        outputVisualisation.setOutputAdapter(new Function() {
            @Override
            public Object apply(final Object o) {
                return null;
            }
        });

        // Then
        try {
            Function fn = outputVisualisation.getOutputAdapter();
            fail("Exception expected");
        } catch (final RuntimeException e) {
            assertEquals("Failed to deserialise output adapter", e.getMessage());
        }
    }
}
