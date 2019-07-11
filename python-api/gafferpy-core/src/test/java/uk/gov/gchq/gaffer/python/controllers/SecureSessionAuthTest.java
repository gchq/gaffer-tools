package uk.gov.gchq.gaffer.python.controllers;

import org.junit.*;
import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.net.*;

public class SecureSessionAuthTest {

    private static final String USER_AGENT = "Mozilla/5.0";

    private static String GET_HOME;
    private static String SECURE_GET_HOME;
    private static String GET_METRICS;
    private static String POST_REQUEST;
    private static String NONE_EXISTING_PAGE;

    private static String ADDRESS;

    private static SecureSessionAuth auth = SecureSessionAuth.getInstance();

    @BeforeClass
    public static void setUp() throws UnknownHostException {
        System.setProperty("javax.net.ssl.trustStore", "src/test/resources/client-truststore.jks");

        ADDRESS = InetAddress.getLocalHost().getHostAddress();

        GET_HOME = "http://" + ADDRESS + ":8080/api/1.0";
        SECURE_GET_HOME = "https://" + ADDRESS + ":8080/api/1.0";
        GET_METRICS = "http://" + ADDRESS + ":8080/api/1.0/metrics";
        POST_REQUEST = "http://" + ADDRESS + ":8080/api/1.0/create";
        NONE_EXISTING_PAGE = "http://" + ADDRESS + ":8080/api/1.0/lol";

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

        URL url = new URL(GET_METRICS);
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

        URL url = new URL(POST_REQUEST);
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


        URL url = new URL(GET_HOME);
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


        URL url = new URL(NONE_EXISTING_PAGE);
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

        URL url = new URL(SECURE_GET_HOME);
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
                createSocket(ADDRESS, 8080);
        try {
            Writer out = new OutputStreamWriter(
                    socket.getOutputStream(), "ISO-8859-1");
            out.write("GET / HTTP/1.1\r\n");
            out.write("Host: " + ADDRESS + ":" +
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

        URL url = new URL(GET_HOME);
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