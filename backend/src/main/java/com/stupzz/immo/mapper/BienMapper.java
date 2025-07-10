package com.stupzz.immo.mapper;

import com.stupzz.immo.dto.BienRequestDTO;
import com.stupzz.immo.dto.BienResponseDTO;
import com.stupzz.immo.entity.Bien;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Bien entities and DTOs.
 */
@ApplicationScoped
public class BienMapper {

    @Inject
    ImageBienMapper imageBienMapper;

    /**
     * Convert a Bien entity to a BienResponseDTO.
     *
     * @param bien The Bien entity to convert
     * @return The corresponding BienResponseDTO
     */
    public BienResponseDTO toResponseDTO(Bien bien) {
        if (bien == null) {
            return null;
        }

        BienResponseDTO dto = new BienResponseDTO();
        dto.setId(bien.getId());
        dto.setTitre(bien.getTitre());
        dto.setSurface(bien.getSurface());
        dto.setPrix(bien.getPrix());
        dto.setDescription(bien.getDescription());
        dto.setRue(bien.getRue());
        dto.setVille(bien.getVille());
        dto.setCodePostal(bien.getCodePostal());
        dto.setPays(bien.getPays());
        dto.setStatus(bien.getStatus());

        if (bien.getImages() != null) {
            dto.setImages(bien.getImages().stream()
                    .map(imageBienMapper::toResponseDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    /**
     * Convert a list of Bien entities to a list of BienResponseDTOs.
     *
     * @param biens The list of Bien entities to convert
     * @return The corresponding list of BienResponseDTOs
     */
    public List<BienResponseDTO> toResponseDTOs(List<Bien> biens) {
        if (biens == null) {
            return List.of();
        }

        return biens.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert a BienRequestDTO to a Bien entity.
     *
     * @param dto The BienRequestDTO to convert
     * @return The corresponding Bien entity
     */
    public Bien toEntity(BienRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Bien bien = new Bien();
        updateEntityFromDTO(bien, dto);
        return bien;
    }

    /**
     * Update a Bien entity from a BienRequestDTO.
     *
     * @param bien The Bien entity to update
     * @param dto The BienRequestDTO containing the new data
     */
    public void updateEntityFromDTO(Bien bien, BienRequestDTO dto) {
        if (dto == null) {
            return;
        }

        bien.setTitre(dto.getTitre());
        bien.setSurface(dto.getSurface());
        bien.setPrix(dto.getPrix());
        bien.setDescription(dto.getDescription());
        bien.setRue(dto.getRue());
        bien.setVille(dto.getVille());
        bien.setCodePostal(dto.getCodePostal());
        bien.setPays(dto.getPays());
        bien.setStatus(dto.getStatus());

        // Clear existing images and add new ones
        bien.getImages().clear();
        if (dto.getImages() != null) {
            dto.getImages().forEach(imageDTO -> {
                bien.addImage(imageBienMapper.toEntity(imageDTO, bien));
            });
        }
    }
}
