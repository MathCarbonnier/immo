-- Rename the url column to base64 in the image_bien table
ALTER TABLE image_bien CHANGE COLUMN url base64 LONGTEXT NOT NULL;