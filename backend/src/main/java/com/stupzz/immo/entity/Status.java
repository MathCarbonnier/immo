package com.stupzz.immo.entity;

/**
 * Enum representing the status of a real estate property.
 */
public enum Status {
    A_VENDRE("À vendre"),
    EN_COURS_DE_VENTE("En cours de vente"),
    VENDU("Vendu");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}