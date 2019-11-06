package uk.gov.gchq.gaffer.quickstart.data.element.function;

import org.apache.spark.api.java.function.PairFlatMapFunction;
import scala.Tuple2;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.*;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.schema.SchemaElementDefinition;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

public class ElementFlatMapFunction implements PairFlatMapFunction<Element, ElementKey, ElementValue>, Serializable {

    private String schemaJson;

    public ElementFlatMapFunction(){}

    public ElementFlatMapFunction(String schemaJson){
        this.schemaJson = schemaJson;
    }


    @Override
    public Iterator<Tuple2<ElementKey, ElementValue>> call(Element element) throws Exception {

        Schema schema = null;

        try {
            schema = JSONSerialiser.deserialise(schemaJson, Schema.class);
        } catch (final SerialisationException e) {
            throw new IllegalStateException(e.getMessage());
        }

        SchemaElementDefinition elementDef = schema.getElement(element.getGroup());
        Set<String> groupByPropertyNames = elementDef.getGroupBy();

        ElementValue value = new ElementValue();

        Properties groupByProperties = new Properties();
        Properties valueProperties = new Properties();

        for(String name : groupByPropertyNames){
            groupByProperties.put(name, element.getProperty(name));
        }

        for(String name : element.getProperties().keySet()){
            if(!groupByProperties.containsKey(name)){
                valueProperties.put(name, element.getProperty(name));
            }
        }

        value.setGroup(element.getGroup());
        value.setProperties(valueProperties);

        List<Tuple2<ElementKey, ElementValue>> tuples2s = new ArrayList<>();
            Tuple2<ElementKey, ElementValue> tuple2 = null;

            if (element instanceof Edge) {

                EdgeKey edgeKey = new EdgeKey();
                edgeKey.setGroup(element.getGroup());
                edgeKey.setSource(((Edge) element).getSource());
                edgeKey.setDestination(((Edge) element).getDestination());
                edgeKey.setDirected(((Edge) element).isDirected());
                edgeKey.setGroupByProperties(groupByProperties);

                tuple2 = new Tuple2(edgeKey, value);
                tuples2s.add(tuple2);

            } else if (element instanceof Entity) {

                EntityKey key = new EntityKey();
                key.setVertex(((Entity) element).getVertex());
                key.setGroup(element.getGroup());
                key.setGroupByProperties(groupByProperties);

                tuple2 = new Tuple2(key, value);

                tuples2s.add(tuple2);

            }

        return tuples2s.iterator();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
