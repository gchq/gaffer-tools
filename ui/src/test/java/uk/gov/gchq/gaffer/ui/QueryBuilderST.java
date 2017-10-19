package uk.gov.gchq.gaffer.ui;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * UI system test. Runs a simple query for road use around junction M5:10.
 * Assumes the Road Traffic Demo UI is running at localhost:8080.
 * To run this selenium test you must have installed the gecko driver, see
 * https://github.com/mozilla/geckodriver/releases
 * This test can be run via maven using the system-test profile
 * <pre>
 * mvn verify -Psystem-test -Dwebdriver.gecko.driver=/path/to/geckodriver -pl ui/
 * </pre>
 */
public class QueryBuilderST {
    public static final String GECKO_PROPERTY = "webdriver.gecko.driver";
    public static final String URL_PROPERTY = "gaffer.ui.test.url";
    public static final String SLOW_FACTOR_PROPERTY = "gaffer.ui.test.slow-factor";

    private static final String DEFAULT_URL = "http://localhost:8080/ui";
    private static final String DEFAULT_SLOW_FACTOR = "5";

    private static final String EXPECTED_OPERATION_JSON = "{\n" +
            "  \"class\": \"uk.gov.gchq.gaffer.operation.impl.get.GetElements\",\n" +
            "  \"input\": [\n" +
            "    {\n" +
            "      \"class\": \"uk.gov.gchq.gaffer.operation.data.EntitySeed\",\n" +
            "      \"vertex\": \"M5:10\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"view\": {\n" +
            "    \"globalElements\": [\n" +
            "      {\n" +
            "        \"groupBy\": []\n" +
            "      }\n" +
            "    ],\n" +
            "    \"entities\": {},\n" +
            "    \"edges\": {\n" +
            "      \"RoadUse\": {\n" +
            "        \"preAggregationFilterFunctions\": [\n" +
            "          {\n" +
            "            \"predicate\": {\n" +
            "              \"class\": \"uk.gov.gchq.koryphe.impl.predicate.IsMoreThan\",\n" +
            "              \"value\": {\n" +
            "                \"java.util.Date\": 971416800000\n" +
            "              }\n" +
            "            },\n" +
            "            \"selection\": [\n" +
            "              \"startDate\"\n" +
            "            ]\n" +
            "          }\n" +
            "        ]\n" +
            "      }\n" +
            "    }\n" +
            "  },\n" +
            "  \"includeIncomingOutGoing\": \"EITHER\"\n" +
            "}";
    private static final String EXPECTED_RESULTS[] = {
            "\"group\": \"RoadUse\",\n" +
                    "    \"source\": \"M5:10\",\n" +
                    "    \"destination\": \"M5:9\",\n" +
                    "    \"directed\": true,\n" +
                    "    \"matchedVertex\": \"SOURCE\"",
            "\"group\": \"RoadUse\",\n" +
                    "    \"source\": \"M5:11\",\n" +
                    "    \"destination\": \"M5:10\",\n" +
                    "    \"directed\": true,\n" +
                    "    \"matchedVertex\": \"DESTINATION\""
    };

    private WebDriver driver;
    private String url;
    private int slowFactor;

    @Before
    public void setup() {
        assertNotNull("System property " + GECKO_PROPERTY + " has not been set", System.getProperty(GECKO_PROPERTY));
        url = System.getProperty(URL_PROPERTY, DEFAULT_URL);
        slowFactor = Integer.parseInt(System.getProperty(SLOW_FACTOR_PROPERTY, DEFAULT_SLOW_FACTOR));
        driver = new FirefoxDriver();

        // Create a large window to ensure we don't need to scroll
        final Dimension dimension = new Dimension(1200, 1000);
//        driver.manage().window().setSize(dimension);
        driver.manage().window().maximize();
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
        driver.get(url);
        Thread.sleep(slowFactor * 1000);

        // Enter the query string "Cheese"
        click("add-seed");

        selectOption("vertexType", "junction");
        enterText("seedVertex", "M5:10");
        click("add-seeds");

        click("build-query");

        click("Get Elements");
        click("select-all-seeds");
        scrollQueryBuilder();
        click("related-edge-RoadUse");
        jsClick("RoadUse-add-pre-filter");
        selectOption("RoadUse-pre-property-selector", "startDate");
        selectOption("RoadUse-pre-startDate-predicate-selector", "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan");
        enterText("RoadUse-pre-startDate-uk.gov.gchq.koryphe.impl.predicate.IsMoreThan-value", "{\"java.util.Date\": 971416800000}");
        click("build-query-next");

        click("build-query-execute");

        click("open-raw");
        assertEquals(EXPECTED_OPERATION_JSON, getElement("operation-0-json").getText().trim());

        clickTab("Results");
        final String results = getElement("raw-edge-results").getText().trim();
        for (final String expectedResult : EXPECTED_RESULTS) {
            assertTrue("Results did not contain: \n" + expectedResult
                    + "\nActual results: \n" + results, results.contains(expectedResult));
        }
    }

    private void scrollQueryBuilder() {
        ((JavascriptExecutor) driver).executeScript("$('query-builder').parent()[0].scrollTop += 100");
    }

    private void enterText(final String id, final String value) {
        getElement(id).sendKeys(value);
    }

    private void selectOption(final String id, final String optionValue) throws InterruptedException {
//        Select dropdown = new Select(getElement(id));
//        dropdown.selectByValue("string:" + optionValue);
        getElement(id).click();

        WebElement choice = driver.findElement(By.cssSelector("md-option[value = '" + optionValue + "']"));
        choice.click();

        Thread.sleep(slowFactor * 500);
    }

    private void click(final String id) throws InterruptedException {
        getElement(id).click();
        Thread.sleep(slowFactor * 500);
    }

    private void scrollToElement(final String id) {
        // Will Fail CI
        WebElement element = driver.findElement(By.id(id));
        ((JavascriptExecutor) driver).executeScript("arguments[0].moveToElement(true);", element);
    }

    private void jsClick(final String id) {
        JavascriptExecutor jse = (JavascriptExecutor) driver;
        jse.executeScript("document.getElementById('" + id + "').click()");

    }

    private void clickTab(final String tabTitle) {
        driver.findElement(By.xpath("//md-tab-item[contains(text(), 'Results')]")).click();
    }

    private void execute(final String script) {
        ((JavascriptExecutor) driver).executeScript(script);
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