/*
 * Copyright 2016-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.python;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.SecureSessionAuth;
import uk.gov.gchq.gaffer.python.controllers.SessionManager;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.util.exceptions.PortInUseException;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;

public final class Application {

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);

    private static final PropertiesService SERVICE = new PropertiesService();

    private Application() {
        // Private Constructor
    }

    public static void main(final String[] args) throws PortInUseException, UnknownHostException {

        LOGGER.info("Starting up on {} at {}", InetAddress.getLocalHost().getHostAddress(), new Date());

        SecureSessionAuth.getInstance().setPropertiesService(SERVICE);

        if (SERVICE.getSingleService().equalsIgnoreCase("true")) {
            SessionManager.getInstance().sessionFactory().run(); // Runs the default gaffer session - this is unsecured
        }

        if (SERVICE.isSsl().equalsIgnoreCase("true")) {
            SecureSessionAuth.getInstance().run(); // Starts up the HTTPS Server
        }

        if (SERVICE.getInsecure().equalsIgnoreCase("true")) {
            SecureSessionAuth.getInstance().run(); // Starts up the HTTP Server
        }
    }
}
