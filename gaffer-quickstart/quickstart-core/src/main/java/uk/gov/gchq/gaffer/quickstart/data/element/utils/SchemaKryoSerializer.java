package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.Serializer;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import uk.gov.gchq.gaffer.store.schema.Schema;

public class SchemaKryoSerializer extends Serializer<Schema> {

    @Override
    public void write(Kryo kryo, Output output, Schema schema) {
        final byte[] serialised = schema.toCompactJson();
        output.writeInt(serialised.length);
        output.writeBytes(serialised);
    }

    @Override
    public Schema read(Kryo kryo, Input input, Class<Schema> aClass) {
        final int serialisedLength = input.readInt();
        final byte[] serialisedBytes = input.readBytes(serialisedLength);
        return Schema.fromJson(serialisedBytes);
    }
}
