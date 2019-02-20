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

import org.junit.Test;

import java.io.File;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class MiniAccumuloClusterControllerTest {
    @Test
    public void shouldStartAndStopCluster() throws Exception {
        // Given
        final String miniAccumuloClusterName = "miniAccumuloCluster";
        final Exception[] accumuloException = new Exception[1];
        final MiniAccumuloClusterController[] runner = new MiniAccumuloClusterController[1];

        // When
        try {
            new Thread(() -> {
                try {
                    runner[0] = new MiniAccumuloClusterController.Builder()
                            .dirName(miniAccumuloClusterName)
                            .instanceName("instance")
                            .password("password")
                            .heapSize(1024)
                            .build();
                    runner[0].start();
                } catch (final Exception e) {
                    accumuloException[0] = e;
                }
            }).start();

            // Wait for accumulo to start
            int maxAttempts = 500;
            int attempts = 0;
            while (!new File(miniAccumuloClusterName + "/store.properties").exists() && attempts < maxAttempts && null == accumuloException[0]) {
                attempts++;
                Thread.sleep(500);
            }
            Thread.sleep(5000);

            // Then
            assertNull(null != accumuloException[0] ? accumuloException[0].getMessage() : "", accumuloException[0]);
            assertTrue("store.properties was not generated", new File(miniAccumuloClusterName + "/store.properties").exists());
            assertEquals(1024, runner[0].getHeapSize());
        } finally {
            if (null != runner[0]) {
                runner[0].stop();
            }
        }
    }
}
