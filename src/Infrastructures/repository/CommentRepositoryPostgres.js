const CommentRepository = require("../../Domains/comments/CommentRepository")
const AddedComment = require("../../Domains/comments/entities/AddedComment")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: `
        INSERT INTO comments (id, thread_id, content, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING id, content, owner
      `,
      values: [id, threadId, content, owner, date],
    }

    const result = await this._pool.query(query)
    return new AddedComment(result.rows[0])
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan")
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan")
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini")
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    }
    await this._pool.query(query)
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, c.content, c.date, c.is_delete, u.username
        FROM comments c
        JOIN users u ON u.id = c.owner
        WHERE c.thread_id = $1
        ORDER BY c.date ASC
      `,
      values: [threadId],
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = CommentRepositoryPostgres
