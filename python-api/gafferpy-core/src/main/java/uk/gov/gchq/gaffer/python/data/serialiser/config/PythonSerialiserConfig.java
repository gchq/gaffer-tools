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

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.data.ElementSeed;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementSeedMapSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class PythonSerialiserConfig implements Serializable{

//    private final Class defaultElementSerialiser = PythonElementMapSerialiser.class;
//    private final Class defaultElementSeedSerialiser = PythonElementSeedMapSerialiser.class;
    private Map<Class, Class> serialisers;

    public PythonSerialiserConfig() {
        this.serialisers = new HashMap<>();
//        this.addSerialiser(Element.class, this.defaultElementSerialiser);
//        this.addSerialiser(ElementSeed.class, this.defaultElementSeedSerialiser);
    }

    public PythonSerialiserConfig(FileInputStream fis){
        byte[] bytes = null;
        try {
            bytes = null != fis ? sun.misc.IOUtils.readFully(fis, fis.available(), true) : null;
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.serialisers = new PythonSerialiserConfig(bytes).getSerialisers();
    }

    public PythonSerialiserConfig(byte[] bytes){
            try {
                this.serialisers = JSONSerialiser.deserialise(bytes, PythonSerialiserConfig.class).getSerialisers();
            } catch (SerialisationException e) {
                e.printStackTrace();
            }
    }

    public void addSerialiser(Class clazz, Class<? extends PythonSerialiser> serialiserClass){
        serialisers.put(clazz, serialiserClass);
    }

    public PythonSerialiser getSerialiser(Class clazz){
        for(Class c : serialisers.keySet()){
            if(c.isAssignableFrom(clazz)){
                try {
                    return (PythonSerialiser) serialisers.get(c).newInstance();
                } catch (InstantiationException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public boolean hasSerialiser(Class clazz){
        return serialisers.containsKey(clazz.getCanonicalName());
    }

    @Override
    public String toString(){
        try {
            return new String(JSONSerialiser.serialise(this, true));
        } catch (SerialisationException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<Class, Class> getSerialisers() {
        return serialisers;
    }

    public void setSerialisers(Map<Class, Class> serialisers) {
//        for(Class c : serialisers.keySet()){
//            if(serialisers.get(c).equals(this.defaultElementSerialiser)){
//                this.serialisers.put(c, serialisers.get(c));
//                serialisers.remove(c);
//            }
//            if(serialisers.get(c).equals(this.defaultElementSeedSerialiser)){
//                this.serialisers.put(c, serialisers.get(c));
//                serialisers.remove(c);
//            }
//        }
        this.serialisers.putAll(serialisers);
    }
}
