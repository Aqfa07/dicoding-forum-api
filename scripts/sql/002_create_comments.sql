-- create comments table with soft delete flag
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(50) PRIMARY KEY,
  thread_id VARCHAR(50) NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  owner VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_delete BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_comments_thread_id ON comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_owner ON comments(owner);
