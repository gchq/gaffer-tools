/*
 * Copyright 2017-2018 Crown Copyright
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

package uk.gov.gchq.gaffer.functions;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DateToLongTest {

    @Test
    public void testDateToLong() {

        String format = "yyyy-MM-dd HH:mm:ss.SSS";

        String test = "2009-04-27 18:32:26.382";

        Long answer = 1240853546382L;

        DateToLong dateToLong = new DateToLong();
        dateToLong.setFormat(format);

        assertEquals(answer, dateToLong.apply(test));

    }
}
