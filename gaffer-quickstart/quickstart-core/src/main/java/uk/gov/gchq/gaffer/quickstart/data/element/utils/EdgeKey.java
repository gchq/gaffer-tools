package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Properties;

public class EdgeKey implements ElementKey {

    private Object source;
    private Object destination;
    private boolean isDirected;
    private String group;
    private Properties groupByProperties;

    public EdgeKey(){
    }

    @Override
    public boolean equals(Object key) {

        if(key instanceof EdgeKey){
            EdgeKey edgeKey2 = (EdgeKey) key;
            if(
                    this.getSource().equals(edgeKey2.getSource()) &&
                    this.getDestination().equals(edgeKey2.getDestination()) &&
                    this.getGroup().equals(edgeKey2.getGroup()) &&
                    this.isDirected == edgeKey2.isDirected &&
                    this.getGroupByProperties().equals(edgeKey2.getGroupByProperties())

            ){
                return true;
            }
        }
        return false;
    }


    public Object getSource() {
        return source;
    }

    public void setSource(Object source) {
        this.source = source;
    }

    public Object getDestination() {
        return destination;
    }

    public void setDestination(Object destination) {
        this.destination = destination;
    }

    public boolean isDirected() {
        return isDirected;
    }

    public void setDirected(boolean directed) {
        isDirected = directed;
    }

    @Override
    public String toString() {
        return "EdgeKey{" +
                "source=" + source +
                ", destination=" + destination +
                ", isDirected=" + isDirected +
                ", group=" + getGroup() +
                ", groupByProperties=" + getGroupByProperties() +
                '}';
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(getGroup())
                .append(getGroupByProperties())
                .append(getSource())
                .append(getDestination())
                .append(isDirected)
                .toHashCode();
    }


    @Override
    public String getGroup() {
        return group;
    }

    @Override
    public void setGroup(String group) {
        this.group = group;
    }

    @Override
    public Properties getGroupByProperties() {
        return groupByProperties;
    }

    @Override
    public void setGroupByProperties(Properties groupByProperties) {
        this.groupByProperties = groupByProperties;
    }
}
