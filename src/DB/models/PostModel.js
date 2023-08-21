const { model } = require("mongoose");
const { PostSchema } = require("../schemas");

const Post = model("posts", PostSchema);

class PostModel {
  async create({ title, content }) {
    const post = await Post.create({ title: title, content: content });
    return post.post_id;
  }
}

module.exports = new PostModel();
