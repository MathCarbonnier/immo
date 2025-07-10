package com.stupzz.immo.service;

import com.stupzz.immo.entity.Bien;
import com.stupzz.immo.entity.ImageBien;
import com.stupzz.immo.entity.ImageType;
import com.stupzz.immo.entity.Status;
import com.stupzz.immo.repository.BienRepository;
import com.stupzz.immo.repository.ImageBienRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing Bien entities.
 */
@ApplicationScoped
public class BienService {

    @Inject
    BienRepository bienRepository;

    @Inject
    ImageBienRepository imageBienRepository;

    /**
     * Get all Bien entities.
     *
     * @param sortBy The field to sort by (optional)
     * @param sortOrder The sort order (asc or desc, optional)
     * @return List of all Bien entities, sorted if parameters are provided
     */
    public List<Bien> findAll(String sortBy, String sortOrder) {
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.Descending : Sort.Direction.Ascending;
            return bienRepository.listAll(Sort.by(sortBy).direction(direction));
        }
        return bienRepository.listAll();
    }

    /**
     * Get all Bien entities filtered by status.
     *
     * @param sortBy The field to sort by (optional)
     * @param sortOrder The sort order (asc or desc, optional)
     * @param statusStr The status to filter by (optional)
     * @return List of Bien entities filtered by status and sorted if parameters are provided
     */
    public List<Bien> findAll(String sortBy, String sortOrder, String statusStr) {
        // If status is not provided, use the regular findAll method
        if (statusStr == null || statusStr.isEmpty()) {
            return findAll(sortBy, sortOrder);
        }

        // Try to parse the status string to a Status enum
        Status status;
        try {
            status = Status.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            // If the status string is invalid, return all biens
            return findAll(sortBy, sortOrder);
        }

        // Apply sorting if provided
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.Descending : Sort.Direction.Ascending;
            Sort sort = Sort.by(sortBy).direction(direction);
            return bienRepository.find("status", sort, status).list();
        }

        // No sorting, just filter by status
        return bienRepository.find("status", status).list();
    }

    /**
     * Get all Bien entities.
     *
     * @return List of all Bien entities
     */
    public List<Bien> findAll() {
        return bienRepository.listAll();
    }

    /**
     * Get a Bien entity by its ID.
     *
     * @param id The ID of the Bien entity
     * @return Optional containing the Bien entity if found, empty otherwise
     */
    public Optional<Bien> findById(Long id) {
        return Optional.ofNullable(bienRepository.findById(id));
    }

    /**
     * Create a new Bien entity.
     *
     * @param bien The Bien entity to create
     * @return The created Bien entity
     */
    @Transactional
    public Bien create(Bien bien) {
        // Ensure each ImageBien has its bien property set
        if (bien.getImages() != null) {
            for (ImageBien image : bien.getImages()) {
                image.setBien(bien);
            }
        }
        bienRepository.persist(bien);
        return bien;
    }

    /**
     * Update an existing Bien entity.
     *
     * @param id The ID of the Bien entity to update
     * @param bien The updated Bien entity
     * @return Optional containing the updated Bien entity if found, empty otherwise
     */
    @Transactional
    public Optional<Bien> update(Long id, Bien bien) {
        return findById(id)
                .map(existingBien -> {
                    existingBien.setTitre(bien.getTitre());
                    existingBien.setSurface(bien.getSurface());
                    existingBien.setPrix(bien.getPrix());
                    existingBien.setDescription(bien.getDescription());
                    existingBien.setStatus(bien.getStatus());

                    // Update images
                    existingBien.getImages().clear();
                    if (bien.getImages() != null) {
                        for (ImageBien image : bien.getImages()) {
                            existingBien.addImage(image);
                        }
                    }
                    return existingBien;
                });
    }

    /**
     * Delete a Bien entity by its ID.
     *
     * @param id The ID of the Bien entity to delete
     * @return true if the entity was deleted, false otherwise
     */
    @Transactional
    public boolean deleteById(Long id) {
        return bienRepository.deleteById(id);
    }
}
