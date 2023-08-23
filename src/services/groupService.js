const { groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel } = require("../db/models");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
    this.commentModel = commentModel;
    this.commentTopostModel = commentTopostModel;
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
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const createPost = await this.postModel.create({ group_id, title, content });
    const post_id = createPost.post_id;
    const postToboard = await this.postToboardModel.create({ post_id, user_id, group_id });
    return { createPost, postToboard };
  }

  async getPosts({ user_id, group_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const getPosts = await this.postToboardModel.findPostsByGroupId(group_id);
    return getPosts;
  }

  async getPost({ user_id, group_id, post_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    return await this.postModel.findPostByPostId(post_id);
  }

  async putPost({ user_id, group_id, post_id, title, content }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const post = await this.postToboardModel.findPostByPostId(post_id);
    if (user_id !== post.user_id) {
      throw new AppError("Bad Request", 400, "수정 권한이 없습니다.");
    }
    return await this.postModel.update({ post_id, title, content });
  }

  async deletePost({ user_id, group_id, post_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const post = await this.postToboardModel.findPostByPostId(post_id);
    if (user_id !== post.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    const deletePost = await this.postModel.delete(post_id);
    const deletePostToBoard = await this.postToboardModel.delete(post_id);
    return { deletePost, deletePostToBoard };
  }

  async postComment({ user_id, group_id, post_id, text }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const postComment = await this.commentModel.create(text);
    const comment_id = postComment.comment_id;
    const postCommentToPost = await this.commentTopostModel.create({ comment_id, post_id, user_id });
    return { comment_id, postCommentToPost };
  }

  async getComments({ user_id, group_id, post_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    return await this.commentTopostModel.findCommentsByPostId(post_id);
  }

  async deleteComment({ user_id, group_id, post_id, comment_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const comment = await this.commentTopostModel.findCommentByCommentId(comment_id);
    if (user_id !== comment.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    return await this.commentModel.delete(comment_id);
  }
}

module.exports = new groupService(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel);
