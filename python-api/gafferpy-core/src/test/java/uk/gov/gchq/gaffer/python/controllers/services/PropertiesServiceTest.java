package uk.gov.gchq.gaffer.python.controllers.services;

import org.junit.Test;

import uk.gov.gchq.gaffer.python.util.UtilFunctions;

import java.io.File;

import static org.junit.Assert.assertEquals;

public class PropertiesServiceTest {

    @Test
    public void ifSingleService_OnlyNecessaryValuesToBeSet() {
        File in = new File(getClass().getClassLoader().getResource("test.properties").getFile());
        PropertiesService test = new PropertiesService(in);
        assertEquals("AllProps=[single-service=true,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-location=,protocol=]]", test.toString());
    }

    @Test
    public void ifNoNecessaryValuesSet_defaultToSingleService() {
        File in = new File(getClass().getClassLoader().getResource("test1.properties").getFile());
        PropertiesService test1 = new PropertiesService(in);
        assertEquals("AllProps=[single-service=true,insecure=true,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-location=,protocol=]]", test1.toString());
    }

    @Test
    public void ifSecuredSession_isEnabled_NeededPropsArePopulated() {
        File in = new File(getClass().getClassLoader().getResource("test2.properties").getFile());
        PropertiesService test2 = new PropertiesService(in);
        assertEquals("AllProps=[single-service=false,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=https://localhost:8080,ssl-password=,keystore-location=," +
                "protocol=]]", test2.toString());
    }

    @Test
    public void ifSecuredSession_isDisabled_PropsArentPopulated() {
        File in = new File(getClass().getClassLoader().getResource("test3.properties").getFile());
        PropertiesService test3 = new PropertiesService(in);
        assertEquals("AllProps=[single-service=false,insecure=true,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-location=," +
                "protocol=]]", test3.toString());
    }

    @Test
    public void ifSSL_isEnabled_OtherPropsArePopulated() {
        File in = new File(getClass().getClassLoader().getResource("test4.properties").getFile());
        PropertiesService test4 = new PropertiesService(in);
        assertEquals("AllProps=[single-service=false,insecure=false,use-ssl=true," +
                "optional=[auth-service-url=https://localhost:8080/create_session," +
                "ssl-password=placeholder," +
                "keystore-location=example.jks," +
                "protocol=TLSv1.2]" +
                "]", test4.toString());
    }

    @Test
    public void ifSSL_isDisabled_OtherPropsAreOptional() {
        File in = new File(getClass().getClassLoader().getResource("test5.properties").getFile());
        PropertiesService test5 = new PropertiesService(in);
        assertEquals("AllProps=[single-service=true,insecure=false,use-ssl=false," +
                "optional=[auth-service-url=,ssl-password=,keystore-location=,protocol=]]", test5.toString());
    }



}