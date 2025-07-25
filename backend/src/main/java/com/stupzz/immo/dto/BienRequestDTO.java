package com.stupzz.immo.dto;

import com.stupzz.immo.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for receiving Bien data from clients.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BienRequestDTO {
    private String titre;
    private Double surface;
    private Double prix;
    private String description;
    private String rue;
    private String ville;
    private String codePostal;
    private String pays;
    private Double latitude;
    private Double longitude;
    private Status status;
    private List<ImageBienRequestDTO> images = new ArrayList<>();
}
