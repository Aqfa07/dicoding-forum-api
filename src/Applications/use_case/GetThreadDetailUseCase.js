class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute({ threadId }) {
    await this._threadRepository.verifyThreadExists(threadId)

    const thread = await this._threadRepository.getThreadDetail(threadId)
    const comments = await this._commentRepository.getCommentsByThreadId(threadId)

    const commentIds = comments.map((c) => c.id)
    const replies = await this._replyRepository.getRepliesByCommentIds(commentIds)

    const normalizedComments = comments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((c) => ({
        id: c.id,
        username: c.username,
        date: c.date,
        content: c.is_delete ? "**komentar telah dihapus**" : c.content,
        replies: replies
          .filter((r) => r.comment_id === c.id)
          .map((r) => ({
            id: r.id,
            content: r.content,
            date: r.date,
            username: r.username,
          })),
      }))

    return { ...thread, comments: normalizedComments }
  }
}

module.exports = GetThreadDetailUseCase
