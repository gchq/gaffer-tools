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

import org.apache.slider.funtest.framework.CommandTestBase;

public final class GafferSliderProperties {

    private GafferSliderProperties() {
        // private to prevent instantiation
    }

    public static final String GAFFER_ACCUMULO_USER = "gaffer_slider";

    public static final String TEST_APP_RESOURCES_DIR_PROP = "test.app.resources.dir";
    public static final String TEST_ADDON_PKG_DIR_PROP = "test.addon.pkg.dir";
    public static final String TEST_ADDON_PKG_FILE_PROP = "test.addon.pkg.file";
    public static final String TEST_ADDON_PKG_NAME_PROP = "test.addon.pkg.name";

    public static final String TEST_APP_RESOURCES_DIR = CommandTestBase.sysprop(TEST_APP_RESOURCES_DIR_PROP);
    public static final String TEST_ADDON_PKG_DIR = CommandTestBase.sysprop(TEST_ADDON_PKG_DIR_PROP);
    public static final String TEST_ADDON_PKG_FILE = CommandTestBase.sysprop(TEST_ADDON_PKG_FILE_PROP);
    public static final String TEST_ADDON_PKG_NAME = CommandTestBase.sysprop(TEST_ADDON_PKG_NAME_PROP);

}
