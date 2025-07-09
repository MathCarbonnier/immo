-- Create the image_bien table
CREATE TABLE image_bien (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL,
    type VARCHAR(10) NOT NULL,
    bien_id BIGINT NOT NULL,
    FOREIGN KEY (bien_id) REFERENCES bien(id) ON DELETE CASCADE
);

-- Alter the bien table to remove the image column
ALTER TABLE bien DROP COLUMN image;