package com.stupzz.immo.mapper;

import com.stupzz.immo.dto.ImageBienRequestDTO;
import com.stupzz.immo.dto.ImageBienResponseDTO;
import com.stupzz.immo.entity.Bien;
import com.stupzz.immo.entity.ImageBien;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Mapper for converting between ImageBien entities and DTOs.
 */
@ApplicationScoped
public class ImageBienMapper {

    /**
     * Convert an ImageBien entity to an ImageBienResponseDTO.
     *
     * @param imageBien The ImageBien entity to convert
     * @return The corresponding ImageBienResponseDTO
     */
    public ImageBienResponseDTO toResponseDTO(ImageBien imageBien) {
        if (imageBien == null) {
            return null;
        }

        ImageBienResponseDTO dto = new ImageBienResponseDTO();
        dto.setId(imageBien.getId());
        dto.setBase64(imageBien.getBase64());
        dto.setType(imageBien.getType());
        
        return dto;
    }

    /**
     * Convert an ImageBienRequestDTO to an ImageBien entity.
     *
     * @param dto The ImageBienRequestDTO to convert
     * @param bien The Bien entity to associate with the ImageBien
     * @return The corresponding ImageBien entity
     */
    public ImageBien toEntity(ImageBienRequestDTO dto, Bien bien) {
        if (dto == null) {
            return null;
        }

        ImageBien imageBien = new ImageBien();
        imageBien.setId(dto.getId());
        imageBien.setBase64(dto.getBase64());
        imageBien.setType(dto.getType());
        imageBien.setBien(bien);
        
        return imageBien;
    }
}