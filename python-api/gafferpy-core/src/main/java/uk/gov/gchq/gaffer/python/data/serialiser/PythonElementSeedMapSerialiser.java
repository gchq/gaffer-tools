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

import uk.gov.gchq.gaffer.operation.data.EdgeSeed;
import uk.gov.gchq.gaffer.operation.data.ElementSeed;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.python.data.serialiser.config.PythonSerialiserConfig;
import uk.gov.gchq.gaffer.python.util.Constants;

import java.util.HashMap;
import java.util.Map;

public class PythonElementSeedMapSerialiser implements PythonSerialiser<ElementSeed, Map<String, Object>> {

    Map<String, Object> map;
    PythonSerialiserConfig serialiserConfig;

    @Override
    public Map<String, Object> serialise(ElementSeed input) {

        map = new HashMap<>();

        if(input instanceof EntitySeed){
            map.put(Constants.TYPE, Constants.ENTITY_SEED);
            EntitySeed seed = (EntitySeed) input;
            elementMapSerialisedInsert(Constants.VERTEX, seed.getVertex());
        }else if(input instanceof EdgeSeed){
            map.put(Constants.TYPE, Constants.EDGE_SEED);
            EdgeSeed seed = (EdgeSeed) input;
            elementMapSerialisedInsert(Constants.SOURCE, seed.getSource());
            elementMapSerialisedInsert(Constants.DESTINATION,seed.getDestination());
            elementMapSerialisedInsert(Constants.DIRECTED, seed.getDirectedType());
            elementMapSerialisedInsert(Constants.MATCHED_VERTEX, seed.getMatchedVertex());
        }else{
            throw new IllegalArgumentException("not an EdgeSeed or EntitySeed, is a " + input.getClass().getCanonicalName());
        }

        return map;
    }

    @Override
    public boolean canHandle(Class clazz) {
        return ElementSeed.class.isAssignableFrom(clazz);
    }

    private void elementMapSerialisedInsert(String key, Object value){
        if(serialiserConfig == null){
            map.put(key, value);
        }
        else if(serialiserConfig.getSerialisers().containsKey(value.getClass())){
            PythonSerialiser serialiser = serialiserConfig.getSerialiser(value.getClass());
            Object result = serialiser.serialise(value);
            map.put(key, result);
        }else{
            map.put(key, value);
        }
    }

    public void setSerialiserConfig(){}//extend and add your own custom python serialisers here

}
