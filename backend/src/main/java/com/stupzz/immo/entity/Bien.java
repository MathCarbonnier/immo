package com.stupzz.immo.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    // Constructor with all fields except images
    public Bien(String titre, Double surface, Double prix, String description) {
        this.titre = titre;
        this.surface = surface;
        this.prix = prix;
        this.description = description;
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
