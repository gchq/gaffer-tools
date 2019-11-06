package uk.gov.gchq.gaffer.quickstart.data.generator;

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import uk.gov.gchq.gaffer.commonutil.CommonTimeUtil;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;
import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.time.Instant;
import java.util.ArrayList;

public class ExampleElementGenerator implements OneToManyElementGenerator<String> {

    private String entityGroup = "Emitter";
    private String edgeGroup = "Event";
    private String countPropertyName = "count";
    private String timeBucketPropertyName = "timebucket";
    private String timestampsPropertyName = "timestamps";
    private String messagesReceivedEstimatePropertyName = "messagesReceivedEstimate";
    private String messagesSentEstimatePropertyName = "messagesSentEstimate";

    private Long count = 1L;
    private HyperLogLogPlus emptyHllp;

    public ExampleElementGenerator(){
        this.emptyHllp = new HyperLogLogPlus(5, 5);
    }

    @Override
    public Iterable<Element> _apply(String s) {

        ArrayList<Element> elements = new ArrayList<>(3);

        String[] t = s.split(",");
        String source = t[0];
        String dest = t[1];
        Long timestamp = Long.parseLong(t[2])*1000L;

        Long timeBucket = CommonTimeUtil.timeToBucket(timestamp, CommonTimeUtil.TimeBucket.HOUR);
        RBMBackedTimestampSet timestamps = new RBMBackedTimestampSet(CommonTimeUtil.TimeBucket.SECOND, Instant.ofEpochMilli(timestamp));

        HyperLogLogPlus source_sent_hllp = new HyperLogLogPlus(5, 5);
        HyperLogLogPlus dest_rcvd_hllp = new HyperLogLogPlus(5,5);

        source_sent_hllp.offer(dest);
        dest_rcvd_hllp.offer(source);

        Entity sourceEntity = new Entity.Builder()
                .vertex(source)
                .group(entityGroup)
                .property(countPropertyName, count)
                .property(timestampsPropertyName, timestamps)
                .property(timeBucketPropertyName, timeBucket)
                .property(messagesReceivedEstimatePropertyName, emptyHllp)
                .property(messagesSentEstimatePropertyName, source_sent_hllp)
                .build();

        elements.add(sourceEntity);

        Entity destEntity = new Entity.Builder()
                .group(entityGroup)
                .vertex(source)
                .property(countPropertyName, count)
                .property(timestampsPropertyName, timestamps)
                .property(timeBucketPropertyName, timeBucket)
                .property(messagesReceivedEstimatePropertyName, dest_rcvd_hllp)
                .property(messagesSentEstimatePropertyName, emptyHllp)
                .build();

        elements.add(destEntity);

        Edge edge = new Edge.Builder()
                .group(edgeGroup)
                .source(source)
                .dest(dest)
                .directed(true)
                .property(countPropertyName, count)
                .property(timestampsPropertyName, timestamps)
                .property(timeBucketPropertyName, timeBucket)
                .build();

        elements.add(edge);

        return elements;
    }
}
