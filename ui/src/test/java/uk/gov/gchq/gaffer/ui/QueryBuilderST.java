package uk.gov.gchq.gaffer.ui;

import com.google.common.collect.Maps;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;

import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.named.operation.AddNamedOperation;
import uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation;
import uk.gov.gchq.gaffer.named.operation.ParameterDetail;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.proxystore.ProxyStore;
import uk.gov.gchq.gaffer.user.User;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
            "  \"includeIncomingOutGoing\": \"EITHER\",\n" +
            "  \"options\": {}\n" +
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

    private static WebDriver driver;
    private static String url;
    private static int slowFactor;

    @BeforeClass
    public static void beforeClass() throws OperationException {
        assertNotNull("System property " + GECKO_PROPERTY + " has not been set", System.getProperty(GECKO_PROPERTY));
        url = System.getProperty(URL_PROPERTY, DEFAULT_URL);
        slowFactor = Integer.parseInt(System.getProperty(SLOW_FACTOR_PROPERTY, DEFAULT_SLOW_FACTOR));

        FirefoxProfile profile = new FirefoxProfile();
        profile.setPreference("intl.accept_languages", "en-GB"); // for dates
        driver = new FirefoxDriver(profile);


        // Create a large window to ensure we don't need to scroll
        final Dimension dimension = new Dimension(1200, 1000);
        driver.manage().window().setSize(dimension);
        addNamedOperation();
    }

    @AfterClass
    public static void afterClass() {
        try {
            driver.close();
            deleteNamedOperation();
        } catch (final Exception e) {
            // ignore errors
        }
    }

    @Before
    public void before() throws InterruptedException {
        driver.get(url);
        Thread.sleep(slowFactor * 1000);
    }

    @Test
    public void shouldFindRoadUseAroundJunctionM5_10() throws InterruptedException {
        selectOptionWithAriaLabel("operation-name", "Get Elements");
        enterText("seedVertices", "M5:10");
        click("create-custom-filter");
        selectMultiOption("view-edges", "RoadUse");
        click("add-RoadUse-filters");
        selectOption("property-selector", "startDate");
        autoComplete("predicate-autocomplete", "ismore");
        enterText("value-", "971416800000");
        click("before-aggregation");
        click("submit");
        click("Execute Query");

        click("open-raw");
        assertEquals(EXPECTED_OPERATION_JSON, getElement("operation-0-json").getText().trim());

        clickTab("Results");
        final String results = getElement("raw-edge-results").getText().trim();
        for (final String expectedResult : EXPECTED_RESULTS) {
            assertTrue("Results did not contain: \n" + expectedResult
                    + "\nActual results: \n" + results, results.contains(expectedResult));
        }
    }

    @Test
    public void shouldNotThrowErrorIfPageIsReloadedWithCustomView() throws InterruptedException, SerialisationException {
        selectOptionWithAriaLabel("operation-name", "Get Elements");
        enterText("seedVertices", "M5");
        click("create-custom-filter");
        selectMultiOption("view-entities", "Cardinality");
        click("open-table");
        click("open-query");
        click("Execute Query");
        click("open-raw");
        clickTab("Results");
        String result = getElement("raw-entity-results").getText().trim();
        JSONSerialiser json = JSONSerialiser.getInstance();
        List results = json.deserialise(result, List.class);
        assertEquals(1, results.size());
    }

    @Test
    public void shouldFindRoadUseAroundJunctionM5_10WithDatePicker() throws InterruptedException {
        selectOptionWithAriaLabel("operation-name", "Get Elements");
        enterText("seedVertices", "M5:10");
        enterIntoDatePicker("start-date", "13/10/2000");
        click("create-custom-filter");
        selectMultiOption("view-edges", "RoadUse");
        click("Execute Query");

        click("open-raw");
        clickTab("Results");
        final String results = getElement("raw-edge-results").getText().trim();
        for (final String expectedResult : EXPECTED_RESULTS) {
            assertTrue("Results did not contain: \n" + expectedResult
                    + "\nActual results: \n" + results, results.contains(expectedResult));
        }
    }

    @Test
    public void shouldBeAbleToDeleteFiltersOnceCreated() throws InterruptedException {
        // given
        selectOptionWithAriaLabel("operation-name", "Get Elements");
        click("create-custom-filter");
        selectMultiOption("view-entities", "Cardinality");
        click("add-Cardinality-filters");
        selectOption("property-selector", "hllp");
        autoComplete("predicate-autocomplete", "exists");
        click("add-another");
        selectOption("property-selector", "hllp");
        autoComplete("predicate-autocomplete", "islessthan");
        enterText("value-", "20");
        click("submit");

        // when
        click("delete-entity-Cardinality-filter-0");
        click("delete-entity-Cardinality-filter-0");
        click("Execute Query");
        click("open-raw");

        // then
        String expectedString = "" +
                "  \"view\": {\n" +
                "    \"globalElements\": [\n" +
                "      {\n" +
                "        \"groupBy\": []\n" +
                "      }\n" +
                "    ],\n" +
                "    \"entities\": {\n" +
                "      \"Cardinality\": {}\n" +
                "    },\n" +
                "    \"edges\": {}\n";


        assert (getElement("operation-0-json").getText().trim().contains(expectedString));

    }

    @Test
    public void shouldBeAbleToRunParameterisedQueries() throws InterruptedException, SerialisationException {
        selectOptionWithAriaLabel("operation-name", "Two Hop With Limit");
        enterText("seedVertices", "M5");
        enterText("param1-", "2");
        click("Execute Query");

        click("open-raw");
        clickTab("Results");

        final String results = getElement("raw-other-results").getText().trim();
        final List resultList = JSONSerialiser.deserialise(results.getBytes(), ArrayList.class);

        final List<Map<String, Object>> expectedResults = Arrays.asList(new LinkedHashMap<>(), new LinkedHashMap<>());
        expectedResults.get(0).put("class", EntitySeed.class.getName());
        expectedResults.get(0).put("vertex", "352952,178032");
        expectedResults.get(1).put("class", EntitySeed.class.getName());
        expectedResults.get(1).put("vertex", "M5:18A");
        assertEquals(expectedResults, resultList);
    }

    private void enterText(final String id, final String value) {
        getElement(id).sendKeys(value);
    }

    private void autoComplete(final String id, final String input) throws InterruptedException {
        WebElement ac = driver.findElement(By.cssSelector("#" + id + " md-autocomplete-wrap md-input-container input"));
        ac.sendKeys(input);
        ac.sendKeys(Keys.ENTER);

        Thread.sleep(slowFactor * 500);
    }

    private void enterIntoDatePicker(final String id, final String date) throws InterruptedException {
        WebElement element = driver.findElement(By.xpath("//*[@id=\"" + id + "\"]//input"));
        element.sendKeys((date));

        Thread.sleep(slowFactor * 500);
    }

    private void selectOption(final String id, final String optionValue) throws InterruptedException {
        getElement(id).click();

        WebElement choice = driver.findElement(By.cssSelector("md-option[value = '" + optionValue + "']"));
        choice.click();

        Thread.sleep(slowFactor * 500);
    }

    private void selectMultiOption(final String id, final String... values) throws InterruptedException {
        getElement(id).click();
        WebElement choice = null;

        for (final String value : values) {
            choice = driver.findElement(By.cssSelector("md-option[value = '" + value + "']"));
            choice.click();
        }

        assertNotNull("You must provide at least one option", choice);

        choice.sendKeys(Keys.ESCAPE);

        Thread.sleep(slowFactor * 500);
    }

    private void selectOptionWithAriaLabel(final String id, final String label) throws InterruptedException {
        getElement(id).click();
        WebElement choice = driver.findElement(By.cssSelector("md-option[aria-label = '" + label + "']"));
        choice.click();

        Thread.sleep(slowFactor * 500);

    }

    private void click(final String id) throws InterruptedException {
        getElement(id).click();
        Thread.sleep(slowFactor * 500);
    }

    private void clickTab(final String tabTitle) {
        driver.findElement(By.xpath("//md-tab-item[contains(text(), '" + tabTitle + "')]")).click();
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

    private static void deleteNamedOperation() throws OperationException {
        Graph graph = new Graph.Builder()
                .store(new ProxyStore.Builder()
                        .graphId("graphId1")
                        .host("localhost")
                        .port(8080)
                        .connectTimeout(1000)
                        .contextRoot("rest")
                        .build())
                .build();

        graph.execute(new DeleteNamedOperation.Builder()
                .name("Two Hop With Limit")
                .build(), new User());
    }

    private static void addNamedOperation() throws OperationException {
        Graph graph = new Graph.Builder()
                .store(new ProxyStore.Builder()
                        .graphId("graphId1")
                        .host("localhost")
                        .port(8080)
                        .connectTimeout(1000)
                        .contextRoot("rest")
                        .build())
                .build();

        final String opChainString = "{" +
                "    \"operations\" : [ {" +
                "      \"class\" : \"uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds\"," +
                "      \"includeIncomingOutGoing\" : \"OUTGOING\"" +
                "    }, {" +
                "      \"class\" : \"uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds\"," +
                "      \"includeIncomingOutGoing\" : \"OUTGOING\"" +
                "    }, {" +
                "      \"class\" : \"uk.gov.gchq.gaffer.operation.impl.Limit\"," +
                "      \"resultLimit\" : \"${param1}\"" +
                "    }" +
                " ]" +
                "}";

        ParameterDetail param = new ParameterDetail.Builder()
                .defaultValue(1L)
                .description("Limit param")
                .valueClass(Long.class)
                .build();
        Map<String, ParameterDetail> paramMap = Maps.newHashMap();
        paramMap.put("param1", param);

        graph.execute(
                new AddNamedOperation.Builder()
                        .name("Two Hop With Limit")
                        .description("Two Adjacent Ids queries with customisable limit")
                        .operationChain(opChainString)
                        .parameters(paramMap)
                        .overwrite()
                        .build(),
                new User()
        );
    }
}
