const { model } = require("mongoose");
const { PostSchema } = require("../schemas");

const Post = model("posts", PostSchema);

class PostModel {
  async create({ title, content }) {
    return await Post.create({ title: title, content: content });
  }
}

module.exports = new PostModel();
