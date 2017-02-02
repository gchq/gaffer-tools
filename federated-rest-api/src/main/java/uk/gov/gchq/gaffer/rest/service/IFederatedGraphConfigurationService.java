//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package uk.gov.gchq.gaffer.rest.service;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import uk.gov.gchq.gaffer.rest.dto.FederatedSystemStatus;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.store.schema.Schema;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import java.util.List;
import java.util.Set;

@Path("/graph")
@Produces({"application/json"})
@Api(
        value = "/graph",
        description = "Methods to get graph configuration information."
)
public interface IFederatedGraphConfigurationService {
    String SCHEMA_PATH = "schema";
    String FILTER_FUNCTIONS_PATH = "filterFunctions";
    String TRANSFORM_FUNCTIONS_PATH = "transformFunctions";
    String GENERATORS_PATH = "generators";
    String OPERATIONS_PATH = "operations";
    String STORE_TRAITS_PATH = "storeTraits";
    String IS_OPERATION_SUPPORTED_PATH = "isOperationSupported";
    String SERIALISED_FIELDS_PATH = "serialisedFields";

    @PUT
    @Path("/urls")
    @ApiOperation(
            value = "Adds a new Gaffer URL to delegate " + OPERATIONS_PATH + " to"
    )
    void addUrl(@ApiParam("The name of the new url") @QueryParam("name") final String name,
                @ApiParam("A new url to add") @QueryParam("url") final String url);

    @POST
    @Path("/urls/refresh")
    @ApiOperation(
            value = "Updates the cache containing the " + SCHEMA_PATH + "s fetched from the URLs",
            response = FederatedSystemStatus.class,
            responseContainer = "List"
    )
    List<FederatedSystemStatus> refresh();

    @DELETE
    @Path("/urls")
    @ApiOperation(
            value = "Deletes the url with the given name. Returns true if a url was deleted.",
            response = Boolean.class
    )
    boolean deleteUrl(@ApiParam("The name of the url to delete") @QueryParam("name") final String name);

    @GET
    @Path("/urls")
    @ApiOperation(
            value = "Gets the set of urls",
            response = FederatedSystemStatus.class,
            responseContainer = "List"
    )
    List<FederatedSystemStatus> urlsStatus();

    @GET
    @Path("/" + SCHEMA_PATH)
    @ApiOperation(
            value = "Gets the schema",
            response = Schema.class
    )
    uk.gov.gchq.gaffer.rest.dto.Schema getSchema();

    @GET
    @Path("/" + FILTER_FUNCTIONS_PATH)
    @ApiOperation(
            value = "Gets available filter functions. See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "List"
    )
    Set<String> getFilterFunctions();

    @GET
    @Path("/" + FILTER_FUNCTIONS_PATH + "/{inputClass}")
    @ApiOperation(
            value = "Gets available filter functions for the given input class is provided.  See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "List"
    )
    Set<String> getFilterFunctions(@ApiParam("a function input java class") @PathParam("inputClass") String className);

    @GET
    @Path("/" + TRANSFORM_FUNCTIONS_PATH)
    @ApiOperation(
            value = "Gets available transform functions",
            response = Class.class,
            responseContainer = "List"
    )
    Set<String> getTransformFunctions();

    @GET
    @Path("/" + GENERATORS_PATH)
    @ApiOperation(
            value = "Gets available " + GENERATORS_PATH,
            response = Class.class,
            responseContainer = "List"
    )
    Set<String> getGenerators();

    @GET
    @Path("/" + OPERATIONS_PATH)
    @ApiOperation(
            value = "Gets all " + OPERATIONS_PATH + " supported by the store. See <a href=\'https://github.com/gchq/Gaffer/wiki/operation-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "List"
    )
    Set<String> getOperations();

    @GET
    @Path("/" + STORE_TRAITS_PATH)
    @ApiOperation(
            value = "Gets all supported store traits",
            response = StoreTrait.class,
            responseContainer = "List"
    )
    Set<StoreTrait> getStoreTraits();

    @POST
    @Path("/" + IS_OPERATION_SUPPORTED_PATH)
    @ApiOperation(
            value = "Determines whether the operation type supplied is supported by the store",
            response = Boolean.class
    )
    Boolean isOperationSupported(String className);

    @GET
    @Path("/" + SERIALISED_FIELDS_PATH + "/{className}")
    @ApiOperation(
            value = "Gets all serialised fields for a given java class.",
            response = String.class,
            responseContainer = "List"
    )
    Set<String> getSerialisedFields(@ApiParam("a java class name") @PathParam("className") String className);
}
