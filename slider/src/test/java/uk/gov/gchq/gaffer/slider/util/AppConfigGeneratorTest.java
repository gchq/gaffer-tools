/*
 * Copyright 2017-2019 Crown Copyright
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

package uk.gov.gchq.gaffer.slider.util;

import org.apache.slider.api.ResourceKeys;
import org.apache.slider.core.conf.ConfTree;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static uk.gov.gchq.gaffer.slider.util.AppConfigGenerator.ACCUMULO_COMPONENT_PROPERTY_LOOKUP;
import static uk.gov.gchq.gaffer.slider.util.AppConfigGenerator.COMPONENT;

public class AppConfigGeneratorTest {

    @Test
    public void testSingleNodeConfigGeneration() throws IOException {
        // 3 nodes of 12 cores and 32GB mem each
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(12, 32 * 1024, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        appConfigGenerator.setSingleNode(true);
        appConfigGenerator.setClusterUsagePercent(100);
        final AppConfigGenerator.SliderAppConfig newConfig = appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);

        // Slider AM uses 1 core + 256MB mem
        // Non-tablet server Accumulo components (5) use 1 core + 1GB mem each = 5 cores + 5GB mem
        // Leaving 6 cores + 26.75GB mem for the 3 tablet server instances

        final Map<String, String> tserverConfig = newConfig.getResources().components.get(AppConfigGenerator.COMPONENT.ACCUMULO_TSERVER.name());
        assertEquals("Number of instances", "3", tserverConfig.get(ResourceKeys.COMPONENT_INSTANCES));
        assertEquals("Number of cores", "2", tserverConfig.get(ResourceKeys.YARN_CORES));
        assertEquals("Memory amount", "9130", tserverConfig.get(ResourceKeys.YARN_MEMORY));

        final String tserverHeapSize = newConfig.getAppConfig().global.get(ACCUMULO_COMPONENT_PROPERTY_LOOKUP.get(COMPONENT.ACCUMULO_TSERVER));
        assertEquals("Heap Size", "7023m", tserverHeapSize);
    }

    @Test
    public void testMultiNodeConfigGeneration() throws IOException {
        // 3 nodes of 8 cores and 32GB mem each
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(8, 32 * 1024, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        final AppConfigGenerator.SliderAppConfig newConfig = appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);

        // Total resource availability = 24 cores + 96GB mem
        // Using 85% of cluster availability = 20 cores + 81.6GB mem
        // Slider AM uses 1 core + 256MB mem
        // Non-tablet server Accumulo components (5) use 1 core + 1GB mem each = 5 cores + 5GB mem
        // Leaving 14 cores + 76.3GB mem for the 3 tablet server instances

        final Map<String, String> tserverConfig = newConfig.getResources().components.get(AppConfigGenerator.COMPONENT.ACCUMULO_TSERVER.name());
        assertEquals("Number of instances", "3", tserverConfig.get(ResourceKeys.COMPONENT_INSTANCES));
        assertEquals("Number of cores", "4", tserverConfig.get(ResourceKeys.YARN_CORES));
        assertEquals("Memory amount", "26060", tserverConfig.get(ResourceKeys.YARN_MEMORY));

        final String tserverHeapSize = newConfig.getAppConfig().global.get(ACCUMULO_COMPONENT_PROPERTY_LOOKUP.get(COMPONENT.ACCUMULO_TSERVER));
        assertEquals("Heap Size", "20046m", tserverHeapSize);
    }

    @Test
    public void testNoCoresAvailable() {
        // 3 nodes of 6 cores and 32GB mem each
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(6, 32 * 1024, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        appConfigGenerator.setSingleNode(true);
        appConfigGenerator.setClusterUsagePercent(100);

        // 5 non-tablet server Accumulo components and 1 Slider AM require use of all the 6 available cores
        // so there aren't any cores left to be allocated to tablet servers

        try {
            appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
            fail("Expected exception to be thrown");
        } catch (final IOException e) {
            if (!e.getMessage().startsWith("No resources left")) {
                fail("Caught unexpected exception: " + e);
            }
        }
    }

    @Test
    public void testNotEnoughCoresAvailable() {
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(8, 32 * 1024, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        appConfigGenerator.setSingleNode(true);
        appConfigGenerator.setClusterUsagePercent(100);

        // 9 cores required, but only 8 available - 5 x non-tablet server Accumulo components, 1 Slider AM and 3 Tablet Servers

        try {
            appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
            fail("Expected exception to be thrown");
        } catch (final IOException e) {
            if (!e.getMessage().startsWith("Not enough available resources")) {
                fail("Caught unexpected exception: " + e);
            }
        }
    }

    @Test
    public void testNoMemoryAvailable() {
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(40, 5 * 1024, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        appConfigGenerator.setSingleNode(true);
        appConfigGenerator.setClusterUsagePercent(100);

        // 5.25GB mem required by non-tablet server Accumulo components, so no mem left for tablet servers

        try {
            appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
            fail("Expected exception to be thrown");
        } catch (final IOException e) {
            if (!e.getMessage().startsWith("No resources left")) {
                fail("Caught unexpected exception: " + e);
            }
        }
    }

    @Test
    public void testNotEnoughMemoryAvailable() {
        final AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(40, (5 * 1024) + 257, 3);

        final AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
        appConfigGenerator.setSingleNode(true);
        appConfigGenerator.setClusterUsagePercent(100);

        // 5.25GB mem required by non-tablet server Accumulo components
        // only 1MB left to be shared between 3 tablet servers

        try {
            appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
            fail("Expected exception to be thrown");
        } catch (final IOException e) {
            if (!e.getMessage().startsWith("Not enough available resources")) {
                fail("Caught unexpected exception: " + e);
            }
        }
    }

}
