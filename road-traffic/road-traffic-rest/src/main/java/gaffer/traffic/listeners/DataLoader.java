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

package gaffer.traffic.listeners;

import gaffer.graph.Graph;
import gaffer.operation.OperationChain;
import gaffer.operation.OperationException;
import gaffer.operation.impl.add.AddElements;
import gaffer.operation.impl.generate.GenerateElements;
import gaffer.rest.GraphFactory;
import gaffer.traffic.generator.RoadUseElementGenerator;
import gaffer.user.User;
import org.apache.commons.io.FileUtils;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.logging.Logger;

@WebListener
public class DataLoader implements ServletContextListener {
    public static final String DATA_PATH = "roadTraffic.dataLoader.dataPath";

    private static final Logger LOGGER = Logger.getLogger(DataLoader.class.getName());

    @Override
    public void contextInitialized(final ServletContextEvent servletContextEvent) {
        final String dataPath = System.getProperty(DATA_PATH);
        if (null != dataPath) {
            loadData(dataPath);
        }
    }

    @Override
    public void contextDestroyed(final ServletContextEvent servletContextEvent) {
    }

    private void loadData(final String dataPath) {
        LOGGER.info("Loading data");

        final OperationChain<Void> populateChain = new OperationChain.Builder()
                .first(new GenerateElements.Builder<String>()
                        .objects(getData(dataPath))
                        .generator(new RoadUseElementGenerator())
                        .build())
                .then(new AddElements.Builder()
                        .skipInvalidElements(false)
                        .build())
                .build();

        final Graph graph = GraphFactory.createGraphFactory().getGraph();
        try {
            graph.execute(populateChain, new User());
        } catch (OperationException e) {
            LOGGER.info("Unable to load data: " + e.getMessage());
            throw new RuntimeException("Unable to load data", e);
        }

        LOGGER.info("Sample data has been loaded");
    }

    private Iterable<String> getData(final String dataPath) {
        return new LineIterator(dataPath);
    }

    private static final class LineIterator implements Iterable<String> {
        private final String filePath;

        private LineIterator(final String filePath) {
            this.filePath = filePath;
        }

        @Override
        public Iterator<String> iterator() {
            try {
                return FileUtils.lineIterator(new File(filePath), "UTF-8");
            } catch (IOException e) {
                LOGGER.info("Unable to load data: " + e.getMessage());
                throw new RuntimeException("Unable to load data", e);
            }
        }
    }
}
