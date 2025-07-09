package com.stupzz.immo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entity representing an image for a real estate property.
 */
@Entity
@Table(name = "image_bien")
public class ImageBien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String base64;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImageType type;

    @ManyToOne
    @JoinColumn(name = "bien_id", nullable = false)
    @JsonIgnore
    private Bien bien;

    // Default constructor required by JPA
    public ImageBien() {
    }

    // Constructor with all fields
    public ImageBien(String base64, ImageType type, Bien bien) {
        this.base64 = base64;
        this.type = type;
        this.bien = bien;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBase64() {
        return base64;
    }

    public void setBase64(String base64) {
        this.base64 = base64;
    }

    public ImageType getType() {
        return type;
    }

    public void setType(ImageType type) {
        this.type = type;
    }

    public Bien getBien() {
        return bien;
    }

    public void setBien(Bien bien) {
        this.bien = bien;
    }

    @Override
    public String toString() {
        return "ImageBien{" +
                "id=" + id +
                ", type=" + type +
                '}';
    }
}
