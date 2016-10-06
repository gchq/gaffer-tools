/*
 * Copyright 2016 Crown Copyright
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

package gaffer.miniaccumulocluster;

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

import org.apache.accumulo.minicluster.MiniAccumuloCluster;
import org.apache.accumulo.minicluster.MiniAccumuloConfig;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

/**
 * Starts a mini accumulo cluster. Can be run directly from an IDE or compiled and
 * the main method invoked from the command line using:
 * java -jar target/mini-accumulo-cluster-jar-with-dependencies.jar
 *
 * @see gaffer.miniaccumulocluster.MiniAccumuloClusterController.Builder
 */
public final class MiniAccumuloClusterController {
    private static final Logger LOGGER = Logger.getLogger(MiniAccumuloClusterController.class);

    public static final String DEFAULT_DIR_NAME = "miniAccumuloCluster";
    public static final String DEFAULT_PASSWORD = "password";
    public static final String DEFAULT_INSTANCE_NAME = "instance";

    private static boolean shutdownHookAdded = false;

    private final String dirName;
    private final boolean isTempDir;
    private final String password;
    private final String instanceName;
    private final boolean shutdownHook;

    private Path clusterPath;
    private MiniAccumuloCluster cluster;

    private static final String SHUTDOWN_FILENAME = "shutdown";

    protected MiniAccumuloClusterController(final String dirName,
                                            final boolean isTempDir,
                                            final String password,
                                            final String instanceName,
                                            final boolean shutdownHook) {
        this.dirName = dirName;
        this.isTempDir = isTempDir;
        this.password = password;
        this.instanceName = instanceName;
        this.shutdownHook = shutdownHook;
    }

    public static void main(final String[] args) {
        if (null != args && args.length > 6) {
            LOGGER.error("Usage: [directory_name] [is_temp_directory] [root_password] [instance_name] [exec_script] [no_shell]");
            throw new IllegalArgumentException("Wrong number of args");
        }

        final MiniAccumuloClusterController runner = new Builder()
                .dirName(getDirName(args))
                .tempDir(isTempDir(args))
                .password(getPassword(args))
                .instanceName(getInstanceName(args))
                .shutdownHook(true)
                .build();

        runner.start();
    }

    public void start() {
        if (shutdownHook) {
            createShutdownHook();
        }

        // If it has already been started then do nothing
        if (null == cluster) {
            createDirectory();
            createMiniCluster();
        }
    }

