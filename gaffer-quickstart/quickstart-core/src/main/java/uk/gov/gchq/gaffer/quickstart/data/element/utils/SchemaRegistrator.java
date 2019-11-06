package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import com.esotericsoftware.kryo.Kryo;
import org.apache.spark.serializer.KryoRegistrator;
import org.objenesis.strategy.StdInstantiatorStrategy;
import uk.gov.gchq.gaffer.store.schema.Schema;

public class SchemaRegistrator implements KryoRegistrator {

    @Override
    public void registerClasses(Kryo kryo) {
        kryo.register(Schema.class, new SchemaKryoSerializer());
        kryo.setInstantiatorStrategy(new Kryo.DefaultInstantiatorStrategy(new StdInstantiatorStrategy()));
    }
}
