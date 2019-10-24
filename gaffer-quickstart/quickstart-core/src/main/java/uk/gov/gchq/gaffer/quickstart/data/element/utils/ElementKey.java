package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Properties;

public interface ElementKey {

    String getGroup();
    void setGroup(String group);
    Properties getGroupByProperties();
    void setGroupByProperties(Properties groupByProperties);

}
