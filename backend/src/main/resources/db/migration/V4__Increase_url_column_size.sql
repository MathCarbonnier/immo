-- Alter the image_bien table to increase the size of the url column
ALTER TABLE image_bien MODIFY COLUMN url LONGTEXT NOT NULL;