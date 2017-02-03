//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package uk.gov.gchq.gaffer.federated.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import java.util.Set;

public class TypeReferenceFederatedImpl {
    public TypeReferenceFederatedImpl() {
    }

    public static class SetString extends TypeReference<Set<String>> {
    }

    public static class Schema extends TypeReference<uk.gov.gchq.gaffer.federated.rest.dto.Schema> {
    }

    public static class SystemStatus extends TypeReference<FederatedSystemStatus> {
    }
}
