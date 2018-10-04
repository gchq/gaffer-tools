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

package uk.gov.gchq.gaffer.python.data.serialiser.custom;

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import org.roaringbitmap.RoaringBitmap;

import uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.config.PythonSerialiserConfig;
import uk.gov.gchq.gaffer.python.data.serialiser.impl.HyperLogLogPlusPythonSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.impl.RBMBackedTimestampSetPythonSerialiser;
import uk.gov.gchq.gaffer.python.data.serialiser.impl.RoaringBitmapPythonSerialiser;

import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

public class CustomPythonElementMapSerialiser extends PythonElementMapSerialiser {


    public CustomPythonElementMapSerialiser() {
        super();
    }

    @Override
    public void setSerialiserConfig() {
        this.serialiserConfig = new PythonSerialiserConfig();
        this.serialiserConfig.addSerialiser(RBMBackedTimestampSet.class, RBMBackedTimestampSetPythonSerialiser.class);
        this.serialiserConfig.addSerialiser(HyperLogLogPlus.class, HyperLogLogPlusPythonSerialiser.class);
        this.serialiserConfig.addSerialiser(RoaringBitmap.class, RoaringBitmapPythonSerialiser.class);
    }
}
