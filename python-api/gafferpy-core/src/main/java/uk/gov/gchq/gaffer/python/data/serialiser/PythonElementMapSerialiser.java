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

package uk.gov.gchq.gaffer.python.data.serialiser;

import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.python.data.serialiser.config.PythonSerialiserConfig;
import uk.gov.gchq.gaffer.python.util.Constants;

import java.util.HashMap;
import java.util.Map;


/**
 * Takes Gaffer element and converts it to a map of string to object so that python element objects can be
 * constructed easily
 */

public class PythonElementMapSerialiser extends PythonElementSerialiser<Element, Map<String, Object>> {

    private Map<String, Object> elementMap;
    private Map<String, Object> propertiesMap;

    protected PythonSerialiserConfig serialiserConfig;

    public PythonElementMapSerialiser() {
        super();
    }

    @Override
    public Map<String, Object> serialise(final Element element) {

        elementMap = new HashMap<>();
        propertiesMap = new HashMap<>();

        if (element instanceof Entity) {
            elementMap.put(Constants.TYPE, Constants.ENTITY);
            Object vertex = ((Entity) element).getVertex();
            mapSerialisedInsert(elementMap, Constants.VERTEX, vertex);
        } else if (element instanceof Edge) {
            if (((Edge) element).getMatchedVertex() != null) {
                elementMap.put(Constants.MATCHED_VERTEX, ((Edge) element).getMatchedVertex().name());
            }
            elementMap.put(Constants.TYPE, Constants.EDGE);
            mapSerialisedInsert(elementMap, Constants.SOURCE, ((Edge) element).getSource());
            mapSerialisedInsert(elementMap, Constants.DESTINATION, ((Edge) element).getDestination());
            mapSerialisedInsert(elementMap, Constants.DIRECTED, ((Edge) element).getDirectedType());
        }
        elementMap.put(Constants.GROUP, element.getGroup());

        Properties properties = element.getProperties();

        for (final String propertyName : properties.keySet()) {
            Object propertyValue = properties.get(propertyName);
            mapSerialisedInsert(propertiesMap, propertyName, propertyValue);
        }
        elementMap.put(Constants.PROPERTIES, propertiesMap);

        return elementMap;
    }

    private void mapSerialisedInsert(final Map map, final String key, final Object value) {

        if (serialiserConfig == null) {
            map.put(key, value);
        } else if (serialiserConfig.getSerialisers().containsKey(value.getClass())) {
            PythonSerialiser serialiser = serialiserConfig.getSerialiser(value.getClass());
            Object result = serialiser.serialise(value);
            map.put(key, result);
        } else {
            map.put(key, value);
        }
    }

    @Override
    public boolean canHandle(final Class clazz) {
        return Element.class.equals(clazz);
    }


}
