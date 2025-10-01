const ReplyRepository = require("../../Domains/replies/ReplyRepository")
const AddedReply = require("../../Domains/replies/entities/AddedReply")
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply
    const id = `reply-${this._idGenerator()}`
    const query = {
      text: `INSERT INTO replies (id, comment_id, content, owner)
             VALUES ($1, $2, $3, $4) RETURNING id, content, owner`,
      values: [id, commentId, content, owner],
    }
    const res = await this._pool.query(query)
    return new AddedReply(res.rows[0])
  }

  async deleteReply(replyId) {
    const query = { text: "UPDATE replies SET is_delete = true WHERE id = $1", values: [replyId] }
    await this._pool.query(query)
  }

  async verifyReplyOwner(replyId, owner) {
    const query = { text: "SELECT owner FROM replies WHERE id = $1", values: [replyId] }
    const res = await this._pool.query(query)
    if (!res.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan")
    }
    if (res.rows[0].owner !== owner) {
      throw new AuthorizationError("anda tidak berhak mengakses resource ini")
    }
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds.length) return []
    const query = {
      text: `
        SELECT r.id, r.comment_id, r.content, r.date, r.is_delete, u.username
        FROM replies r
        JOIN users u ON u.id = r.owner
        WHERE r.comment_id = ANY($1::text[])
        ORDER BY r.date ASC
      `,
      values: [commentIds],
    }
    const res = await this._pool.query(query)
    return res.rows.map((row) => ({
      id: row.id,
      comment_id: row.comment_id,
      username: row.username,
      date: row.date,
      content: row.is_delete ? "**balasan telah dihapus**" : row.content,
      is_delete: row.is_delete,
    }))
  }
}

module.exports = ReplyRepositoryPostgres
