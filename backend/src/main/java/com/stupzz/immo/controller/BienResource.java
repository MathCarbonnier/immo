package com.stupzz.immo.controller;

import com.stupzz.immo.dto.BienRequestDTO;
import com.stupzz.immo.dto.BienResponseDTO;
import com.stupzz.immo.service.BienService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;

import java.util.List;

/**
 * REST Controller for Bien resources.
 * Uses DTOs for data transfer between client and server.
 */
@Path("/api/biens")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BienResource {

    @Inject
    BienService bienService;

    /**
     * Get all Bien DTOs.
     *
     * @param sortBy The field to sort by (optional)
     * @param sortOrder The sort order (asc or desc, optional)
     * @param status The status to filter by (optional)
     * @return Response with the list of all Bien DTOs
     */
    @GET
    public Response getAll(@QueryParam("sortBy") String sortBy, 
                          @QueryParam("sortOrder") String sortOrder,
                          @QueryParam("status") String status) {
        List<BienResponseDTO> biens = bienService.findAll(sortBy, sortOrder, status);
        return Response.ok(biens).build();
    }

    /**
     * Get a Bien DTO by its ID.
     *
     * @param id The ID of the Bien
     * @return Response with the Bien DTO if found, 404 otherwise
     */
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return bienService.findById(id)
                .map(bien -> Response.ok(bien).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    /**
     * Create a new Bien from DTO.
     *
     * @param bienDTO The Bien DTO to create
     * @return Response with the created Bien DTO and 201 status
     */
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public Response create(BienRequestDTO bienDTO) {
        BienResponseDTO created = bienService.create(bienDTO);
        return Response
                .created(UriBuilder.fromResource(BienResource.class)
                        .path(String.valueOf(created.getId()))
                        .build())
                .entity(created)
                .build();
    }

    /**
     * Update an existing Bien from DTO.
     *
     * @param id The ID of the Bien to update
     * @param bienDTO The updated Bien DTO
     * @return Response with the updated Bien DTO if found, 404 otherwise
     */
    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, BienRequestDTO bienDTO) {
        return bienService.update(id, bienDTO)
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
