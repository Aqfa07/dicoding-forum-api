const NewComment = require("../../Domains/comments/entities/NewComment")

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(payload) {
    const newComment = new NewComment(payload)
    await this._threadRepository.verifyThreadExists(newComment.threadId)
    return this._commentRepository.addComment(newComment)
  }
}

module.exports = AddCommentUseCase
