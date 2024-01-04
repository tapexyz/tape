-- Migration number: 0002 	 2024-01-04T06:30:49.391Z
CREATE INDEX IF NOT EXISTS idx_profileId ON Verified (profileId);
CREATE INDEX IF NOT EXISTS idx_profileId ON ProfileRestriction (profileId);
