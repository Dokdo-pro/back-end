const { model } = require("mongoose");
const { CommentSchema } = require("../schemas");

const Comment = model("comments", CommentSchema);

class CommentModel {
  async create(text) {
    return await Comment.create({ text });
  }
}

module.exports = new CommentModel();
