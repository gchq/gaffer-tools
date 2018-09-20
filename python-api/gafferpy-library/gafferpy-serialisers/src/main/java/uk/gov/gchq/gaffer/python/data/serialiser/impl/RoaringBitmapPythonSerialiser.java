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

package uk.gov.gchq.gaffer.python.data.serialiser.impl;

import org.roaringbitmap.RoaringBitmap;
import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RoaringBitmapPythonSerialiser implements PythonSerialiser<RoaringBitmap, List<Integer>> {

    @Override
    public List<Integer> serialise(RoaringBitmap rbm) {
        List<Integer> result = new ArrayList<>(rbm.getCardinality());
        Iterator<Integer> iterator = rbm.iterator();
        while(iterator.hasNext()){
            result.add(iterator.next());
        }
        return result;
    }

    @Override
    public boolean canHandle(Class clazz) {
        return RoaringBitmap.class.equals(clazz) ;
    }
}
