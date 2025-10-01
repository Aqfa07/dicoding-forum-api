const InvariantError = require("../../Commons/exceptions/InvariantError")

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(payload) {
    this._verifyPayload(payload)
    const { threadId, commentId, owner } = payload

    await this._threadRepository.verifyThreadExists(threadId)
    await this._commentRepository.verifyCommentExists(commentId)
    await this._commentRepository.verifyCommentOwner(commentId, owner)
    await this._commentRepository.deleteComment(commentId)
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner) {
      throw new InvariantError("DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY")
    }
    if (typeof threadId !== "string" || typeof commentId !== "string" || typeof owner !== "string") {
      throw new InvariantError("DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION")
    }
  }
}

module.exports = DeleteCommentUseCase
