package com.stupzz.immo.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a real estate property.
 */
@Entity
@Table(name = "bien")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private Double surface;

    @Column(nullable = false)
    private Double prix;

    @OneToMany(mappedBy = "bien", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageBien> images = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String rue;

    @Column
    private String ville;

    @Column
    private String codePostal;

    @Column
    private String pays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.A_VENDRE;

    // Constructor with all fields except images
    public Bien(String titre, Double surface, Double prix, String description) {
        this.titre = titre;
        this.surface = surface;
        this.prix = prix;
        this.description = description;
        this.status = Status.A_VENDRE;
    }

    // Constructor with all fields including status
    public Bien(String titre, Double surface, Double prix, String description, Status status) {
        this.titre = titre;
        this.surface = surface;
        this.prix = prix;
        this.description = description;
        this.status = status;
    }

    // Helper method to add an image
    public void addImage(ImageBien image) {
        images.add(image);
        image.setBien(this);
    }

    // Helper method to remove an image
    public void removeImage(ImageBien image) {
        images.remove(image);
        image.setBien(null);
    }

}
