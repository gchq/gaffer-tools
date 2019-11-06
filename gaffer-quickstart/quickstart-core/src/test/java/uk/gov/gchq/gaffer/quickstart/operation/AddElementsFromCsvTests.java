package uk.gov.gchq.gaffer.quickstart.operation;

import org.apache.commons.io.FileUtils;
import org.apache.spark.SparkConf;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;
import org.junit.Test;
import scala.Tuple2;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementFlatMapFunction;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementMapper;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementReduceFunction;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.*;
import uk.gov.gchq.gaffer.quickstart.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class AddElementsFromCsvTests {
    
    @Test
    public void testEdgeKeys(){
        
        EdgeKey key1 = new EdgeKey();
        EdgeKey key2 = new EdgeKey();
        
        String group = "Edge";
        String source = "source";
        String dest = "dest";
        boolean directed = true;
        
        Properties groupByProperties = new Properties();
        groupByProperties.put("timebucket", 1254192988);
        groupByProperties.put("gbp_2", "gbp_2");

        key1.setSource(source);
        key1.setGroup(group);
        key1.setDestination(dest);
        key1.setDirected(directed);
        key1.setGroupByProperties(groupByProperties);

        key2.setSource(source);
        key2.setGroup(group);
        key2.setDestination(dest);
        key2.setDirected(directed);
        key2.setGroupByProperties(groupByProperties);

        assertEquals(key1.hashCode(), key2.hashCode());

        assert(key1.equals(key2));
    }

    @Test
    public void testEntityKeys(){

        String vertex = "vertex";
        String group = "Entity";
        Properties groupByProperties = new Properties();
        groupByProperties.put("timebucket", 1254192988);
        groupByProperties.put("gbp_2", "gbp_2");

        EntityKey key1 = new EntityKey();
        EntityKey key2 = new EntityKey();
        
        key1.setGroup(group);
        key1.setVertex(vertex);
        key1.setGroupByProperties(groupByProperties);

        key2.setGroup(group);
        key2.setVertex(vertex);
        key2.setGroupByProperties(groupByProperties);

        assertEquals(key1.hashCode(), key2.hashCode());

        assert(key1.equals(key2));
    }

    @Test
    public void schemaSerializerTest(){

    }

    @Test
    public void testTheLot() throws OperationException, SerialisationException {

        String dataPath = "src/test/resources/sample-data.csv";
        String schemaPath = "src/test/resources/schema.json";
        String graphConfigPath = "src/test/resources/graphconfig.json";
        String storePropsPath = "src/test/resources/mock.accumulo.store.properties";
        String generatorPath = "src/test/resources/element-generator.json";

        Graph graph = null;
        try {
            graph = new Graph.Builder()
                    .addSchema(new FileInputStream(new File(schemaPath)))
                    .config(new FileInputStream(new File(graphConfigPath)))
                    .storeProperties(new FileInputStream(new File(storePropsPath)))
                    .build();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        Schema schema = graph.getSchema();

        User user = new User.Builder()
                .userId("user")
                .build();

        Context context = SparkContextUtil.createContext(user, graph.getStoreProperties());

        SparkContext sc = SparkContextUtil.getSparkSession(context, graph.getStoreProperties()).sparkContext();

        JavaSparkContext jsc = JavaSparkContext.fromSparkContext(sc);

        CsvElementGenerator csvElementGenerator = null;
        try {
            csvElementGenerator = JSONSerialiser.deserialise(
                    FileUtils.openInputStream(new File(generatorPath)),
                    CsvElementGenerator.class
            );
        } catch (final IOException e) {
            e.printStackTrace();
        }

        String schemaJson = new String(JSONSerialiser.serialise(schema));


        Broadcast<CsvElementGenerator> generatorBroadcast = jsc.broadcast(csvElementGenerator);
        Broadcast<ElementReduceFunction> elementReduceFunctionBroadcast = jsc.broadcast(new ElementReduceFunction(schemaJson));
        Broadcast<ElementFlatMapFunction> elementFlatMapFunctionBroadcast = jsc.broadcast(new ElementFlatMapFunction(schemaJson));

        JavaRDD<Element> rdd =
                jsc.textFile(dataPath, 5)
                        .flatMap(s -> generatorBroadcast.getValue()._apply(s).iterator())
                        .flatMapToPair(elementFlatMapFunctionBroadcast.getValue())
                        .reduceByKey(elementReduceFunctionBroadcast.getValue())
                        .map(new ElementMapper());



    }
}
