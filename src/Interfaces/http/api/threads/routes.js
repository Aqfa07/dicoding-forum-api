const routes = (handler) => [
  // Kriteria 1: Menambahkan Thread (restrict)
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forum_jwt",
    },
  },

  // Kriteria 2: Menambahkan Komentar pada Thread (restrict)
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "forum_jwt",
    },
  },

  // Kriteria 3: Menghapus Komentar pada Thread (restrict, only owner)
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forum_jwt",
    },
  },

  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
    options: { auth: "forum_jwt" },
  },

  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyHandler,
    options: { auth: "forum_jwt" },
  },

  // Kriteria 4: Melihat Detail Thread (public)
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadDetailHandler,
  },
]

module.exports = routes
