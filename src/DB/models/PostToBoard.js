const { model } = require("mongoose");
const { postToboardSchema } = require("../schemas");

const PostToBoard = model("postToboards", postToboardSchema);

class PostToBoardModel {
  async create({ post_id, user_id, group_id }) {
    console.log(post_id, user_id, group_id);
    return await PostToBoard.create({ post_id: post_id, group_id: group_id, user_id: user_id });
  }
}

module.exports = new PostToBoardModel();
