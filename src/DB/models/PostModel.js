const { model } = require("mongoose");
const { PostSchema } = require("../schemas");

const Post = model("posts", PostSchema);

class PostModel {
  async create({ title, content }) {
    return await Post.create({ title: title, content: content });
  }
  async update({ post_id, title, content }) {
    return await Post.findOneAndUpdate({ post_id: post_id }, { $set: { title: title, content: content } }, { new: true });
  }
  async delete(post_id) {
    return await Post.deleteOne({ post_id: post_id });
  }
}

module.exports = new PostModel();
