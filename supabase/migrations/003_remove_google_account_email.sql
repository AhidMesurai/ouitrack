-- Remove google_account_email column from ga4_connections table (optional - only if you want to clean up)
-- This column is not needed anymore since we're not supporting multiple accounts
-- You can leave it if you want, it won't cause any issues

-- ALTER TABLE ga4_connections DROP COLUMN IF EXISTS google_account_email;
-- DROP INDEX IF EXISTS idx_ga4_connections_google_email;

-- Note: Commented out by default. Uncomment if you want to remove the column.

