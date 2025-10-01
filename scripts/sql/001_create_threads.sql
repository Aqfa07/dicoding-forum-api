-- create threads table
CREATE TABLE IF NOT EXISTS threads (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  owner VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_threads_owner ON threads(owner);
