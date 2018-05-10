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

import org.apache.accumulo.minicluster.MemoryUnit;
import org.apache.accumulo.minicluster.MiniAccumuloCluster;
import org.apache.accumulo.minicluster.MiniAccumuloConfig;
import org.apache.accumulo.shell.Shell;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Properties;

/**
 * Starts a mini accumulo cluster. Can be run directly from an IDE or compiled and
 * the main method invoked from the command line using:
 * java -jar target/mini-accumulo-cluster-jar-with-dependencies.jar
 *
 * @see MiniAccumuloClusterWithShellController.Builder
 */
public final class MiniAccumuloClusterWithShellController {

    private static final Logger LOGGER = Logger.getLogger(MiniAccumuloClusterWithShellController.class);

    private static boolean shutdownHookAdded = false;

    private String dirName;
    private boolean isTempDir;
    private String password;
    private String instanceName;
    private boolean shutdownHook;
    private Integer heapSize;

    private Path clusterPath;
    private MiniAccumuloCluster cluster;
    private Shell shell;

    protected MiniAccumuloClusterWithShellController(final Path propFileLocation) {
        final Properties props = new Properties();
        if (null != propFileLocation) {
            try (final InputStream accIs = Files.newInputStream(propFileLocation, StandardOpenOption.READ)) {
                props.load(accIs);
            } catch (final IOException e) {
                throw new IllegalArgumentException("Unable to find configuration file at path: " + propFileLocation.toString());
            }
        }

        dirName = props.getProperty(MiniAccumuloClusterProps.DIR_NAME_KEY);
        final String isTempDirProp = props.getProperty(MiniAccumuloClusterProps.IS_TEMP_DIR_KEY);
        if (StringUtils.isNotEmpty(isTempDirProp)) {
            isTempDir = Boolean.parseBoolean(isTempDirProp);
        }
        password = props.getProperty(MiniAccumuloClusterProps.PASSWORD_KEY);
        instanceName = props.getProperty(MiniAccumuloClusterProps.INSTANCE_NAME_KEY);
        final String shutdownHookProp = props.getProperty(MiniAccumuloClusterProps.SHUTDOWN_HOOK_KEY);
        if (StringUtils.isNotEmpty(shutdownHookProp)) {
            shutdownHook = Boolean.parseBoolean(shutdownHookProp);
        }
        final String heapSizeProp = props.getProperty(MiniAccumuloClusterProps.HEAP_SIZE_KEY);
        if (StringUtils.isNotEmpty(heapSizeProp)) {
            heapSize = Integer.parseInt(heapSizeProp);
        }
    }

    protected MiniAccumuloClusterWithShellController(final String dirName, final boolean isTempDir, final String password, final String instanceName, final boolean shutdownHook) {
        this.dirName = dirName;
        this.isTempDir = isTempDir;
        this.password = password;
        this.instanceName = instanceName;
        this.shutdownHook = shutdownHook;
    }

    public static void main(final String[] args) {
        if (null != args && args.length > 7) {
            LOGGER.error("Usage: [properties_file_location] | ([directory_name] [is_temp_directory] [root_password] [instance_name] [exec_script] [no_shell] [heap_memory])");
            throw new IllegalArgumentException("Wrong number of args");
        }

        final MiniAccumuloClusterWithShellController runner;
        if (args.length == 1) {
            runner = new Builder()
                    .propertiesFileLocation(args[0])
                    .build();

        } else {
            runner = new Builder()
                    .dirName(getDirName(args))
                    .tempDir(isTempDir(args))
                    .password(getPassword(args))
                    .instanceName(getInstanceName(args))
                    .shutdownHook(true)
                    .build();

        }
        runner.start();
        runner.startShell();
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

    public void startShell() {
        if (null == cluster) {
            start();
        }

        final String[] shellArgs = new String[]{
                "-u", "root",
                "-p", cluster.getConfig().getRootPassword(),
                "-z", cluster.getInstanceName(), cluster.getZooKeepers()};

        try {
            shell = new Shell();
            if (!shell.config(shellArgs)) {
                throw new RuntimeException("Shell failed with code: " + shell.getExitCode());
            }
            shell.start();
        } catch (final IOException e) {
            throw new RuntimeException("Failed to start shell");
        }
    }

    public void stop() {
        if (null != shell) {
            shell.shutdown();
            shell = null;
        }

        if (null != cluster) {
            try {
                cluster.stop();
                cluster = null;
                System.out.println("Cluster stopped");
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

    private void createShutdownHook() {
        if (!shutdownHookAdded) {
            shutdownHookAdded = true;
            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    MiniAccumuloClusterWithShellController.this.stop();
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
            throw new RuntimeException("Failed to start cluster", e);
        }

        System.out.println("Cluster started:");
        System.out.println("\tLocation - " + cluster.getConfig().getDir().getAbsolutePath());
        System.out.println("\tZookeepers - " + cluster.getZooKeepers());
        System.out.println("\tInstance name - " + cluster.getInstanceName());

        try {
            final File propsFile = new File(clusterPath + "/store.properties");
            FileUtils.copyInputStreamToFile(getClass().getResourceAsStream("/store.properties.template"), propsFile);
            FileUtils.write(propsFile, "accumulo.zookeepers=" + cluster.getZooKeepers(), true);
        } catch (final IOException e) {
            e.printStackTrace();
        }
    }

    private void createDirectory() {
        clusterPath = Paths.get(dirName);
        if (Files.exists(clusterPath)) {
            try {
                FileUtils.deleteDirectory(clusterPath.toFile());
            } catch (final IOException e1) {
                System.err.println("Failed to delete old directory");
            }
        }

        try {
            if (isTempDir) {
                clusterPath = Files.createTempDirectory(dirName);
            } else {
                clusterPath = Files.createDirectory(clusterPath);
            }
        } catch (final IOException e) {
            throw new RuntimeException("Unable to create directory", e);
        }
    }

    private static String getDirName(final String[] args) {
        return getArgOrDefault(0, MiniAccumuloClusterProps.DEFAULT_DIR_NAME, args);
    }

    private static boolean isTempDir(final String[] args) {
        return Boolean.parseBoolean(getArgOrDefault(1, "false", args));
    }

    private static String getPassword(final String[] args) {
        return getArgOrDefault(2, MiniAccumuloClusterProps.DEFAULT_PASSWORD, args);
    }

    private static String getInstanceName(final String[] args) {
        return getArgOrDefault(3, MiniAccumuloClusterProps.DEFAULT_INSTANCE_NAME, args);
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
        private int heapSize = 128;
        private String propsFileLocation = MiniAccumuloClusterProps.DEFAULT_DIR_NAME + "/miniAccumuloStore.properties";

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

        public Builder heapSize() {
            return heapSize(128);
        }

        public Builder heapSize(final int heapSize) {
            this.heapSize = heapSize;
            return this;
        }

        public Builder propertiesFileLocation() {
            return propertiesFileLocation();
        }

        public Builder propertiesFileLocation(final String propsFileLocation) {
            this.propsFileLocation = propsFileLocation;
            return this;
        }

        public MiniAccumuloClusterWithShellController build() {
            return new MiniAccumuloClusterWithShellController(dirName, isTempDir, password, instanceName, shutdownHook);
        }

        public MiniAccumuloClusterWithShellController buildFromProps() {
            return new MiniAccumuloClusterWithShellController(Paths.get(propsFileLocation));
        }
    }
}
