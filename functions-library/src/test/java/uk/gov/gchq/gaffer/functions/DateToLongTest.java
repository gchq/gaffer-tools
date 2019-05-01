package uk.gov.gchq.gaffer.functions;

import org.junit.Test;

public class DateToLongTest {

    @Test
    public void testDateToLong(){
        String format = "yyyy-MM-dd HH:mm:ss.SSS";

        String test = "2009-04-27 18:32:26.382";

        DateToLong dateToLong = new DateToLong();
        dateToLong.setFormat(format);

        System.out.println(dateToLong.apply(test));

    }
}
