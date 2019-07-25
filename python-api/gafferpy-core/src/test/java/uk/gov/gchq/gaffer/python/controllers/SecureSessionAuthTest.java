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

package uk.gov.gchq.gaffer.python.controllers;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;

import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.Socket;
import java.net.URL;
import java.net.UnknownHostException;


public class SecureSessionAuthTest {

    private static final String USER_AGENT = "Mozilla/5.0";

    private static String getHome;
    private static String secureGetHome;
    private static String getMetrics;
    private static String postRequest;
    private static String noneExistingPage;

    private static String address;

    private static SecureSessionAuth auth = SecureSessionAuth.getInstance();

    @BeforeClass
    public static void setUp() throws UnknownHostException {
        System.setProperty("javax.net.ssl.trustStore", "src/test/resources/client-truststore.jks");

        address = InetAddress.getLocalHost().getHostAddress();

        getHome = "http://" + address + ":8080/api/1.0";
        secureGetHome = "https://" + address + ":8080/api/1.0";
        getMetrics = "http://" + address + ":8080/api/1.0/metrics";
        postRequest = "http://" + address + ":8080/api/1.0/create";
        noneExistingPage = "http://" + address + ":8080/api/1.0/lol";

    }

    @After
    public void tearDown() {
        auth.stop();
    }

    @AfterClass
    public static void cleanUp() throws ServerNullException {
        SessionManager.getInstance().removeAllSessions();
    }

    @Test
    public void sessionAuth_ReturnsMetrics() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test.properties").getFile());
        PropertiesService service = new PropertiesService(file);

        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        URL url = new URL(getMetrics);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        System.out.println(connection.getResponseMessage());

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_CanCreateSessions() throws IOException {

        File file = new File(getClass().getClassLoader().getResource("test.properties").getFile());

        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        URL url = new URL(postRequest);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("User-Agent", USER_AGENT);
        connection.setRequestProperty("Accept-Language", "en-US,en");

        String urlParameters = "id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ1c2VyIiwiZGF0YV9hdXRoIjpbIlRFU1" +
                "QiXSwib3BfYXV0aCI6WyJSRUFEIiwiV1JJVEUiXSwiaXNzIjoiRVhBTVBMRV9JREFNIiwidXNlciI6Im5hbWUifQ.oCKcOuV0YAcC0Gc" +
                "XNs_yaml6txVfaMiCN0hhR5laaTc" +
                "&access_token=xtcryvhbkjnlmdrfwefweffsfexample&" +
                "token_type=Bearer";

        // Send post request
        connection.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();

        System.out.println("Sending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + urlParameters);
        System.out.println("Response Code : " + connection.getResponseCode());

        //print result
        System.out.println(getBody(connection));

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_DisplaysDefaultPage() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test.properties").getFile());
        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();


        URL url = new URL(getHome);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_ShowsCorrectErrorPage() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test.properties").getFile());
        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();


        URL url = new URL(noneExistingPage);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_CanBeSetToUseSSL() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test4.properties").getFile());
        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        URL url = new URL(secureGetHome);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();

        connection.setHostnameVerifier((arg0, arg1) -> true);

        Assert.assertEquals("true", service.isSsl());
        System.out.println(getBody(connection));
        Assert.assertEquals(HttpsURLConnection.HTTP_OK, connection.getResponseCode());
    }


    @Test
    public void sessionAuth_SeeIfServerIsConfiguredCorrectly() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test4.properties").getFile());
        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        Socket socket = SSLSocketFactory.getDefault().
                createSocket(address, 8080);
        try {
            Writer out = new OutputStreamWriter(
                    socket.getOutputStream(), "ISO-8859-1");
            out.write("GET / HTTP/1.1\r\n");
            out.write("Host: " + address + ":" +
                    8080 + "\r\n");
            out.write("Agent: SSL-TEST\r\n");
            out.write("\r\n");
            out.flush();
            BufferedReader in = new BufferedReader(
                    new InputStreamReader(socket.getInputStream(), "ISO-8859-1"));
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            Assert.fail();
        } catch (IOException e) {
            e.printStackTrace();
            Assert.fail();
        } catch (Exception e) {
            e.printStackTrace();
            Assert.fail();
        } finally {
            socket.close();
        }
        auth.stop();
    }

    @Test
    public void sessionAuth_CanBeRanInInsecureMode() throws IOException {
        File file = new File(getClass().getClassLoader().getResource("test1.properties").getFile());
        PropertiesService service = new PropertiesService(file);
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        URL url = new URL(getHome);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        Assert.assertEquals("true", service.getInsecure());
        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    private String getBody(HttpURLConnection connection) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return response.toString();
    }
}
