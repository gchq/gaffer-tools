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
package uk.gov.gchq.gaffer.miniaccumulocluster;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Properties;

public final class MiniAccumuloClusterProps {

    private MiniAccumuloClusterProps() {
        // Deliberately private constructor in utility class
    }

    public static final String DEFAULT_DIR_NAME = "miniAccumuloCluster";
    public static final String DEFAULT_PASSWORD = "password";
    public static final String DEFAULT_INSTANCE_NAME = "instance";
    public static final String DIR_NAME_KEY = "dir.name";
    public static final String IS_TEMP_DIR_KEY = "dir.temp";
    public static final String PASSWORD_KEY = "instance.password";
    public static final String INSTANCE_NAME_KEY = "instance.name";
    public static final String SHUTDOWN_HOOK_KEY = "instance.shutdown.hook";
    public static final String HEAP_SIZE_KEY = "instance.heap.size";

    public static Properties loadProperties(final Path propFileLocation) {
        final Properties props = new Properties();
        if (null != propFileLocation) {
            try (final InputStream accIs = Files.newInputStream(propFileLocation, StandardOpenOption.READ)) {
                props.load(accIs);
            } catch (final IOException e) {
                throw new IllegalArgumentException("Unable to find configuration file at path: " + propFileLocation.toString());
            }
        }

        return props;
    }

}
