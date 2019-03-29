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

import org.apache.accumulo.minicluster.MemoryUnit;
import org.apache.accumulo.minicluster.MiniAccumuloCluster;
import org.apache.accumulo.minicluster.MiniAccumuloConfig;
import org.apache.commons.cli.BasicParser;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
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

import static java.nio.file.StandardWatchEventKinds.ENTRY_CREATE;
import static java.nio.file.StandardWatchEventKinds.OVERFLOW;

/**
 * Starts a mini accumulo cluster. Can be run directly from an IDE or compiled and
 * the main method invoked from the command line using:
 * java -jar target/mini-accumulo-cluster-jar-with-dependencies.jar
 *
 * @see uk.gov.gchq.gaffer.miniaccumulocluster.MiniAccumuloClusterController.Builder
 */
public class MiniAccumuloClusterController {
    public static final String DEFAULT_DIR_NAME = "miniAccumuloCluster";
    public static final String DEFAULT_PASSWORD = "password";
    public static final String DEFAULT_INSTANCE_NAME = "instance";
    public static final String SHUTDOWN_FILENAME = "shutdown";
    public static final boolean DEFAULT_IS_TEMP_DIR = false;

    private static final Logger LOGGER = Logger.getLogger(MiniAccumuloClusterController.class);
    protected static boolean shutdownHookAdded = false;

    protected String dirName;
    protected boolean isTempDir;
    protected String password;
    protected String instanceName;
    protected boolean shutdownHook;
    protected Integer heapSize;

    protected Path clusterPath;
    protected MiniAccumuloCluster cluster;

    protected MiniAccumuloClusterController() {
    }

    protected MiniAccumuloClusterController(final String[] args) {
        final Options options = new Options();
        options.addOption("h", "help", false, "help");
        options.addOption("d", "dirName", true, "directory name");
        options.addOption("p", "password", true, "root password");
        options.addOption("n", "instanceName", true, "instance name");
        options.addOption("t", "useTempDir", false, "use a temporary directory");
        options.addOption("s", "heapSize", true, "heap size");

        final CommandLineParser parser = new BasicParser();
        try {
            final CommandLine cmd = parser.parse(options, args);
            if (cmd.hasOption("h")) {
                printHelp(options);
                System.exit(0);
            }
            if (cmd.getOptions().length == 0 && args.length > 0) {
                parseArgsOldFormat(args, options);
            } else {
                dirName = cmd.getOptionValue("d", DEFAULT_DIR_NAME);
                isTempDir = cmd.hasOption("t") || DEFAULT_IS_TEMP_DIR;
                password = cmd.getOptionValue("p", DEFAULT_PASSWORD);
                instanceName = cmd.getOptionValue("i", DEFAULT_INSTANCE_NAME);
                final String heapSizeStr = cmd.getOptionValue("s");
                if (null != heapSizeStr) {
                    heapSize = Integer.parseInt(heapSizeStr);
                }
            }
        } catch (final ParseException e) {
            parseArgsOldFormat(args, options);
        }

        shutdownHook = true;
    }

    public static void main(final String[] args) throws ParseException {
        final MiniAccumuloClusterController instance = new MiniAccumuloClusterController(args);
        instance.start();
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
            } catch (final IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }

        if (null != clusterPath) {
            try {
                FileUtils.deleteDirectory(clusterPath.toFile());
                clusterPath = null;
            } catch (final IOException e) {
                e.printStackTrace();
            }
        }
    }

    public String getClusterZooKeepers() {
        return null != cluster ? cluster.getZooKeepers() : null;
    }

    protected void printHelp(final Options options) {
        final HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp(
                "java -cp mini-accumulo-cluster-*-jar-with-dependencies.jar "
                        + getClass().getName(),
                options);
    }

    protected void parseArgsOldFormat(final String[] args, final Options options) {
        // Try to parse the arguments using the old format.
        if (null != args && args.length > 4) {
            printHelp(options);
            System.exit(2);
        }

        System.err.println("Warning - please update your command line arguments.");
        printHelp(options);
        dirName = getDirName(args);
        isTempDir = isTempDir(args);
        password = getPassword(args);
        instanceName = getInstanceName(args);
    }

    protected void createShutdownHook() {
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
            if (heapSize != null) {
                config.setDefaultMemory(heapSize, MemoryUnit.MEGABYTE);
            }
            config.setInstanceName(instanceName);
            cluster = new MiniAccumuloCluster(config);
            cluster.start();
        } catch (final InterruptedException | IOException e) {
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
        } catch (final IOException e) {
            LOGGER.error("Failed to write properties file", e);
        }

        watchShutdown();
    }

    protected void watchShutdown() {
        LOGGER.info("Watching Shutdown File " + clusterPath + "/" + SHUTDOWN_FILENAME);

        try {
            WatchService watcher = FileSystems.getDefault().newWatchService();
            clusterPath.register(watcher, ENTRY_CREATE);

            OUTER:
            while (true) {
                WatchKey key;
                try {
                    key = watcher.take();
                } catch (final InterruptedException e) {
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
        } catch (final IOException e) {
            LOGGER.error("Failed to watch shutdown", e);
        }
    }


    private void createDirectory() {
        clusterPath = Paths.get(dirName);
        if (Files.exists(clusterPath)) {
            try {
                FileUtils.deleteDirectory(clusterPath.toFile());
            } catch (final IOException e1) {
                LOGGER.error("Failed to delete old directory", e1);
            }
        }

        try {
            if (isTempDir) {
                clusterPath = Files.createTempDirectory(dirName);
            } else {
                clusterPath = Files.createDirectory(clusterPath);
            }
        } catch (final IOException e) {
            LOGGER.error("Failed to create temp dir", e);
            throw new RuntimeException("Unable to create directory", e);
        }
    }

    int getHeapSize() {
        return heapSize;
    }

    private static String getDirName(final String[] args) {
        return getArgOrDefault(0, DEFAULT_DIR_NAME, args);
    }

    private static boolean isTempDir(final String[] args) {
        return Boolean.parseBoolean(getArgOrDefault(1, Boolean.toString(DEFAULT_IS_TEMP_DIR), args));
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
        final MiniAccumuloClusterController instance;

        public Builder() {
            this(new MiniAccumuloClusterController());
        }

        protected Builder(final MiniAccumuloClusterController instance) {
            this.instance = instance;
        }

        public Builder dirName(final String dirName) {
            instance.dirName = dirName;
            return this;
        }

        public Builder tempDir(final boolean tempDir) {
            instance.isTempDir = tempDir;
            return this;
        }

        public Builder tempDir() {
            return tempDir(true);
        }

        public Builder password(final String password) {
            instance.password = password;
            return this;
        }

        public Builder instanceName(final String instanceName) {
            instance.instanceName = instanceName;
            return this;
        }

        public Builder shutdownHook() {
            return shutdownHook(true);
        }

        public Builder shutdownHook(final boolean shutdownHook) {
            instance.shutdownHook = shutdownHook;
            return this;
        }

        public Builder heapSize(final int heapSize) {
            instance.heapSize = heapSize;
            return this;
        }

        public MiniAccumuloClusterController build() {
            return instance;
        }
    }
}
