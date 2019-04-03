package uk.gov.gchq.gaffer.python.controllers.services;

import org.junit.Test;

import uk.gov.gchq.gaffer.python.util.UtilFunctions;

import static org.junit.Assert.assertEquals;

public class PropertiesServiceTest {

    @Test
    public void ifSingleService_OnlyNecessaryValuesToBeSet() {
        PropertiesService test = new PropertiesService(new UtilFunctions().loadFile("test.properties"));
        assertEquals("AllProps=[single-service=true,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-type=,keystore-location=," +
                "protocol=,keymanager-type=]]", test.toString());
    }

    @Test
    public void ifNoNecessaryValuesSet_defaultToSingleService() {
        PropertiesService test1 = new PropertiesService(new UtilFunctions().loadFile("test1.properties"));
        assertEquals("AllProps=[single-service=true,insecure=true,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-type=,keystore-location=," +
                "protocol=,keymanager-type=]]", test1.toString());
    }

    @Test
    public void ifSecuredSession_isEnabled_NeededPropsArePopulated() {
        PropertiesService test2 = new PropertiesService(new UtilFunctions().loadFile("test2.properties"));
        assertEquals("AllProps=[single-service=false,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=https://localhost:8080,ssl-password=,keystore-type=,keystore-location=," +
                "protocol=,keymanager-type=]]", test2.toString());
    }

    @Test
    public void ifSecuredSession_isDisabled_PropsArentPopulated() {
        PropertiesService test3 = new PropertiesService(new UtilFunctions().loadFile("test3.properties"));
        assertEquals("AllProps=[single-service=false,insecure=true,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-type=,keystore-location=," +
                "protocol=,keymanager-type=]]", test3.toString());
    }

    @Test
    public void ifSSL_isEnabled_OtherPropsArePopulated() {
        PropertiesService test4 = new PropertiesService(new UtilFunctions().loadFile("test4.properties"));
        assertEquals("AllProps=[single-service=false,insecure=false,use-ssl=true," +
                "optional=[auth-service-url=https://localhost:8080/create_session,ssl-password=placeholder," +
                "keystore-type=JKS," +
                "keystore-location=src/test/resources/example.jks," +
                "protocol=TLSv1.2,keymanager-type=JKS]" +
                "]", test4.toString());
    }

    @Test
    public void ifSSL_isDisabled_OtherPropsAreOptional() {
        PropertiesService test5 = new PropertiesService(new UtilFunctions().loadFile("test5.properties"));
        assertEquals("AllProps=[single-service=true,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=," +
                "keystore-type=,keystore-location=,protocol=,keymanager-type=]" +
                "]", test5.toString());
    }



}