package uk.gov.gchq.gaffer.python.util;

import org.junit.Assert;
import org.junit.Test;

import static org.junit.Assert.*;

public class SessionCounterTest {

    private SessionCounter sessionCounter = SessionCounter.getInstance();


    @Test
    public void getInstance_ReturnsAnInstance() {
        SessionCounter session = SessionCounter.getInstance();
        Assert.assertEquals(sessionCounter, session);
    }

    @Test
    public void increment_IncrementsValues() {
        sessionCounter.increment();

        Assert.assertEquals(1, sessionCounter.getCounter());
    }

    @Test
    public void decrement_DecreasesCounterValue() {
        sessionCounter.decrement();
        assertEquals(0, sessionCounter.getCounter());
    }

    @Test
    public void decrement_DoesntDecreaseBelowZero() {
        sessionCounter.decrement();
        assertEquals(0, sessionCounter.getCounter());
    }

}