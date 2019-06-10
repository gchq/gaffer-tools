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

import java.io.IOException;

/**
 * Starts a mini accumulo cluster. Can be run directly from an IDE or compiled and
 * the main method invoked from the command line using:
 * java -jar target/mini-accumulo-cluster-jar-with-dependencies.jar
 *
 * @see MiniAccumuloClusterWithShellController.Builder
 */
public class MiniAccumuloClusterWithShellController extends MiniAccumuloClusterController {
    private Shell shell;

    public MiniAccumuloClusterWithShellController() {
        super();
    }

    public MiniAccumuloClusterWithShellController(final String[] args) {
        super(args);
    }

    public static void main(final String[] args) {
        final MiniAccumuloClusterWithShellController instance = new MiniAccumuloClusterWithShellController(args);
        instance.start();
        instance.startShell();
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

    @Override
    public void stop() {
        if (null != shell) {
            shell.shutdown();
            shell = null;
        }

        super.stop();
    }

    @Override
    protected void watchShutdown() {
        // don't watch the shutdown file.
    }

    public static class Builder extends MiniAccumuloClusterController.Builder {
        public Builder() {
            this(new MiniAccumuloClusterWithShellController());
        }

        protected Builder(final MiniAccumuloClusterWithShellController instance) {
            super(instance);
        }

        @Override
        public MiniAccumuloClusterWithShellController build() {
            return (MiniAccumuloClusterWithShellController) super.build();
        }
    }
}
