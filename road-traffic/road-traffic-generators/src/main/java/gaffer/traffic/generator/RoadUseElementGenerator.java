/*
 * Copyright 2016 Crown Copyright
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

package gaffer.traffic.generator;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import gaffer.data.element.Edge;
import gaffer.data.element.Element;
import gaffer.data.element.Entity;
import gaffer.data.generator.OneToManyElementGenerator;
import gaffer.traffic.ElementGroup;
import gaffer.types.simple.FreqMap;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

public class RoadUseElementGenerator extends OneToManyElementGenerator<String> {


    @Override
    public Iterable<Element> getElements(final String line) {
        // Check if the line is a header
        if (line.startsWith("\"Region Name (GO)\",")) {
            return Collections.emptyList();
        }

        final String[] fields = extractFields(line);
        if (null == fields) {
            return Collections.emptyList();
        }

        // Extract required fields
        final FreqMap vehicleCountsByType = getVehicleCounts(fields);
        final Date date = getDate(fields[Field.dCount.index()], fields[Field.Hour.index()]);
        final Date endTime = null != date ? DateUtils.addHours(date, 1) : null;
        final String region = fields[Field.Region_Name.index()];
        final String location = fields[Field.ONS_LA_Name.index()];
        final String road = fields[Field.Road.index()];
        final String junctionA = road + ":" + fields[Field.A_Junction.index()];
        final String junctionB = road + ":" + fields[Field.B_Junction.index()];
        final String junctionALocation = fields[Field.A_Ref_E.index()] + "," + fields[Field.A_Ref_N.index()];
        final String junctionBLocation = fields[Field.B_Ref_E.index()] + "," + fields[Field.B_Ref_N.index()];

        // Create elements
        final Collection<Element> elements = new ArrayList<>(9);

        elements.add(new Edge.Builder()
                        .group(ElementGroup.REGION_CONTAINS_LOCATION)
                        .source(region)
                        .dest(location)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.LOCATION_CONTAINS_ROAD)
                        .source(location)
                        .dest(road)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.ROAD_HAS_JUNCTION)
                        .source(road)
                        .dest(junctionA)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.ROAD_HAS_JUNCTION)
                        .source(road)
                        .dest(junctionB)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.JUNCTION_LOCATED_AT)
                        .source(junctionA)
                        .dest(junctionALocation)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.JUNCTION_LOCATED_AT)
                        .source(junctionB)
                        .dest(junctionBLocation)
                        .directed(true)
                        .build()
        );

        elements.add(new Edge.Builder()
                        .group(ElementGroup.ROAD_USE)
                        .source(junctionA)
                        .dest(junctionB)
                        .directed(true)
                        .property("startTime", date)
                        .property("endTime", endTime)
                        .property("totalCount", getTotalCount(vehicleCountsByType))
                        .property("countByVehicleType", vehicleCountsByType)
                        .build()
        );

        elements.add(new Entity.Builder()
                        .group(ElementGroup.JUNCTION_USE)
                        .vertex(junctionA)
                        .property("trafficByType", vehicleCountsByType)
                        .property("endTime", endTime)
                        .property("startTime", date)
                        .property("totalCount", getTotalCount(vehicleCountsByType))
                        .build()
        );

        elements.add(new Entity.Builder()
                        .group(ElementGroup.JUNCTION_USE)
                        .vertex(junctionB)
                        .property("trafficByType", vehicleCountsByType)
                        .property("endTime", endTime)
                        .property("startTime", date)
                        .property("totalCount", getTotalCount(vehicleCountsByType))
                        .build()
        );

        return elements;
    }

    @Override
    public Iterable<String> getObjects(final Iterable<Element> elements) {
        throw new UnsupportedOperationException("This generator cannot be used to map the elements back into csv");
    }

    private FreqMap getVehicleCounts(final String[] fields) {
        final FreqMap freqMap = new FreqMap();
        for (final Field fieldName : Field.VEHICLE_COUNTS) {
            freqMap.upsert(fieldName.name(), Long.parseLong(fields[fieldName.index()]));
        }
        return freqMap;
    }

    private long getTotalCount(final FreqMap freqmap) {
        long sum = 0;
        for (final Long count : freqmap.values()) {
            sum += count;
        }

        return sum;
    }

    private Date getDate(final String dCountString, final String hour) {
        Date dCount = null;
        try {
            dCount = new SimpleDateFormat("dd/MM/yyyy HH:mm").parse(dCountString);
        } catch (ParseException e) {
            // incorrect date format
        }

        if (null == dCount) {
            try {
                dCount = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dCountString);
            } catch (ParseException e) {
                // another incorrect date format
            }
        }

        if (null == dCount) {
            return null;
        }

        return DateUtils.addHours(dCount, Integer.parseInt(hour));
    }

    @SuppressFBWarnings(value = "PZLA_PREFER_ZERO_LENGTH_ARRAYS", justification = "private method and the null result is handled properly")
    private String[] extractFields(final String line) {
        final String trimStart = StringUtils.removeStart(line, "\"");
        final String trimEnd = StringUtils.removeEnd(trimStart, "\"");
        final String[] fields = trimEnd.split("\",\"");
        if (fields.length != Field.values().length) {
            return null;
        }
        return fields;
    }

    private enum Field {
        Region_Name,
        ONS_LACode,
        ONS_LA_Name,
        CP,
        S_Ref_E,
        S_Ref_N,
        Road,
        A_Junction,
        A_Ref_E,
        A_Ref_N,
        B_Junction,
        B_Ref_E,
        B_Ref_N,
        RCate,
        iDir,
        Year,
        dCount,
        Hour,
        PC,
        WMV2,
        CAR,
        BUS,
        LGV,
        HGVR2,
        HGVR3,
        HGVR4,
        HGVA3,
        HGVA5,
        HGVA6,
        HGV,
        AMV;

        public static final Field[] VEHICLE_COUNTS = {PC, WMV2, CAR, BUS, LGV, HGVR2, HGVR3, HGVR4, HGVA3, HGVA5, HGVA6, HGV, AMV};

        public int index() {
            return ordinal();
        }
    }
}
