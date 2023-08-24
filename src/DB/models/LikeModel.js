const { model } = require("mongoose");
const { postlikeSchema, grouplikeSchema } = require("../schemas");

const PostLike = model("postlikes", postlikeSchema);
const GroupLike = model("grouplikes", grouplikeSchema);

class LikeModel {
  async postLike({ user_id, post_id }) {
    const exist = await PostLike.findOne({ user_id: user_id, post_id: post_id });
    if (exist) {
      const msg = "좋아요가 취소되었습니다.";
      const deleteLike = await PostLike.deleteOne(exist);
      return { msg, deleteLike };
    }
    return await PostLike.create({ user_id, post_id });
  }
  async getPostLike(post_id) {
    return await PostLike.find({ post_id });
  }
  async groupLike({ user_id, group_id }) {
    const exist = await GroupLike.findOne({ user_id: user_id, group_id: group_id });
    if (exist) {
      const msg = "좋아요가 취소되었습니다.";
      const deleteLike = await GroupLike.deleteOne(exist);
      return { msg, deleteLike };
    }
    return await GroupLike.create({ user_id, group_id });
  }
  async getGroupLike(group_id) {
    return await GroupLike.find({ group_id });
  }
}

module.exports = new LikeModel();
