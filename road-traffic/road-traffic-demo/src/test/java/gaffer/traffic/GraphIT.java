package gaffer.traffic;

import gaffer.commonutil.StreamUtil;
import gaffer.graph.Graph;
import gaffer.operation.OperationChain;
import gaffer.operation.OperationException;
import gaffer.operation.impl.add.AddElements;
import gaffer.operation.impl.generate.GenerateElements;
import gaffer.traffic.generator.RoadUseElementGenerator;
import gaffer.user.User;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import java.io.IOException;
import java.io.InputStream;

public class GraphIT {
    @Test
    public void shouldBeAbleToAddAllSampleDataToGraph() throws IOException, OperationException {
        // Given
        final InputStream storeProps = StreamUtil.openStream(getClass(), "/mockaccumulo.properties", true);
        final InputStream[] schema = StreamUtil.schemas(ElementGroup.class);
        // When
        final Graph graph = new Graph.Builder()
                .storeProperties(storeProps)
                .addSchemas(schema)
                .build();

        final OperationChain<Void> populateChain = new OperationChain.Builder()
                .first(new GenerateElements.Builder<String>()
                        .objects(IOUtils.readLines(StreamUtil.openStream(GraphIT.class, "sampleData.csv")))
                        .generator(new RoadUseElementGenerator())
                        .build())
                .then(new AddElements.Builder()
                        .skipInvalidElements(false)
                        .build())
                .build();

        graph.execute(populateChain, new User());

        // Then - no exceptions thrown
    }
}
