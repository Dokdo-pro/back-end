const { model } = require("mongoose");
const { postToboardSchema } = require("../schemas");
const AppError = require("../../misc/AppError");

const PostToBoard = model("postToboards", postToboardSchema);

class PostToBoardModel {
  async create({ post_id, user_id, group_id }) {
    return await PostToBoard.create({ post_id: post_id, group_id: group_id, user_id: user_id });
  }
  async findPostsByGroupId(group_id) {
    return await PostToBoard.find({ group_id: group_id });
  }
  async findPostsByUserId(user_id) {
    return await PostToBoard.find({ user_id: user_id });
  }
  async findPostByPostId(post_id) {
    return await PostToBoard.findOne({ post_id: post_id });
  }
  async delete(post_id) {
    return await PostToBoard.deleteOne({ post_id: post_id });
  }
  async getAllPosts() {
    return await PostToBoard.find();
  }
}

module.exports = new PostToBoardModel();
