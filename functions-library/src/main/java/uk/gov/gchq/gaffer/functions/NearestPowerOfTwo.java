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

public class NearestPowerOfTwo extends KorypheFunction<Long, Long> {
    @Override
    public Long apply(final Long aLong) {
        long bits = aLong;
        long log = 0;
        if (bits == 9223372036854775807L) {
            bits >>>= 64;
            log = 64;
        }
        if (bits >= 4294967296L) {
            bits >>>= 32;
            log += 32;
        }
        if (bits >= 65536) {
            bits >>>= 16;
            log += 16;
        }
        if (bits >= 256) {
            bits >>>= 8;
            log += 8;
        }
        if (bits >= 16) {
            bits >>>= 4;
            log += 4;
        }
        if (bits >= 4) {
            bits >>>= 2;
            log += 2;
        }
        return log + (bits >>> 1);
    }
}
