-- Add position columns to bien table
ALTER TABLE bien
ADD COLUMN latitude DOUBLE,
ADD COLUMN longitude DOUBLE,
ADD COLUMN adresse VARCHAR(255);