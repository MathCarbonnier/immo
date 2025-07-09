package com.stupzz.immo.controller;

import com.stupzz.immo.entity.Bien;
import com.stupzz.immo.service.BienService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;

import java.util.List;

/**
 * REST Controller for Bien entities.
 */
@Path("/api/biens")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BienResource {

    @Inject
    BienService bienService;

    /**
     * Get all Bien entities.
     *
     * @return Response with the list of all Bien entities
     */
    @GET
    public Response getAll() {
        List<Bien> biens = bienService.findAll();
        return Response.ok(biens).build();
    }

    /**
     * Get a Bien entity by its ID.
     *
     * @param id The ID of the Bien entity
     * @return Response with the Bien entity if found, 404 otherwise
     */
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return bienService.findById(id)
                .map(bien -> Response.ok(bien).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    /**
     * Create a new Bien entity.
     *
     * @param bien The Bien entity to create
     * @return Response with the created Bien entity and 201 status
     */
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public Response create(Bien bien) {
        Bien created = bienService.create(bien);
        return Response
                .created(UriBuilder.fromResource(BienResource.class)
                        .path(String.valueOf(created.getId()))
                        .build())
                .entity(created)
                .build();
    }

    /**
     * Update an existing Bien entity.
     *
     * @param id The ID of the Bien entity to update
     * @param bien The updated Bien entity
     * @return Response with the updated Bien entity if found, 404 otherwise
     */
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, Bien bien) {
        return bienService.update(id, bien)
                .map(updated -> Response.ok(updated).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    /**
     * Delete a Bien entity by its ID.
     *
     * @param id The ID of the Bien entity to delete
     * @return Response with 204 status if deleted, 404 otherwise
     */
    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = bienService.deleteById(id);
        return deleted
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }
}