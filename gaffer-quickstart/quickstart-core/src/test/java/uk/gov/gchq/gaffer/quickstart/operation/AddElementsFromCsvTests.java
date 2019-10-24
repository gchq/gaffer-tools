package uk.gov.gchq.gaffer.quickstart.operation;

import org.apache.commons.io.FileUtils;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.broadcast.Broadcast;
import org.junit.Test;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.graph.Graph;
import uk.gov.gchq.gaffer.graph.GraphConfig;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.operation.OperationException;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementFlatMapFunction;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementMapper;
import uk.gov.gchq.gaffer.quickstart.data.element.function.ElementReduceFunction;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.EdgeKey;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.ElementKey;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.ElementValue;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.EntityKey;
import uk.gov.gchq.gaffer.quickstart.data.generator.CsvElementGenerator;
import uk.gov.gchq.gaffer.spark.SparkContextUtil;
import uk.gov.gchq.gaffer.store.Context;
import uk.gov.gchq.gaffer.store.library.NoGraphLibrary;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.user.User;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

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
}
