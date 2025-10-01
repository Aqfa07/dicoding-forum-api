const NewThread = require("../../Domains/threads/entities/NewThread")
const ThreadRepository = require("../../Domains/threads/ThreadRepository")

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute(payload) {
    const newThread = new NewThread(payload)
    return this._threadRepository.addThread(newThread)
  }
}

module.exports = AddThreadUseCase
