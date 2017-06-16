package uk.gov.gchq.gaffer.ui;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * UI system test. Runs a simple query for road use around junction M5:10.
 * Assumes the Road Traffic Demo UI is running at localhost:8080.
 * To run this selenium test you must have installed the gecko driver, see
 * https://github.com/mozilla/geckodriver/releases
 * This test can be run via the main method or as a junit test:
 * <pre>
 * mvn -Dit.test=QueryBuilderST verify -Dwebdriver.gecko.driver=/path/to/geckodriver -pl ui/
 * </pre>
 */
public class QueryBuilderST {
    private static final int SLOW_FACTOR = 1;
    private static final String URL = "http://localhost:8080/ui";
    private static final String EXPECTED_RESULTS[] = {
            "\"group\": \"RoadUse\",\n" +
                    "    \"source\": \"M5:10\",\n" +
                    "    \"destination\": \"M5:9\",\n" +
                    "    \"directed\": true,\n" +
                    "    \"class\": \"uk.gov.gchq.gaffer.data.element.Edge\"\n",
            "\"group\": \"RoadUse\",\n" +
                    "    \"source\": \"M5:11\",\n" +
                    "    \"destination\": \"M5:10\",\n" +
                    "    \"directed\": true,\n" +
                    "    \"class\": \"uk.gov.gchq.gaffer.data.element.Edge\"\n"
    };
    public static final String GECKO_SYS_PROPERTY = "webdriver.gecko.driver";

    private WebDriver driver;

    public static void main(String[] args) throws Exception {
        final QueryBuilderST test = new QueryBuilderST();
        if (args.length < 1) {
            System.out.println("Usage: <path to gecko driver>");
            System.exit(1);
        }

        System.setProperty(GECKO_SYS_PROPERTY, args[0]);
        test.setup();
        try {
            test.shouldFindRoadUseAroundJunctionM5_10();
        } finally {
            test.cleanUp();
        }
    }

    @Before
    public void setup() {
        assertNotNull("System property " + GECKO_SYS_PROPERTY + " has not been set", System.getProperty(GECKO_SYS_PROPERTY));
        driver = new FirefoxDriver();
    }

    @After
    public void cleanUp() {
        try {
            driver.close();
        } catch (final Exception e) {
            // ignore errors
        }
    }

    @Test
    public void shouldFindRoadUseAroundJunctionM5_10() throws InterruptedException {
        // Go to the Google Suggest home page
        driver.get(URL);

        Thread.sleep(SLOW_FACTOR * 1000);

        // Enter the query string "Cheese"
        click("add-seed");

        selectOption("vertexType", "junction");
        enterText("vertex", "M5:10");
        click("add-seed-confirm");

        click("build-query");
        click("select-all-seeds");
        click("step-1-next");

        click("related-edge-RoadUse");
        click("step-2-next");

        click("RoadUse-add-filter");
        selectOption("RoadUse-property-selector", "startDate");
        selectOption("RoadUse-startDate-predicate-selector", "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan");
        enterText("RoadUse-startDate-uk.gov.gchq.koryphe.impl.predicate.IsMoreThan-value", "{\"java.util.Date\": 971416800000}");
        click("step-3-next");

        click("step-4-execute");

        click("open-raw");
        clickTab("Results");

        // And now list the suggestions
        final String results = getElement("raw-edge-results").getText().trim();
        for (String expectedResult : EXPECTED_RESULTS) {
            assertTrue("Results did not contain: \n" + expectedResult
                    + "\nActual results: \n" + results, results.contains(expectedResult));
        }
    }

    private void enterText(final String id, final String value) {
        getElement(id).sendKeys(value);
    }

    private void selectOption(final String id, final String optionValue) throws InterruptedException {
        Select dropdown = new Select(getElement(id));
        dropdown.selectByValue("string:" + optionValue);
        Thread.sleep(SLOW_FACTOR * 500);
    }

    private void click(final String id) throws InterruptedException {
        getElement(id).click();
        Thread.sleep(SLOW_FACTOR * 500);
    }

    private void clickTab(final String tabTitle) {
        driver.findElement(By.xpath("//md-tab-item//span[contains(text(), '" + tabTitle + "')]")).click();
    }

    private WebElement getElement(final String id) {
        try {
            return driver.findElement(By.id(id));
        } catch (final Exception e) {
            // ignore error
        }

        try {
            return driver.findElement(By.className(id));
        } catch (final Exception e) {
            // ignore error
        }

        // try using the id as a tag name
        return driver.findElement(By.tagName(id));
    }
}