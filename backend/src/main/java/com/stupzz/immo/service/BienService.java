package com.stupzz.immo.service;

import com.stupzz.immo.dto.BienRequestDTO;
import com.stupzz.immo.dto.BienResponseDTO;
import com.stupzz.immo.entity.Bien;
import com.stupzz.immo.entity.ImageBien;
import com.stupzz.immo.entity.ImageType;
import com.stupzz.immo.entity.Status;
import com.stupzz.immo.mapper.BienMapper;
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

    @Inject
    BienMapper bienMapper;

    /**
     * Get all Bien entities as DTOs.
     *
     * @param sortBy The field to sort by (optional)
     * @param sortOrder The sort order (asc or desc, optional)
     * @return List of all Bien DTOs, sorted if parameters are provided
     */
    public List<BienResponseDTO> findAll(String sortBy, String sortOrder) {
        List<Bien> biens;
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.Descending : Sort.Direction.Ascending;
            biens = bienRepository.listAll(Sort.by(sortBy).direction(direction));
        } else {
            biens = bienRepository.listAll();
        }
        return bienMapper.toResponseDTOs(biens);
    }

    /**
     * Get all Bien entities filtered by status as DTOs.
     *
     * @param sortBy The field to sort by (optional)
     * @param sortOrder The sort order (asc or desc, optional)
     * @param statusStr The status to filter by (optional)
     * @return List of Bien DTOs filtered by status and sorted if parameters are provided
     */
    public List<BienResponseDTO> findAll(String sortBy, String sortOrder, String statusStr) {
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

        List<Bien> biens;
        // Apply sorting if provided
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.Descending : Sort.Direction.Ascending;
            Sort sort = Sort.by(sortBy).direction(direction);
            biens = bienRepository.find("status", sort, status).list();
        } else {
            // No sorting, just filter by status
            biens = bienRepository.find("status", status).list();
        }

        return bienMapper.toResponseDTOs(biens);
    }

    /**
     * Get all Bien entities as DTOs.
     *
     * @return List of all Bien DTOs
     */
    public List<BienResponseDTO> findAll() {
        List<Bien> biens = bienRepository.listAll();
        return bienMapper.toResponseDTOs(biens);
    }

    /**
     * Get a Bien entity by its ID as DTO.
     *
     * @param id The ID of the Bien entity
     * @return Optional containing the Bien DTO if found, empty otherwise
     */
    public Optional<BienResponseDTO> findById(Long id) {
        return Optional.ofNullable(bienRepository.findById(id))
                .map(bienMapper::toResponseDTO);
    }

    /**
     * Create a new Bien entity from DTO.
     *
     * @param bienDTO The Bien DTO to create
     * @return The created Bien DTO
     */
    @Transactional
    public BienResponseDTO create(BienRequestDTO bienDTO) {
        Bien bien = bienMapper.toEntity(bienDTO);

        // Ensure each ImageBien has its bien property set
        if (bien.getImages() != null) {
            for (ImageBien image : bien.getImages()) {
                image.setBien(bien);
            }
        }

        bienRepository.persist(bien);
        return bienMapper.toResponseDTO(bien);
    }

    /**
     * Update an existing Bien entity from DTO.
     *
     * @param id The ID of the Bien entity to update
     * @param bienDTO The updated Bien DTO
     * @return Optional containing the updated Bien DTO if found, empty otherwise
     */
    @Transactional
    public Optional<BienResponseDTO> update(Long id, BienRequestDTO bienDTO) {
        Bien existingBien = bienRepository.findById(id);
        if (existingBien == null) {
            return Optional.empty();
        }

        bienMapper.updateEntityFromDTO(existingBien, bienDTO);

        // Ensure each ImageBien has its bien property set
        if (existingBien.getImages() != null) {
            for (ImageBien image : existingBien.getImages()) {
                image.setBien(existingBien);
            }
        }

        return Optional.of(bienMapper.toResponseDTO(existingBien));
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
