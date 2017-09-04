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

import uk.gov.gchq.gaffer.federated.rest.dto.FederatedSystemStatus;
import uk.gov.gchq.gaffer.federated.rest.dto.GafferUrl;
import uk.gov.gchq.gaffer.store.StoreTrait;
import uk.gov.gchq.gaffer.store.schema.Schema;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import java.util.List;
import java.util.Set;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path("/graph")
@Produces(APPLICATION_JSON)
@Consumes(APPLICATION_JSON)
@Api(
        value = "/graph",
        description = "Methods to get graph configuration information."
)
public interface IFederatedGraphConfigurationService {
    String URLS_PATH = "urls";
    String REFRESH_PATH = URLS_PATH + "/refresh";
    String SCHEMA_PATH = "schema";
    String FILTER_FUNCTIONS_PATH = "filterFunctions";
    String TRANSFORM_FUNCTIONS_PATH = "transformFunctions";
    String GENERATORS_PATH = "generators";
    String OPERATIONS_PATH = "operations";
    String STORE_TRAITS_PATH = "storeTraits";
    String IS_OPERATION_SUPPORTED_PATH = "isOperationSupported";
    String SERIALISED_FIELDS_PATH = "serialisedFields";

    @POST
    @Path(URLS_PATH)
    @ApiOperation(
            value = "Adds a new Gaffer URL to delegate " + OPERATIONS_PATH + " to"
    )
    GafferUrl addUrl(final GafferUrl url);

    @DELETE
    @Path(URLS_PATH + "/{name}")
    @ApiOperation(
            value = "Deletes the url with the given name. Returns true if a url was deleted.",
            response = Boolean.class
    )
    boolean deleteUrl(@ApiParam("The name of the url to delete") @PathParam("name") final String name);

    @GET
    @Path(URLS_PATH)
    @ApiOperation(
            value = "Gets the set of urls",
            response = GafferUrl.class,
            responseContainer = "Set"
    )
    Set<GafferUrl> getUrls();

    @POST
    @Path(REFRESH_PATH)
    @ApiOperation(
            value = "Updates the cache containing the " + SCHEMA_PATH + "s fetched from the URLs",
            response = FederatedSystemStatus.class,
            responseContainer = "List"
    )
    List<FederatedSystemStatus> refresh();

    @GET
    @Path(SCHEMA_PATH)
    @ApiOperation(
            value = "Gets the schema",
            response = Schema.class
    )
    uk.gov.gchq.gaffer.federated.rest.dto.Schema getSchema();

    @GET
    @Path(FILTER_FUNCTIONS_PATH)
    @ApiOperation(
            value = "Gets available filter functions. See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "Set"
    )
    Set<String> getFilterFunctions();

    @GET
    @Path(FILTER_FUNCTIONS_PATH + "/{inputClass}")
    @ApiOperation(
            value = "Gets available filter functions for the given input class is provided.  See <a href=\'https://github.com/gchq/Gaffer/wiki/filter-function-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "Set"
    )
    Set<String> getFilterFunctions(@ApiParam("a function input java class") @PathParam("inputClass") final String className);

    @GET
    @Path(TRANSFORM_FUNCTIONS_PATH)
    @ApiOperation(
            value = "Gets available transform functions",
            response = Class.class,
            responseContainer = "Set"
    )
    Set<String> getTransformFunctions();

    @GET
    @Path(GENERATORS_PATH)
    @ApiOperation(
            value = "Gets available " + GENERATORS_PATH,
            response = Class.class,
            responseContainer = "Set"
    )
    Set<String> getGenerators();

    @GET
    @Path(OPERATIONS_PATH)
    @ApiOperation(
            value = "Gets all " + OPERATIONS_PATH + " supported by the store. See <a href=\'https://github.com/gchq/Gaffer/wiki/operation-examples\' target=\'_blank\' style=\'text-decoration: underline;\'>Wiki</a>.",
            response = Class.class,
            responseContainer = "Set"
    )
    Set<String> getOperations();

    @GET
    @Path(STORE_TRAITS_PATH)
    @ApiOperation(
            value = "Gets all supported store traits",
            response = StoreTrait.class,
            responseContainer = "Set"
    )
    Set<StoreTrait> getStoreTraits();

    @POST
    @Path(IS_OPERATION_SUPPORTED_PATH)
    @ApiOperation(
            value = "Determines whether the operation type supplied is supported by the store",
            response = Boolean.class
    )
    Boolean isOperationSupported(final String className);

    @GET
    @Path(SERIALISED_FIELDS_PATH + "/{className}")
    @ApiOperation(
            value = "Gets all serialised fields for a given java class.",
            response = String.class,
            responseContainer = "Set"
    )
    Set<String> getSerialisedFields(@ApiParam("a java class name") @PathParam("className") final String className);
}
