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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateToLong extends KorypheFunction<String, Long> {

    private String format;

    public DateToLong() {

    }

    public DateToLong(final String format) {
        setFormat(format);
    }

    @Override
    public Long apply(final String s) {
        Date date = null;
        try {
            date = new SimpleDateFormat(format).parse(s);
        } catch (final ParseException e) {
            e.printStackTrace();
        }
        return date.getTime();
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(final String format) {
        this.format = format;
    }

}
