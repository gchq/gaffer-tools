package gaffer.traffic;

import gaffer.commonutil.StreamUtil;
import gaffer.graph.Graph;
import org.junit.Test;
import java.io.IOException;
import java.io.InputStream;

public class SchemaIT {
    @Test
    public void shouldCreateGraphWithSchemaAndProperties() throws IOException {
        // Given
        final InputStream storeProps = StreamUtil.openStream(getClass(), "/mockaccumulo.properties", true);
        final InputStream[] schema = StreamUtil.schemas(ElementGroup.class);

        // When
        new Graph.Builder()
                .storeProperties(storeProps)
                .addSchemas(schema)
                .build();

        // Then - no exceptions thrown
    }
}
