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
package uk.gov.gchq.gaffer.miniaccumulocluster;

import org.apache.accumulo.shell.Shell;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;


public final class MiniAccumuloShellController {
    private static final Logger LOGGER = Logger.getLogger(MiniAccumuloShellController.class);

    private static final String ACCUMULO_INSTANCE = "accumulo.instance";
    private static final String ACCUMULO_USER = "accumulo.user";
    private static final String ACCUMULO_PASSWORD = "accumulo.password";
    private static final String ACCUMULO_ZK = "accumulo.zookeepers";

    public static void main(final String[] args) {
        final String propertiesFilename = args[0];
        String commandFilename = null;
        if (args.length > 1) {
            commandFilename = args[1];
        }

        new MiniAccumuloShellController(propertiesFilename).run(commandFilename);
    }

    private String instance;
    private String user;
    private String password;
    private String zookeepers;
    private Shell shell;

    private MiniAccumuloShellController(final String propertiesFilename) {
        if (null == propertiesFilename) {
            throw new IllegalArgumentException("Properties file null");
        }

        try (final InputStream is = new FileInputStream(new File(propertiesFilename))) {
            final Properties props = new Properties();
            props.load(is);

            instance = props.getProperty(ACCUMULO_INSTANCE);
            user = props.getProperty(ACCUMULO_USER);
            password = props.getProperty(ACCUMULO_PASSWORD);
            zookeepers = props.getProperty(ACCUMULO_ZK);

        } catch (final IOException e) {
            LOGGER.error("Failed to initialise MiniAccumuloShell", e);
            throw new IllegalArgumentException("Properties file failed to load", e);
        }
    }

    private void stop() {
        if (null != shell) {
            shell.shutdown();
        }
    }

    public void run(final String commandFilename) {
        final List<String> shellArgs = new ArrayList<>();
        shellArgs.add("-u");
        shellArgs.add(user);
        shellArgs.add("-p");
        shellArgs.add(password);
        shellArgs.add("-z");
        shellArgs.add(instance);
        shellArgs.add(zookeepers);

        try {
            shell = new Shell();
            if (!shell.config(shellArgs.toArray(new String[0]))) {
                throw new RuntimeException("Shell failed with code: " + shell.getExitCode());
            }

            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    MiniAccumuloShellController.this.stop();
                }
            });

            if (null != commandFilename) {
                final String cmd = IOUtils.toString(new FileInputStream(new File(commandFilename)));
                LOGGER.info("Executing Command " + cmd);
                shell.execCommand(cmd, false, true);
            } else {
                shell.start();
            }
        } catch (final IOException e) {
            LOGGER.error("Failed to run shell", e);
        } finally {
            if (null != shell) {
                shell.shutdown();
            }
        }
    }
}
