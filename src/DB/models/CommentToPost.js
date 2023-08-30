const { model } = require("mongoose");
const { commentTopostSchema } = require("../schemas");

const CommentToPost = model("commentToposts", commentTopostSchema);

class commentTopostModel {
  async create({ comment_id, post_id, user_id }) {
    return await CommentToPost.create({ comment_id, post_id, user_id });
  }
  async findCommentsByPostId({ post_id, limit, offset }) {
    const comments = await CommentToPost.find({ post_id }).limit(limit).skip(offset);
    return comments.map((item) => {
      return item.comment_id;
    });
  }
  async findCommentByCommentId(comment_id) {
    return await CommentToPost.find({ comment_id });
  }
}

module.exports = new commentTopostModel();
