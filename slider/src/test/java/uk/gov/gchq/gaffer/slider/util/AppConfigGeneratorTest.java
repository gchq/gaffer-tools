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

package uk.gov.gchq.gaffer.slider.util;

import org.apache.slider.api.ResourceKeys;
import org.apache.slider.core.conf.ConfTree;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class AppConfigGeneratorTest {

	@Test
	public void testSingleNodeConfigGeneration() throws IOException {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(12, 32 * 1024, 3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		appConfigGenerator.setSingleNode(true);
		appConfigGenerator.setClusterUsagePercent(100);
		AppConfigGenerator.SliderAppConfig newConfig = appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);

		Map<String, String> tserverConfig = newConfig.getResources().components.get(AppConfigGenerator.COMPONENT.ACCUMULO_TSERVER.name());
		assertEquals("Number of instances", "3", tserverConfig.get(ResourceKeys.COMPONENT_INSTANCES));
		assertEquals("Number of cores", "2", tserverConfig.get(ResourceKeys.YARN_CORES));
		assertEquals("Memory amount", "9130", tserverConfig.get(ResourceKeys.YARN_MEMORY));
	}

	@Test
	public void testMultiNodeConfigGeneration() throws IOException {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(8, 32 * 1024, 3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		AppConfigGenerator.SliderAppConfig newConfig = appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);

		Map<String, String> tserverConfig = newConfig.getResources().components.get(AppConfigGenerator.COMPONENT.ACCUMULO_TSERVER.name());
		assertEquals("Number of instances", "3", tserverConfig.get(ResourceKeys.COMPONENT_INSTANCES));
		assertEquals("Number of cores", "4", tserverConfig.get(ResourceKeys.YARN_CORES));
		assertEquals("Memory amount", "26060", tserverConfig.get(ResourceKeys.YARN_MEMORY));
	}

	@Test
	public void testNoCoresAvailable() {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(6, 32 * 1024, 3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		appConfigGenerator.setSingleNode(true);
		appConfigGenerator.setClusterUsagePercent(100);

		try {
			appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
			fail("Expected exception to be thrown");
		} catch (IOException e) {
			if (!e.getMessage().startsWith("No resources left")) {
				fail("Caught unexpected exception: " + e);
			}
		}
	}

	@Test
	public void testNotEnoughCoresAvailable() {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(8, 32 * 1024, 3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		appConfigGenerator.setSingleNode(true);
		appConfigGenerator.setClusterUsagePercent(100);

		try {
			appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
			fail("Expected exception to be thrown");
		} catch (IOException e) {
			if (!e.getMessage().startsWith("Not enough available resources")) {
				fail("Caught unexpected exception: " + e);
			}
		}
	}

	@Test
	public void testNoMemoryAvailable() {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(40, 5 * 1024, 3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		appConfigGenerator.setSingleNode(true);
		appConfigGenerator.setClusterUsagePercent(100);

		try {
			appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
			fail("Expected exception to be thrown");
		} catch (IOException e) {
			if (!e.getMessage().startsWith("No resources left")) {
				fail("Caught unexpected exception: " + e);
			}
		}
	}

	@Test
	public void testNotEnoughMemoryAvailable() {
		AppConfigGenerator.AvailableResources resources = new AppConfigGenerator.AvailableResources(40, (5 * 1024) + 257,3);

		AppConfigGenerator appConfigGenerator = new AppConfigGenerator();
		appConfigGenerator.setSingleNode(true);
		appConfigGenerator.setClusterUsagePercent(100);

		try {
			appConfigGenerator.generateSliderAppConfig(new ConfTree(), resources);
			fail("Expected exception to be thrown");
		} catch (IOException e) {
			if (!e.getMessage().startsWith("Not enough available resources")) {
				fail("Caught unexpected exception: " + e);
			}
		}
	}

}
