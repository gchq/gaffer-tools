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

import uk.gov.gchq.koryphe.function.KorypheFunction;

import java.util.ArrayList;
import java.util.List;

public class StringSplitter extends KorypheFunction<String, List<String>> {

    private String delimiter;

    public StringSplitter() { }

    public StringSplitter(final String delimiter) {
        setDelimiter(delimiter);
    }

    @Override
    public List<String> apply(final String string) {
        String[] split = string.split(delimiter);
        List<String> result = new ArrayList<>(split.length);
        for (final String s : split) {
            result.add(s);
        }
        return result;
    }

    public String getDelimiter() {
        return delimiter;
    }

    public void setDelimiter(final String delimiter) {
        this.delimiter = delimiter;
    }
}
