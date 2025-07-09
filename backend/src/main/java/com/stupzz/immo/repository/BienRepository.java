package com.stupzz.immo.repository;

import com.stupzz.immo.entity.Bien;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Repository for the Bien entity.
 * Uses Panache to simplify database operations.
 */
@ApplicationScoped
public class BienRepository implements PanacheRepository<Bien> {
    
    // PanacheRepository provides all the basic CRUD operations:
    // - findAll()
    // - findById(id)
    // - persist(entity)
    // - delete(entity)
    // - deleteById(id)
    // - count()
    // - etc.
    
    // Custom methods can be added here if needed
}