const { model } = require("mongoose");
const { CommentSchema } = require("../schemas");

const Comment = model("comments", CommentSchema);

class CommentModel {
  async create(text) {
    return await Comment.create({ text });
  }
  async delete(comment_id) {
    return await Comment.findOneAndUpdate({ comment_id }, { $set: { isDeleted: true } }, { new: true });
  }
}

module.exports = new CommentModel();
