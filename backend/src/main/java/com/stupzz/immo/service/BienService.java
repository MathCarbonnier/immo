package com.stupzz.immo.service;

import com.stupzz.immo.entity.Bien;
import com.stupzz.immo.entity.ImageBien;
import com.stupzz.immo.entity.ImageType;
import com.stupzz.immo.repository.BienRepository;
import com.stupzz.immo.repository.ImageBienRepository;
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
