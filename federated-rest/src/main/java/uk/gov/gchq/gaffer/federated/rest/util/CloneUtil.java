/*
 * Copyright 2016-2017 Crown Copyright
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

package uk.gov.gchq.gaffer.federated.rest.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public abstract class CloneUtil {
    private CloneUtil() {
    }

    public static <T> T clone(final T item) {
        final Object clone;
        if (null == item) {
            clone = null;
        } else if (item instanceof Map) {
            clone = cloneMap(((Map) item));
        } else if (item instanceof List) {
            clone = cloneList(((List) item));
        } else {
            clone = item;
        }

        return (T) clone;
    }

    private static Map cloneMap(final Map<Object, Object> map) {
        if (null == map) {
            return null;
        }

        final Map<Object, Object> clonedMap = new LinkedHashMap<>();
        for (final Map.Entry<Object, Object> entry : map.entrySet()) {
            clonedMap.put(entry.getKey(), clone(entry.getValue()));
        }

        return clonedMap;
    }

    private static List cloneList(final List list) {
        if (null == list) {
            return null;
        }

        final List clonedList = new ArrayList<>();

        for (final Object item : list) {
            clonedList.add(clone(item));
        }

        return clonedList;
    }


}

