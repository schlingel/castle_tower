--
-- EnvironmentEntry
-- 

CREATE TABLE environmententry (
  id INTEGER PRIMARY KEY,
  source TEXT,
  humidity_percentage REAL,
  timestamp DATETIME,
  temp_in_celsius REAL
);
