package uk.gov.gchq.gaffer.functions;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DateToLongTest {

    @Test
    public void testDateToLong(){

        String format = "yyyy-MM-dd HH:mm:ss.SSS";

        String test = "2009-04-27 18:32:26.382";

        Long answer = 1240853546382L;

        DateToLong dateToLong = new DateToLong();
        dateToLong.setFormat(format);

        assertEquals(answer, dateToLong.apply(test));

    }
}
