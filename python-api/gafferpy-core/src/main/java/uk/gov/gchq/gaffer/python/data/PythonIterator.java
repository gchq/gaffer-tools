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

package uk.gov.gchq.gaffer.python.data;

import uk.gov.gchq.gaffer.python.data.serialiser.PythonSerialiser;

import java.util.Iterator;

/**
 * A class for taking an Iterable of results from Gaffer and providing an iterator that returns
 * the results serialised so that the relevant python object can be constructed easily.
 */

public class PythonIterator implements Iterator {

    Iterator iterator;
    PythonSerialiser serialiser;

    public PythonIterator(Iterator iterator, PythonSerialiser serialiser){
        this.iterator = iterator;
        this.serialiser = serialiser;
    }

    @Override
    public boolean hasNext() {
        return iterator.hasNext();
    }

    @Override
    public Object next() {
        return serialiser.serialise(iterator.next());
    }

    public PythonSerialiser getSerialiser(){
        return this.serialiser;
    }
}
