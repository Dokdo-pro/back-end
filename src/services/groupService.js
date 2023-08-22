const { groupModel, groupTouserModel, postModel, postToboardModel } = require("../db/models");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel, postModel, postToboardModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
  }

  async postGroup({ user_id, name, profile, maxMember, tag, duration }) {
    const group = await this.groupModel.findByName(name);
    if (group) {
      throw new AppError("Bad Request", 400, "이미 존재하는 모임명입니다.");
    }
    const createGroup = await this.groupModel.create({ user_id, name, profile, maxMember, tag, duration });
    const group_id = createGroup.group_id;
    const joinGroup = await this.groupTouserModel.joinGroup({ user_id, group_id });
    return { createGroup, joinGroup };
  }

  async getGroup({ group_id }) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new AppError("Bad Request", 400, "존재하지 않는 그룹입니다.");
    }
    return group;
  }

  async getAllGroups() {
    return await this.groupModel.getAllGroups();
  }

  async postPost({ user_id, group_id, title, content }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임 가입 후 이용하실 수 있습니다.");
    }
    const createPost = await this.postModel.create({ user_id, group_id, title, content });
    const post_id = createPost.post_id;
    const postToboard = await this.postToboardModel.create({ post_id, user_id, group_id });
    return { createPost, postToboard };
  }

  async getPosts({ user_id, group_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임 가입 후 이용하실 수 있습니다.");
    }
    const getPosts = await this.postToboardModel.findPostsByGroupId(group_id);
    return getPosts;
  }

  async getPost({ user_id, group_id, post_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임 가입 후 이용하실 수 있습니다.");
    }
    return await this.postToboardModel.findPostByPostId(post_id);
  }
}

module.exports = new groupService(groupModel, groupTouserModel, postModel, postToboardModel);
