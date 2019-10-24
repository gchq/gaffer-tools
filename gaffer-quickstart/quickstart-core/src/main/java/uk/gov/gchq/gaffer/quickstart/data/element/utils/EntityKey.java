package uk.gov.gchq.gaffer.quickstart.data.element.utils;

import org.apache.commons.lang3.builder.HashCodeBuilder;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.data.element.Properties;

public class EntityKey implements ElementKey{

    private Object vertex;
    private String group;
    private Properties groupByProperties;

    public EntityKey(){
    }

    @Override
    public boolean equals(Object key2) {

        if(key2 instanceof EntityKey){
            if(
                    this.getGroup().equals(((EntityKey) key2).getGroup()) &&
                    this.getVertex().equals(((EntityKey) key2).getVertex()) &&
                    this.getGroupByProperties().equals(((EntityKey) key2).getGroupByProperties())
            ) {
                return true;
            }
        }
        return false;
    }

    public Object getVertex() {
        return vertex;
    }

    public void setVertex(Object vertex) {
        this.vertex = vertex;
    }

    @Override
    public String toString() {
        return "EntityKey{" +
                "vertex=" + vertex +
                ", group=" + getGroup() +
                ", groupByProperties=" + getGroupByProperties() +
                '}';
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(getGroup())
                .append(getGroupByProperties())
                .append(getVertex())
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
