-- Create the bien table
CREATE TABLE bien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    surface DOUBLE NOT NULL,
    prix DOUBLE NOT NULL,
    image VARCHAR(255),
    description TEXT
);