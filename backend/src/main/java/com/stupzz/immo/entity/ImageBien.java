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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Entity representing an image for a real estate property.
 */
@Entity
@Table(name = "image_bien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "bien")
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

    // Constructor with specific fields (not all fields)
    public ImageBien(String base64, ImageType type, Bien bien) {
        this.base64 = base64;
        this.type = type;
        this.bien = bien;
    }
}
