package uk.gov.gchq.gaffer.quickstart.data.element.function;


import org.apache.spark.api.java.function.Function;
import scala.Tuple2;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.EdgeKey;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.ElementKey;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.ElementValue;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.EntityKey;

public class ElementMapper implements Function<Tuple2<ElementKey, ElementValue>, Element> {
    @Override
    public Element call(Tuple2<ElementKey, ElementValue> elementKeyElementValueTuple2) throws Exception {

        Properties properties = new Properties();
        properties.putAll(elementKeyElementValueTuple2._2().getProperties());

        System.out.println(elementKeyElementValueTuple2._1());

        if(elementKeyElementValueTuple2._1() instanceof EdgeKey){

            EdgeKey key = (EdgeKey) elementKeyElementValueTuple2._1();
            Edge edge = new Edge.Builder()
                    .source(key.getSource())
                    .dest(key.getDestination())
                    .directed(key.isDirected())
                    .group(key.getGroup())
                    .build();

            properties.putAll(key.getGroupByProperties());
            edge.copyProperties(properties);

            return edge;

        }else if(elementKeyElementValueTuple2._1() instanceof EntityKey){

            EntityKey key = (EntityKey) elementKeyElementValueTuple2._1();
            Entity entity = new Entity.Builder()
                    .vertex(key.getVertex())
                    .group(key.getGroup())
                    .build();
            properties.putAll(key.getGroupByProperties());
            entity.copyProperties(properties);

            return entity;

        }

        return null;
    }
}
