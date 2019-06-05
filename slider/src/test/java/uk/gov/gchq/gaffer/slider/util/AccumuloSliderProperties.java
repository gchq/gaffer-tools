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

import org.apache.slider.common.SliderXMLConfKeysForTesting;
import org.apache.slider.funtest.framework.CommandTestBase;
import org.apache.slider.test.SliderTestUtils;

public final class AccumuloSliderProperties {

    private AccumuloSliderProperties() {
        // private to prevent instantiation
    }

    public static final String ACCUMULO_TABLET_SERVER_ROLE_NAME = "ACCUMULO_TSERVER";

    public static final String TRACE_USER_PROPERTY = "site.accumulo-site.trace.user";

    public static final String INSTANCE_PROPERTY = "site.client.instance.name";

    public static final int ACCUMULO_LAUNCH_WAIT_TIME = SliderTestUtils.getTimeOptionMillis(
            CommandTestBase.SLIDER_CONFIG,
            SliderXMLConfKeysForTesting.KEY_ACCUMULO_LAUNCH_TIME,
            SliderXMLConfKeysForTesting.DEFAULT_ACCUMULO_LAUNCH_TIME_SECONDS * 1000
    );

    public static final int ACCUMULO_GO_LIVE_TIME = SliderTestUtils.getTimeOptionMillis(
            CommandTestBase.SLIDER_CONFIG,
            SliderXMLConfKeysForTesting.KEY_ACCUMULO_GO_LIVE_TIME,
            SliderXMLConfKeysForTesting.DEFAULT_ACCUMULO_LIVE_TIME_SECONDS * 1000
    );

}
