/*
 * Copyright 2016-2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package uk.gov.gchq.gaffer.quickstart.operation.handler.job;

import com.clearspring.analytics.stream.cardinality.HyperLogLogPlus;
import uk.gov.gchq.gaffer.commonutil.CommonTimeUtil;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;
import uk.gov.gchq.gaffer.time.RBMBackedTimestampSet;

import java.time.Instant;
import java.util.ArrayList;

public class JavaElementGenerator implements OneToManyElementGenerator<String> {


    @Override
    public Iterable<Element> _apply(String s) {
        ArrayList<Element> elements = new ArrayList<>(3);

        String[] t = s.split(",");

        String src = t[0];
        String dest = t[1];
        String time = t[2];
        Long longTime = Long.valueOf(time)*1000L;

        RBMBackedTimestampSet timestampSet = new RBMBackedTimestampSet(CommonTimeUtil.TimeBucket.SECOND);
        timestampSet.add(Instant.ofEpochMilli(longTime));

        Long timeBucket = CommonTimeUtil.timeToBucket(longTime, CommonTimeUtil.TimeBucket.HOUR);

        HyperLogLogPlus inHllp = new HyperLogLogPlus(5,5);
        HyperLogLogPlus outHllp = new HyperLogLogPlus(5,5);
        inHllp.offer(src);
        outHllp.offer(dest);

        Edge edge = new Edge.Builder()
                .group("Event")
                .source(src)
                .dest(dest)
                .directed(true)
                .property("count", new Long(1))
                .property("timebucket", timeBucket)
                .property("timestamps", timestampSet)
                .build();

        Entity srcEntity = new Entity.Builder()
                .group("Emitter")
                .vertex(src)
                .property("count", new Long(1))
                .property("timebucket", timeBucket)
                .property("timestamps", timestampSet)
                .property("messagesReceivedEstimate", new HyperLogLogPlus(5,5))
                .property("messagesSentEstimate", outHllp)
                .build();

        Entity destEntity = new Entity.Builder()
                .group("Emitter")
                .vertex(dest)
                .property("count", new Long(1))
                .property("timebucket", timeBucket)
                .property("timestamps", timestampSet)
                .property("messagesReceivedEstimate", inHllp)
                .property("messagesSentEstimate", new HyperLogLogPlus(5,5))
                .build();

        elements.add(edge);
        elements.add(srcEntity);
        elements.add(destEntity);

        return elements;
    }
}
