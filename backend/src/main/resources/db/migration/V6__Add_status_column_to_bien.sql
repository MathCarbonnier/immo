-- Add status column to bien table
ALTER TABLE bien ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'A_VENDRE';

-- Update existing records to have the default status
UPDATE bien SET status = 'A_VENDRE';
