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

package uk.gov.gchq.gaffer.python.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.session.GafferSession;
import uk.gov.gchq.gaffer.python.util.exceptions.NoPortsAvailableException;
import uk.gov.gchq.gaffer.python.util.exceptions.PortInUseException;
import uk.gov.gchq.gaffer.python.util.exceptions.PortNotInRangeException;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;
import uk.gov.gchq.gaffer.user.User;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public final class SessionManager {

    private static final int DEFAULT_PORT = 25333;

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    private static InetAddress defaultAddress;

    static {
        try {
            defaultAddress = InetAddress.getByName(InetAddress.getLocalHost().getHostAddress());
        } catch (final UnknownHostException e) {
            LOGGER.error(e.getLocalizedMessage());
        }
    }

    private static SessionManager session = null;

    private List<GafferSession> sessionArrayList = new ArrayList<>();

    private SessionManager() {
        // Singleton
    }

    public static SessionManager getInstance() {
        if (session == null) {
            session = new SessionManager();
        }

        return session;
    }

    public GafferSession sessionFactory() throws PortInUseException {

        if (isPortNumberInUse(DEFAULT_PORT)) {
            throw new PortInUseException("Cannot use this port as it currently being used by another session");
        }

        GafferSession built = new GafferSession.Builder()
                .address(defaultAddress)
                .portNumber(DEFAULT_PORT)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final User user) throws PortInUseException {

        if (isPortNumberInUse(DEFAULT_PORT)) {
            throw new PortInUseException("Cannot use this port as it currently being used by another session");
        }

        GafferSession built = new GafferSession.Builder()
                .address(defaultAddress)
                .portNumber(DEFAULT_PORT)
                .user(user)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address) throws NoPortsAvailableException {

        GafferSession built = new GafferSession.Builder()
                .address(address)
                .portNumber(generatePortNumber())
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address, final int portNumber) throws PortInUseException, PortNotInRangeException  {

        if (isPortNumberInUse(portNumber)) {
            throw new PortInUseException("Cannot use this port as it currently being used by another session");
        }

        if (!isPortNumberInRange(portNumber)) {
            throw new PortNotInRangeException("Cannot use this port as it is out of range");
        }

        GafferSession built = new GafferSession.Builder()
                .address(address)
                .portNumber(portNumber)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address, final int portNumber, final String auth) throws PortInUseException, PortNotInRangeException  {

        if (isPortNumberInUse(portNumber)) {
            throw new PortInUseException("Cannot use this port as it currently being used by another session");
        }

        if (!isPortNumberInRange(portNumber)) {
            throw new PortNotInRangeException("Cannot use this port as it is out of range");
        }

        GafferSession built = new GafferSession.Builder()
                .address(address)
                .portNumber(portNumber)
                .authToken(auth)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address, final String auth) throws NoPortsAvailableException {
        GafferSession built = new GafferSession.Builder()
                .authToken(auth)
                .address(address)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address, final User user) throws NoPortsAvailableException {
        GafferSession built = new GafferSession.Builder()
                .address(address)
                .portNumber(generatePortNumber())
                .user(user)
                .build();

        this.addSession(built);
        return built;
    }

    public GafferSession sessionFactory(final InetAddress address, final String auth, final User user) throws NoPortsAvailableException {
        GafferSession built = new GafferSession.Builder()
                .authToken(auth)
                .address(address)
                .portNumber(generatePortNumber())
                .user(user)
                .build();

        this.addSession(built);
        return built;
    }

    public boolean removeSession(final GafferSession session) {
        List<GafferSession> allSessions = getAllSessions();

        for (int i = 0; i < allSessions.size(); i++) {
            if (allSessions.get(i).getPortNumber() == session.getPortNumber()) {
                getAllSessions().remove(i);
                try {
                    session.stop();
                } catch (final ServerNullException e) {
                    LOGGER.error(e.getMessage());
                }
                return true;
            }
        }
        return false;
    }

    public void removeAllSessions() throws ServerNullException {
        for (Iterator<GafferSession> iterator = this.sessionArrayList.iterator(); iterator.hasNext();) {
            GafferSession gafferSession = iterator.next();
            gafferSession.stop();
            iterator.remove();
        }
    }

    public List<GafferSession> getAllSessions() {
        return sessionArrayList;
    }

    private void addSession(final GafferSession session) {
        this.sessionArrayList.add(session);
    }

    private int generatePortNumber() throws NoPortsAvailableException {
        int generatedNumber = DEFAULT_PORT;

        for (final GafferSession gafferSession : getAllSessions()) {
            if (gafferSession.getPortNumber() == generatedNumber) {
                generatedNumber += 2;
            } else {
                if (isPortNumberInRange(generatedNumber) && isPortNumberInRange(generatedNumber + 1)) {
                    break;
                }
                throw new NoPortsAvailableException("Not ports available too create session");
            }
        }
        return generatedNumber;
    }

    private boolean isPortNumberInUse(final int portNumber) {
        for (final GafferSession gafferSession : getAllSessions()) {
            if (gafferSession.getPortNumber() == portNumber || gafferSession.getPortNumber() + 1 == portNumber) {
                return true;
            }
        }
        return false;
    }

    private boolean isPortNumberInRange(final int portNumber) {
        return portNumber >= DEFAULT_PORT && portNumber <= 65535;
    }

}
