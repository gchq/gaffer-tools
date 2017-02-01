//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package uk.gov.gchq.gaffer.rest.service;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.store.schema.Schema;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Map;
import java.util.Set;

@Path("/graph")
@Produces({"application/json"})
@Api(
        value = "/graph",
        description = "Methods to get graph configuration information."
)
public interface IFederatedGraphConfigurationService {
    @PUT
    @Path("/url/{url : .+}")
    @ApiOperation(
            value = "Adds a new Gaffer URL to delegate operations to"
    )
    void addUrl(@ApiParam("A new url to add") @PathParam("url") final String url);

    @GET
    @Path("/url/refresh")
    @ApiOperation(
            value = "Updates the cache containing the schemas fetched from the URLs"
    )
    void refresh();

    @GET
    @Path("/url")
    @ApiOperation(
            value = "Gets the set of urls"
    )
    Set<String> urls();

    @GET
    @Path("/schema")
    @ApiOperation(
            value = "Gets the schema",
            response = Schema.class
    )
    Map<String, uk.gov.gchq.gaffer.rest.dto.Schema> getSchema();

    @GET
    @Path("/filterFunctions")
    @ApiOperation(
            value = "Gets available filter functions. See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "list"
    )
    Set<String> getFilterFunctions();

    @GET
    @Path("/filterFunctions/{inputClass}")
    @ApiOperation(
            value = "Gets available filter functions for the given input class is provided.  See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "list"
    )
    Set<String> getFilterFunctions(@ApiParam("a function input java class") @PathParam("inputClass") String className);

    @GET
    @Path("/transformFunctions")
    @ApiOperation(
            value = "Gets available transform functions",
            response = Class.class,
            responseContainer = "list"
    )
    Set<String> getTransformFunctions();

    @GET
    @Path("/generators")
    @ApiOperation(
            value = "Gets available generators",
            response = Class.class,
            responseContainer = "list"
    )
    Set<String> getGenerators();

    @GET
    @Path("/operations")
    @ApiOperation(
            value = "Gets all operations supported by the store. See <a href=\'https://github.com/gchq/Gaffer/wiki/operation-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "list"
    )
    Set<String> getOperations();

    @GET
    @Path("/storeTraits")
    @ApiOperation(
            value = "Gets all supported store traits",
            response = StoreTrait.class,
            responseContainer = "list"
    )
    Set<StoreTrait> getStoreTraits();

    @POST
    @Path("/isOperationSupported")
    @ApiOperation(
            value = "Determines whether the operation type supplied is supported by the store",
            response = Boolean.class
    )
    Boolean isOperationSupported(String className);

    @GET
    @Path("/serialisedFields/{className}")
    @ApiOperation(
            value = "Gets all serialised fields for a given java class.",
            response = String.class,
            responseContainer = "list"
    )
    Set<String> getSerialisedFields(@ApiParam("a java class name") @PathParam("className") String className);
}
