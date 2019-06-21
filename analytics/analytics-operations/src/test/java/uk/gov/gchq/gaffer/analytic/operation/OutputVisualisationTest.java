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

import org.junit.Test;

import uk.gov.gchq.gaffer.analytic.function.ToMap;
import uk.gov.gchq.koryphe.impl.function.Identity;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;

public class OutputVisualisationTest {

    @Test
    public void shouldGetAndSetOutputAdapter() {

        OutputVisualisation outputVisualisation = new OutputVisualisation();

        Map<String, Function> keyFunctions = new HashMap<>();
        keyFunctions.put("blah", new Identity());
        outputVisualisation.setOutputAdapter(new ToMap(keyFunctions));

        assertEquals(ToMap.class, outputVisualisation.getOutputAdapter().getClass());
        assertEquals(keyFunctions, ((ToMap) outputVisualisation.getOutputAdapter()).getKeyFunctions());
    }
}
