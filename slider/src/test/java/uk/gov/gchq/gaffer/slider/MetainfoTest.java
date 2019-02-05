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

package uk.gov.gchq.gaffer.slider;

import org.apache.slider.core.exceptions.SliderException;
import org.apache.slider.providers.agent.application.metadata.AddonPackageMetainfoParser;
import org.apache.slider.providers.agent.application.metadata.Metainfo;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

/**
 * Tests that the gaffer-slider metainfo.xml file is well formed
 */
public class MetainfoTest {

	private static final String METAINFO_FILE = "/metainfo.xml";

	@Test
	public void checkMetainfoIsValid () throws IOException, SliderException {
		InputStream metainfoStream = this.getClass().getResourceAsStream(METAINFO_FILE);
		Assert.assertNotNull("Unable to load metainfo file for testing: " + METAINFO_FILE, metainfoStream);

		AddonPackageMetainfoParser parser = new AddonPackageMetainfoParser();
		Metainfo metainfo = parser.fromXmlStream(metainfoStream);
		Assert.assertNotNull("Parsing of " + METAINFO_FILE + " failed!", metainfo);

		metainfo.validate();
	}

}
