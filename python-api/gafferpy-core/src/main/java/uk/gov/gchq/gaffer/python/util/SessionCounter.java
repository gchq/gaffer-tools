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

package uk.gov.gchq.gaffer.python.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class SessionCounter {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionCounter.class);

    private static SessionCounter session = null;

    private int counter = 0;

    private SessionCounter() {
        // Make it Singleton
    }

    public static SessionCounter getInstance() {
        if (session == null) {
            session = new SessionCounter();
        }
        return session;
    }

    public int getCounter() {
        return this.counter;
    }

    private void setCounter(final int counter) {
        this.counter = counter;
    }


    public void increment() {
        setCounter(getCounter() + 1);
        LOGGER.info("New session created, total number of active sessions: {}", getCounter());
    }

    public void decrement() {
        int currentCount = getCounter() - 1;

        if (currentCount <= 0) {
            setCounter(0);
        } else {
            setCounter(currentCount);
        }
        LOGGER.info("Session ended, total number of active sessions: {}", getCounter());
    }

}
