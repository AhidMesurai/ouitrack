-- Add google_account_email column to ga4_connections table
ALTER TABLE ga4_connections 
ADD COLUMN IF NOT EXISTS google_account_email TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ga4_connections_google_email 
ON ga4_connections(google_account_email);

-- Update existing connections to have a placeholder (optional, for existing data)
-- UPDATE ga4_connections SET google_account_email = 'unknown' WHERE google_account_email IS NULL;

