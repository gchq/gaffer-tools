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

package uk.gov.gchq.gaffer.python.data.serialiser.config;

import org.junit.Test;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.operation.data.ElementSeed;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementSeedMapSerialiser;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import static org.junit.Assert.assertEquals;

public class PythonSerialiserConfigTest {

    @Test
    public void testDefaultSerialisersNotSet() {

        PythonSerialiserConfig config = new PythonSerialiserConfig();

        assert (config.getSerialisers().isEmpty());
    }

    @Test
    public void testCanSetSerialisersFromJsonFile() {

        PythonSerialiserConfig config = null;
        try {

            File file = new File(getClass().getClassLoader().getResource("pythonSerialisers.json").getPath());

            config = new PythonSerialiserConfig(new FileInputStream(file));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        assertEquals(PythonElementMapSerialiser.class, config.getSerialiser(Element.class).getClass());
        assertEquals(PythonElementSeedMapSerialiser.class, config.getSerialiser(ElementSeed.class).getClass());

    }

}
