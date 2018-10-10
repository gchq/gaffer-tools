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

import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/*
A registry of PythonSerialisers that can be used on a Gaffer Session or Pyhton graph object.
Allows serialisers to be set for converting between Java and Python objects.
Has utility methods for setting serialisers from json files
 */

public class PythonSerialiserConfig implements Serializable {

    private Map<Class, Class> serialisers;

    public PythonSerialiserConfig() {
        this.serialisers = new HashMap<>();
    }

    public PythonSerialiserConfig(final FileInputStream fis) {
        byte[] bytes = null;
        try {
            bytes = null != fis ? sun.misc.IOUtils.readFully(fis, fis.available(), true) : null;
        } catch (final IOException e) {
            e.printStackTrace();
        }
        this.serialisers = new PythonSerialiserConfig(bytes).getSerialisers();
    }

    public PythonSerialiserConfig(final byte[] bytes) {
        Map<String, String> map = null;
        this.serialisers = new HashMap<>();
        try {
                map = JSONSerialiser.deserialise(bytes, Map.class);
            } catch (final SerialisationException e) {
                e.printStackTrace();
            }

        for (final String s : map.keySet()) {
            try {
                this.serialisers.put(Class.forName(s), Class.forName(map.get(s)));
            } catch (final ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

    public void addSerialiser(final Class clazz, final Class<? extends PythonSerialiser> serialiserClass) {
        serialisers.put(clazz, serialiserClass);
    }

    public PythonSerialiser getSerialiser(final Class clazz) {
        for (final Class c : serialisers.keySet()) {
            if (c.isAssignableFrom(clazz)) {
                try {
                    return (PythonSerialiser) serialisers.get(c).newInstance();
                } catch (final InstantiationException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public boolean hasSerialiser(final Class clazz) {
        return serialisers.containsKey(clazz.getCanonicalName());
    }

    @Override
    public String toString() {
        try {
            return new String(JSONSerialiser.serialise(this, true));
        } catch (final SerialisationException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<Class, Class> getSerialisers() {
        return serialisers;
    }

    public void setSerialisers(final Map<Class, Class> serialisers) {
        this.serialisers.putAll(serialisers);
    }
}
