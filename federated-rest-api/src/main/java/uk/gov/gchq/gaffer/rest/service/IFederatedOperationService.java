//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package uk.gov.gchq.gaffer.rest.service;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.glassfish.jersey.server.ChunkedOutput;
import uk.gov.gchq.gaffer.data.element.Edge;
import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.data.element.Entity;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;
import uk.gov.gchq.gaffer.rest.dto.Operation;
import uk.gov.gchq.gaffer.rest.dto.OperationChain;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

@Path("/graph/doOperation")
@Api(
        value = "operations",
        description = "Allows operations to be executed on the graph. See <a href=\'https://github.com/gchq/Gaffer/wiki/operation-examples\' target=\'_blank\'>Wiki</a>."
)
@Consumes({"application/json"})
@Produces({"application/json"})
public interface IFederatedOperationService {
    @POST
    @ApiOperation(
            value = "Performs the given operation chain on the graph",
            response = Object.class
    )
    Object execute(OperationChain opChain,
                   @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors,
                   @ApiParam(value = "if true, operations will be executed one at a time") @QueryParam("runIndividually") boolean runIndividually);

    @POST
    @Path("/chunked")
    @ApiOperation(value = "Performs the given operation chain on the graph, returned chunked output. NOTE - does not work in Swagger.", response = Element.class)
    ChunkedOutput<String> executeChunked(OperationChain opChain,
                                         @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors,
                                         @ApiParam(value = "if true, operations will be executed one at a time") @QueryParam("runIndividually") boolean runIndividually);

    @POST
    @Path("/generate/objects")
    @ApiOperation(
            value = "Generate objects from elements",
            response = Object.class,
            responseContainer = "List"
    )
    Object generateObjects(Operation var1,
                           @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/generate/elements")
    @ApiOperation(
            value = "Generate elements from objects",
            response = Element.class,
            responseContainer = "List"
    )
    Object generateElements(Operation var1,
                            @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);


    @POST
    @Path("/get/entitySeeds/adjacent")
    @ApiOperation(
            value = "Gets adjacent entity seeds",
            response = EntitySeed.class,
            responseContainer = "List"
    )
    Object getAdjacentEntitySeeds(Operation var1,
                                  @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/elements/all")
    @ApiOperation(
            value = "Gets all elements",
            response = Element.class,
            responseContainer = "List"
    )
    Object getAllElements(Operation var1,
                          @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/entities/all")
    @ApiOperation(
            value = "Gets all entities",
            response = Entity.class,
            responseContainer = "List"
    )
    Object getAllEntities(Operation var1,
                          @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/edges/all")
    @ApiOperation(
            value = "Gets all edges",
            response = Edge.class,
            responseContainer = "List"
    )
    Object getAllEdges(Operation var1,
                       @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/elements")
    @ApiOperation(
            value = "Gets elements",
            response = Element.class,
            responseContainer = "List"
    )
    Object getElements(Operation var1,
                       @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/entities")
    @ApiOperation(
            value = "Gets entities",
            response = Entity.class,
            responseContainer = "List"
    )
    Object getEntities(Operation var1,
                       @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @POST
    @Path("/get/edges")
    @ApiOperation(
            value = "Gets edges",
            response = Edge.class,
            responseContainer = "List"
    )
    Object getEdges(Operation var1,
                    @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);

    @PUT
    @Path("/add/elements")
    @ApiOperation(
            value = "Add elements to the graph",
            response = Boolean.class
    )
    void addElements(Operation var1,
                     @ApiParam(value = "if true, then errors from will be skipped") @QueryParam("skipErrors") boolean skipErrors);
}
