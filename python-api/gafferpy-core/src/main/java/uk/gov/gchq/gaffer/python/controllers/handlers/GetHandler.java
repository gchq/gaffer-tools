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

package uk.gov.gchq.gaffer.python.controllers.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpsExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.gchq.gaffer.python.controllers.SessionManager;
import uk.gov.gchq.gaffer.python.util.UtilFunctions;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Date;

public class GetHandler implements HttpHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(SessionManager.class);

    /**
     * A file location for transmission
     */
    private String location;
    private boolean secure;

    public GetHandler(final String location, final boolean secure) {
        this.setLocation(location);
        this.setSecure(secure);
    }

    @Override
    public void handle(final HttpExchange httpExchange) throws IOException {
        LOGGER.info("Connection made to HTTP server from: {} at {}", httpExchange.getRemoteAddress(), new Date());

        File in = new File(new UtilFunctions().loadFile(getLocation()));
        byte[] bytes = readFileData(in, (int) in.length());

        if (this.isSecure()) {
            HttpsExchange httpsExchange = (HttpsExchange) httpExchange;
            httpsExchange.getSSLSession();
            httpsExchange.sendResponseHeaders(200, bytes.length);
            OutputStream os = httpsExchange.getResponseBody();
            os.write(bytes);
            os.flush();
            httpsExchange.close();
        } else {
            httpExchange.sendResponseHeaders(200, bytes.length);
            OutputStream output = httpExchange.getResponseBody();
            output.write(bytes);
            output.flush();
            httpExchange.close();
        }
    }

    public String getLocation() {
        return location;
    }

    private void setLocation(final String location) {
        this.location = location;
    }

    private byte[] readFileData(final File file, final int fileLength) throws IOException {
        byte[] fileData = new byte[fileLength];

        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            fileInputStream.read(fileData);
        }
        return fileData;
    }

    private boolean isSecure() {
        return secure;
    }

    private void setSecure(final boolean secure) {
        this.secure = secure;
    }
}
