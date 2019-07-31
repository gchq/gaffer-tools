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

package uk.gov.gchq.gaffer.functions;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class StringSplitterTests {

    @Test
    public void testCanSplitString() {

        String input = "a,b,c,def,g";
        StringSplitter splitter = new StringSplitter(",");
        List<String> test = new ArrayList<>(5);
        test.add("a");
        test.add("b");
        test.add("c");
        test.add("def");
        test.add("g");

        assertEquals(test, splitter.apply(input));

        String input2 = "a:::b:::c:::def:::g";
        StringSplitter splitter2 = new StringSplitter(":::");

        assertEquals(test, splitter2.apply(input2));
    }

}
