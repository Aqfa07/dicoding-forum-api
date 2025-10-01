class NewComment {
  constructor(payload) {
    this._verify(payload)
    const { threadId, content, owner } = payload
    this.threadId = threadId
    this.content = content
    this.owner = owner
  }

  _verify({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
    }
    if (typeof threadId !== "string" || typeof content !== "string" || typeof owner !== "string") {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION")
    }
  }
}

module.exports = NewComment
