package com.stupzz.immo.dto;

import com.stupzz.immo.entity.ImageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for sending ImageBien data to clients.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageBienResponseDTO {
    private Long id;
    private String base64;
    private ImageType type;
}