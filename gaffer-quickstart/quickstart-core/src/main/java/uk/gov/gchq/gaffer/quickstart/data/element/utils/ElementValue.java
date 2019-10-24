package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Properties;

public class ElementValue {

    private String group;
    private Properties properties;

    public ElementValue(){}

    public ElementValue(Element element){
        setGroup(element.getGroup());
        setProperties(element.getProperties());
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public Properties getProperties() {
        return properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    @Override
    public String toString() {
        return "ElementValue{" +
                "group='" + group + '\'' +
                ", properties=" + properties +
                '}';
    }
}
