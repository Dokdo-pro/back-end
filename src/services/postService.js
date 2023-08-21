const { postModel, groupTouserModel, postToboardModel } = require("../db/models");
const AppError = require("../misc/AppError");

class postService {
  constructor(postModel, groupTouserModel, postToboardModel) {
    this.postModel = postModel;
    this.groupTouserModel = groupTouserModel;
    this.postToboardModel = postToboardModel;
  }

  async postPost({ user_id, group_id, title, content }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임 가입 후 이용하실 수 있습니다.");
    }
    const post_id = await this.postModel.create({ user_id, group_id, title, content });
    return await this.postToboardModel.create({ post_id, user_id, group_id });
  }
}

module.exports = new postService(postModel, groupTouserModel, postToboardModel);
