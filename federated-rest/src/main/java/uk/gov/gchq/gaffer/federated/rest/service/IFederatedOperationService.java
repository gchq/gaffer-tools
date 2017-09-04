/*
 * Copyright 2016-2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package uk.gov.gchq.gaffer.federated.rest.service;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.glassfish.jersey.server.ChunkedOutput;

import uk.gov.gchq.gaffer.data.element.Element;
import uk.gov.gchq.gaffer.federated.rest.dto.Operation;
import uk.gov.gchq.gaffer.federated.rest.dto.OperationChain;
import uk.gov.gchq.gaffer.operation.data.EntitySeed;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/graph/" + IFederatedOperationService.DO_OPERATION_PATH)
@Api(
        value = "operations",
        description = "Allows operations to be executed on the graph. See <a href=\'https://github.com/gchq/Gaffer/wiki/operation-examples\' target=\'_blank\'>Wiki</a>."
)
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
public interface IFederatedOperationService {
    String SKIP_ERRORS_MSG = "if true, then errors from delegate URLs will be skipped";
    String FIRST_RESULT_MSG = "if true, the result will only contain the results from the first delegate URL to respond";
    String RUN_INDIVIDUALLY_MSG = "if true, operations will be executed one at a time";
    String SKIP_ERRORS_PARAM = "skipErrors";
    String RUN_INDIVIDUALLY_PARAM = "runIndividually";
    String FIRST_RESULT_PARAM = "firstResult";
    String DO_OPERATION_PATH = "doOperation";

    @POST
    @ApiOperation(
            value = "Performs the given operation chain on the graph",
            response = Object.class,
            responseContainer = "List"
    )
    Iterable<Object> execute(final OperationChain opChain,
                             @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                             @ApiParam(RUN_INDIVIDUALLY_MSG) @QueryParam(RUN_INDIVIDUALLY_PARAM) boolean runIndividually,
                             @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/operation")
    @ApiOperation(
            value = "Performs the given operation on the graph",
            response = Object.class)
    Object execute(final Operation operation,
                   @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                   @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/chunked/operation")
    @ApiOperation(
            value = "Performs the given operation on the graph, returned chunked output. NOTE - does not work in Swagger.",
            response = Object.class)
    ChunkedOutput<String> executeChunked(final Operation operation,
                                         @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                         @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/chunked")
    @ApiOperation(value = "Performs the given operation chain on the graph, returned chunked output. NOTE - does not work in Swagger.",
            response = Object.class,
            responseContainer = "List")
    ChunkedOutput<String> executeChunked(final OperationChain opChain,
                                         @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                         @ApiParam(RUN_INDIVIDUALLY_MSG) @QueryParam(RUN_INDIVIDUALLY_PARAM) boolean runIndividually,
                                         @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/generate/objects")
    @ApiOperation(
            value = "Generate objects from elements",
            response = Object.class,
            responseContainer = "List"
    )
    Iterable<Object> generateObjects(final Operation operation,
                                     @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                     @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/generate/elements")
    @ApiOperation(
            value = "Generate elements from objects",
            response = Element.class,
            responseContainer = "List"
    )
    Iterable<Object> generateElements(final Operation operation,
                                      @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                      @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);


    @POST
    @Path("/get/entitySeeds/adjacent")
    @ApiOperation(
            value = "Gets adjacent entity seeds",
            response = EntitySeed.class,
            responseContainer = "List"
    )
    Iterable<Object> getAdjacentIds(final Operation operation,
                                    @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                    @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/get/elements/all")
    @ApiOperation(
            value = "Gets all elements",
            response = Element.class,
            responseContainer = "List"
    )
    Iterable<Object> getAllElements(final Operation operation,
                                    @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                    @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @POST
    @Path("/get/elements")
    @ApiOperation(
            value = "Gets elements",
            response = Element.class,
            responseContainer = "List"
    )
    Iterable<Object> getElements(final Operation operation,
                                 @ApiParam(SKIP_ERRORS_MSG) @QueryParam(SKIP_ERRORS_PARAM) boolean skipErrors,
                                 @ApiParam(FIRST_RESULT_MSG) @QueryParam(FIRST_RESULT_PARAM) boolean firstResult);

    @PUT
    @Path("/add/elements")
    @ApiOperation(
            value = "Add elements to the graph"
    )
    void addElements(final Operation operation);
}
