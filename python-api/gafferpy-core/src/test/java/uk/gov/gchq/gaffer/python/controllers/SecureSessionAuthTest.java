package uk.gov.gchq.gaffer.python.controllers;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Test;

import uk.gov.gchq.gaffer.python.controllers.services.PropertiesService;
import uk.gov.gchq.gaffer.python.util.UtilFunctions;
import uk.gov.gchq.gaffer.python.util.exceptions.ServerNullException;

import javax.net.ssl.*;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

public class SecureSessionAuthTest {

    private static final String USER_AGENT = "Mozilla/5.0";

    private static final String GET_HOME = "http://localhost:8080/api/1.0";
    private static final String SECURE_GET_HOME = "https://localhost:8080/api/1.0";
    private static final String GET_METRICS = "http://localhost:8080/api/1.0/metrics";
    private static final String POST_REQUEST = "http://localhost:8080/api/1.0/create";
    private static final String NONE_EXISTING_PAGE = "http://localhost:8080/api/1.0/lol";

    private static SecureSessionAuth auth = SecureSessionAuth.getInstance();

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

        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test1.properties"));

        auth.setPropertiesService(service);

        URL url = new URL(GET_METRICS);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        // Make it use the current properties
        auth.run();

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_CanCreateSessions() throws IOException {
        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test.properties"));
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        URL url = new URL(POST_REQUEST);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("User-Agent", USER_AGENT);
        connection.setRequestProperty("Accept-Language", "en-US,en");

        String urlParameters = "token=C02G8416DRJM&user=example&roles=caller";

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
        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test1.properties"));
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();


        URL url = new URL(GET_HOME);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_ShowsCorrectErrorPage() throws IOException {
        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test1.properties"));
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();


        URL url = new URL(NONE_EXISTING_PAGE);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_CanBeSetToUseSSL() throws IOException, NoSuchAlgorithmException, KeyManagementException {
        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test4.properties"));
        auth.setPropertiesService(service);

        // Make it use the current properties
        auth.run();

        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(new KeyManager[0], new TrustManager[] {new DefaultTrustManager()}, new SecureRandom());
        SSLContext.setDefault(ctx);

        URL url = new URL(SECURE_GET_HOME);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();

        connection.setHostnameVerifier((arg0, arg1) -> true);

        Assert.assertEquals("true", service.isSsl());
        Assert.assertEquals(HttpURLConnection.HTTP_OK, connection.getResponseCode());
    }

    @Test
    public void sessionAuth_CanBeRanInInsecureMode() throws IOException {
        PropertiesService service = new PropertiesService(new UtilFunctions().loadFile("test1.properties"));
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


    private static class DefaultTrustManager implements X509TrustManager {

        @Override
        public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}

        @Override
        public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return null;
        }
    }

}