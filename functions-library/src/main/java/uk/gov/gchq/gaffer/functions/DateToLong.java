package uk.gov.gchq.gaffer.functions;

import uk.gov.gchq.gaffer.types.FreqMap;
import uk.gov.gchq.koryphe.function.KorypheFunction;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateToLong extends KorypheFunction<String, Long> {

    private String format;

    public DateToLong(){}

    public DateToLong(String format){
        setFormat(format);
    }

    @Override
    public Long apply(String s) {
        Date date = null;
        try {
            date = new SimpleDateFormat(format).parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date.getTime();
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
