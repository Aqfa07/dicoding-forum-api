class NewReply {
  constructor(payload) {
    const { content, commentId, owner } = payload

    if (!content || !commentId || !owner) {
      throw new Error("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
    }
    if (typeof content !== "string" || typeof commentId !== "string" || typeof owner !== "string") {
      throw new Error("NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION")
    }

    this.content = content
    this.commentId = commentId
    this.owner = owner
  }
}

module.exports = NewReply
