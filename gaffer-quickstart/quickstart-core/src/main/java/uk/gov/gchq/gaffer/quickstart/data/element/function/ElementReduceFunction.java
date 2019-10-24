package uk.gov.gchq.gaffer.quickstart.data.element.function;

import org.apache.spark.api.java.function.Function2;
import uk.gov.gchq.gaffer.data.element.Properties;
import uk.gov.gchq.gaffer.data.element.function.ElementAggregator;
import uk.gov.gchq.gaffer.exception.SerialisationException;
import uk.gov.gchq.gaffer.jsonserialisation.JSONSerialiser;
import uk.gov.gchq.gaffer.quickstart.data.element.utils.ElementValue;
import uk.gov.gchq.gaffer.store.schema.Schema;
import uk.gov.gchq.gaffer.store.schema.SchemaElementDefinition;

public class ElementReduceFunction implements Function2<ElementValue, ElementValue, ElementValue> {

    private String schemaJson;

    public ElementReduceFunction(){}

    public ElementReduceFunction(String schemaJson) {
        this.schemaJson = schemaJson;
    }

    @Override
    public ElementValue call(ElementValue elementValue, ElementValue elementValue1){

        Schema schema = null;
        try {
            schema = JSONSerialiser.deserialise(schemaJson, Schema.class);
        } catch (final SerialisationException e) {
            throw new IllegalStateException(e.getMessage());
        }

        SchemaElementDefinition elementDef = schema.getElement(elementValue.getGroup());
        Properties state;
        final ElementAggregator aggregator = elementDef.getIngestAggregator();
        state = elementValue.getProperties();
        state = aggregator.apply(state, elementValue1.getProperties());
        ElementValue result = new ElementValue();
        result.setGroup(elementValue.getGroup());
        result.setProperties(state);
        return result;

    }
}

