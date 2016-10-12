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
    private String[] fieldNames = {
            //"field_name",position
            "Region_Name", //0
            "ONS_LACode", //1
            "ONS_LA_Name", //2
            "CP", //3
            "S_Ref_E", //4
            "S_Ref_N", //5
            "Road", //6
            "A_Junction", //7
            "A_Ref_E", //8
            "A_Ref_N", //9
            "B_Junction", //10
            "B_Ref_E", //11
            "B_Ref_N", //12
            "RCate", //13
            "iDir", //14
            "Year", //15
            "dCount", //16
            "Hour", //17
            "PC", //18
            "WMV2", //19
            "CAR", //20
            "BUS", //21
            "LGV", //22
            "HGVR2", //23
            "HGVR3", //24
            "HGVR4", //25
            "HGVA3", //26
            "HGVA5", //27
            "HGVA6", //28
            "HGV", //29
            "AMV" //30
    };

    @Override
    public Iterable<Element> getElements(final String line) {
        if (line.startsWith("\"Region Name (GO)\",")) {
            return Collections.emptyList();
        }

        final String[] fields = getFields(line);
        if (null == fields) {
            return Collections.emptyList();
        }

        final FreqMap vehicleCountsByType = getFreqMap(fields);
        final Date date = getDate(fields[16], fields[17]);
        final Date endTime = DateUtils.addHours(date, 1);
        final String region = fields[0];
        final String location = fields[2];
        final String road = fields[6];
        final String junctionA = road + ":" + fields[7];
        final String junctionB = road + ":" + fields[10];
        final String junctionALocation = fields[8] + "," + fields[9];
        final String junctionBLocation = fields[11] + "," + fields[12];

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

    private Date getDate(final String dCountString, final String hour) {
        Date dCount = null;
        try {
            dCount = new SimpleDateFormat("dd/MM/yyyy HH:mm").parse(dCountString);
        } catch (ParseException e) {
            //try the hyphens
        }

        if (null == dCount) {
            try {
                dCount = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dCountString);
            } catch (ParseException e) {
                //this one doesn't work either
            }
        }

        if (null == dCount) {
            return null;
        }

        return DateUtils.addHours(dCount, Integer.parseInt(hour));
    }

    @Override
    public Iterable<String> getObjects(final Iterable<Element> elements) {
        return null;
    }


    private FreqMap getFreqMap(final String[] fields) {
        final FreqMap freqMap = new FreqMap();
        for (int i = 18; i < fields.length; i++) {
            freqMap.upsert(fieldNames[i], Long.parseLong(fields[i]));
        }
        return freqMap;
    }

    private long getTotalCount(final FreqMap freqmap) {
        long sum = 0;
        for (Long count : freqmap.values()) {
            sum += count;
        }

        return sum;
    }

    @SuppressFBWarnings(value = "PZLA_PREFER_ZERO_LENGTH_ARRAYS", justification = "private method and the null result is handled properly")
    private String[] getFields(final String line) {
        final String trimStart = StringUtils.removeStart(line, "\"");
        final String trimEnd = StringUtils.removeEnd(trimStart, "\"");
        final String[] fields = trimEnd.split("\",\"");
        if (fields.length != fieldNames.length) {
            return null;
        }
        return fields;
    }
}
