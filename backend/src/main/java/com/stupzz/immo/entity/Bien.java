package com.stupzz.immo.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a real estate property.
 */
@Entity
@Table(name = "bien")
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

    // Default constructor required by JPA
    public Bien() {
    }

    // Constructor with all fields except images
    public Bien(String titre, Double surface, Double prix, String description) {
        this.titre = titre;
        this.surface = surface;
        this.prix = prix;
        this.description = description;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Double getSurface() {
        return surface;
    }

    public void setSurface(Double surface) {
        this.surface = surface;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public List<ImageBien> getImages() {
        return images;
    }

    public void setImages(List<ImageBien> images) {
        this.images = images;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Bien{" +
                "id=" + id +
                ", titre='" + titre + '\'' +
                ", surface=" + surface +
                ", prix=" + prix +
                ", images=" + images.size() +
                ", description='" + description + '\'' +
                '}';
    }
}
