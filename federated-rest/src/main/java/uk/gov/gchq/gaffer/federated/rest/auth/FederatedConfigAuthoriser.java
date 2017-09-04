/*
 * Copyright 2017 Crown Copyright
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
package uk.gov.gchq.gaffer.federated.rest.auth;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import uk.gov.gchq.gaffer.federated.rest.SystemProperty;
import uk.gov.gchq.gaffer.user.User;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Collections;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

public class FederatedConfigAuthoriser {

    public static final String AUTH_SEPARATOR = ",";

    private final Set<String> confAuths = new HashSet<>();

    public FederatedConfigAuthoriser() {
    }

    public FederatedConfigAuthoriser(final Path propFileLocation) {
        this(readProperties(propFileLocation));
    }

    public FederatedConfigAuthoriser(final InputStream stream) {
        this(readProperties(stream));
    }

    public FederatedConfigAuthoriser(final Properties props) {
        loadOpAuthMap(props);
    }

    private static Properties readProperties(final Path propFileLocation) {
        Properties props;
        if (null != propFileLocation) {
            try {
                props = readProperties(Files.newInputStream(propFileLocation, StandardOpenOption.READ));
            } catch (final IOException e) {
                throw new IllegalArgumentException(e);
            }
        } else {
            props = new Properties();
        }

        return props;
    }

    private static Properties readProperties(final InputStream stream) {
        final Properties props = new Properties();
        if (null != stream) {
            try {
                props.load(stream);
            } catch (final IOException e) {
                throw new IllegalArgumentException("Failed to load store properties file : " + e
                        .getMessage(), e);
            } finally {
                IOUtils.closeQuietly(stream);
            }
        }

        return props;
    }

    public void setOpAuths(final Set<String> auths) {
        confAuths.addAll(auths);
    }

    public void addConfAuths(final String... auths) {
        Collections.addAll(confAuths, auths);
    }

    public Set<String> getConfAuths() {
        return Collections.unmodifiableSet(confAuths);
    }

    public boolean authorise(final User user) {
        final Set<String> userOpAuths = user.getOpAuths();
        boolean authorised = true;
        if (!userOpAuths.containsAll(confAuths)) {
            authorised = false;
        }

        return authorised;
    }

    private void loadOpAuthMap(final Properties props) {
        final Set<String> auths = new HashSet<>();
        for (final String auth : props.getProperty(SystemProperty.FEDERATED_ADMIN_AUTH)
                .split(AUTH_SEPARATOR)) {
            if (!StringUtils.isEmpty(auth)) {
                auths.add(auth);
            }
        }
        setOpAuths(auths);
    }
}
