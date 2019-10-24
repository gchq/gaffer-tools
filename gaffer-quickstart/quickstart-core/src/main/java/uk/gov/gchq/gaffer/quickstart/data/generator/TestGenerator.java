package uk.gov.gchq.gaffer.quickstart.data.generator;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.generator.OneToManyElementGenerator;

public class TestGenerator implements OneToManyElementGenerator<String> {
    @Override
    public Iterable<? extends Element> apply(Iterable<? extends String> domainObjects) {
        return null;
    }

    @Override
    public Iterable<Element> _apply(String s) {
        return null;
    }
}
