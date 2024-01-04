-- Migration number: 0003 	 2024-01-04T13:05:55.557Z
ALTER TABLE ProfileRestriction
ADD COLUMN flagged INTEGER DEFAULT 0;
