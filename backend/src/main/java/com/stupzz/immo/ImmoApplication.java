package com.stupzz.immo;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

/**
 * Entry point for the Immo application.
 */
@ApplicationPath("/")
public class ImmoApplication extends Application {
    // This class is intentionally empty, it's just a marker class for JAX-RS.
    // Resources are discovered automatically.
}