const { model } = require("mongoose");
const { commentTopostSchema } = require("../schemas");

const CommentToPost = model("commentToposts", commentTopostSchema);

class commentTopostModel {
  async create({ comment_id, post_id, user_id }) {
    return CommentToPost.create({ comment_id, post_id, user_id });
  }
}

module.exports = new commentTopostModel();