    public void stop() {
        LOGGER.info("Attempting Shutdown");

        if (null != cluster) {
            try {
                cluster.stop();
                cluster = null;
                LOGGER.info("Cluster stopped");
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }

        if (null != clusterPath) {
            try {
                FileUtils.deleteDirectory(clusterPath.toFile());
                clusterPath = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public String getClusterZooKeepers() {
        return null != cluster ? cluster.getZooKeepers() : null;
    }

    private void createShutdownHook() {
        if (!shutdownHookAdded) {
            shutdownHookAdded = true;
            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    MiniAccumuloClusterController.this.stop();
                }
            });
        }
    }

    protected void createMiniCluster() {
        try {
            final MiniAccumuloConfig config = new MiniAccumuloConfig(clusterPath.toFile(), password);
            config.setInstanceName(instanceName);
            cluster = new MiniAccumuloCluster(config);
            cluster.start();
        } catch (InterruptedException | IOException e) {
            LOGGER.error("Failed to configure cluster", e);
            throw new RuntimeException("Failed to start cluster", e);
        }

        LOGGER.info("Cluster started:");
        LOGGER.info("\tLocation - " + cluster.getConfig().getDir().getAbsolutePath());
        LOGGER.info("\tZookeepers - " + cluster.getZooKeepers());
        LOGGER.info("\tInstance name - " + cluster.getInstanceName());

        try {
            final File propsFile = new File(clusterPath + "/store.properties");
            FileUtils.copyInputStreamToFile(getClass().getResourceAsStream("/store.properties.template"), propsFile);
            FileUtils.write(propsFile, "accumulo.zookeepers=" + cluster.getZooKeepers(), true);
        } catch (IOException e) {
            LOGGER.error("Failed to write properties file", e);
        }

        watchShutdown();
    }

    private void watchShutdown() {
        LOGGER.info("Watching Shutdown File " + clusterPath + "/" + SHUTDOWN_FILENAME);

        try {
            WatchService watcher = FileSystems.getDefault().newWatchService();
            clusterPath.register(watcher, ENTRY_CREATE);

            OUTER:
            while (true) {
                WatchKey key;
                try {
                    key = watcher.take();
                } catch (InterruptedException e) {
                    return;
                }

                for (final WatchEvent<?> event : key.pollEvents()) {
                    final WatchEvent.Kind<?> kind = event.kind();

                    if (kind == OVERFLOW) {
                        continue;
                    }

                    final WatchEvent<Path> ev = (WatchEvent<Path>) event;
                    final Path filename = ev.context();

                    LOGGER.debug("Filename changed " + filename);

                    if (filename.toString().equals(SHUTDOWN_FILENAME)) {
                        MiniAccumuloClusterController.this.stop();
                        break OUTER;
                    }
                }

                boolean valid = key.reset();
                if (!valid) {
                    break;
                }
            }

            LOGGER.info("Finished Watching Shutdown");
        } catch (IOException e) {
            LOGGER.error("Failed to watch shutdown", e);
        }
    }


    private void createDirectory() {
        clusterPath = Paths.get(dirName);
        if (Files.exists(clusterPath)) {
            try {
                FileUtils.deleteDirectory(clusterPath.toFile());
            } catch (IOException e1) {
                LOGGER.error("Failed to delete old directory", e1);
            }
        }

        try {
            if (isTempDir) {
                clusterPath = Files.createTempDirectory(dirName);
            } else {
                clusterPath = Files.createDirectory(clusterPath);
            }
        } catch (IOException e) {
            LOGGER.error("Failed to create temp dir", e);
            throw new RuntimeException("Unable to create directory", e);
        }
    }

    private static String getDirName(final String[] args) {
        return getArgOrDefault(0, DEFAULT_DIR_NAME, args);
    }

    private static boolean isTempDir(final String[] args) {
        return Boolean.parseBoolean(getArgOrDefault(1, "false", args));
    }

    private static String getPassword(final String[] args) {
        return getArgOrDefault(2, DEFAULT_PASSWORD, args);
    }

    private static String getInstanceName(final String[] args) {
        return getArgOrDefault(3, DEFAULT_INSTANCE_NAME, args);
    }

    private static String getArgOrDefault(final int index, final String defaultValue, final String[] args) {
        return hasArg(index, args) ? args[index] : defaultValue;
    }

    private static boolean hasArg(final int index, final String[] args) {
        return null != args && args.length > index && null != args[index];
    }

    public static class Builder {
        private String dirName;
        private boolean isTempDir = false;
        private String password;
        private String instanceName;
        private boolean shutdownHook = true;

        public Builder dirName(final String dirName) {
            this.dirName = dirName;
            return this;
        }

        public Builder tempDir(final boolean tempDir) {
            this.isTempDir = tempDir;
            return this;
        }

        public Builder tempDir() {
            return tempDir(true);
        }

        public Builder password(final String password) {
            this.password = password;
            return this;
        }

        public Builder instanceName(final String instanceName) {
            this.instanceName = instanceName;
            return this;
        }

        public Builder shutdownHook() {
            return shutdownHook(true);
        }

        public Builder shutdownHook(final boolean shutdownHook) {
            this.shutdownHook = shutdownHook;
            return this;
        }

        public MiniAccumuloClusterController build() {
            return new MiniAccumuloClusterController(dirName, isTempDir, password, instanceName, shutdownHook);
        }
    }
}
