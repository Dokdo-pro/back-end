const { groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel, albumToboardModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel, albumToboardModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
    this.commentModel = commentModel;
    this.commentTopostModel = commentTopostModel;
    this.replyModel = replyModel;
    this.likeModel = likeModel;
    this.albumToboardModel = albumToboardModel;
  }

  async postGroup({ user_id, name, introduction, tag, place, location, age, genre, day }) {
    const group = await this.groupModel.findByName(name);
    if (group) {
      throw new AppError("Bad Request", 400, "이미 존재하는 모임명입니다.");
    }
    const createGroup = await this.groupModel.create({ user_id, name, introduction, tag, place, location, age, genre, day });
    const group_id = createGroup.group.group_id;
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

  async getGroups(orderBy, condition) {
    const cond = Object.entries(condition).reduce((map, [key, value]) => {
      if (value !== undefined) {
        map[key] = value;
      }
      return map;
    }, {});
    const groups = await this.groupModel.getGroupByCondition(cond);
    const getAllGroups = await this.groupModel.getAllGroups(groups);
    if (orderBy === "oldest") {
      return getAllGroups;
    } else if (orderBy === "popularity") {
      return getAllGroups.sort((a, b) => {
        return b.like - a.like;
      });
    } else if (orderBy === "random") {
      return getAllGroups.sort(() => Math.random() - 0.5);
    } else {
      return getAllGroups.sort((a, b) => b.createdAt - a.createdAt);
    }
  }

  async postPost({ user_id, group_id, title, content, images }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const createPost = await this.postModel.create({ group_id, title, content, images });
    const post_id = createPost.post_id;
    const postToboard = await this.postToboardModel.create({ post_id, user_id, group_id });
    return { createPost, postToboard };
  }

  async getPosts(group_id) {
    return await this.postToboardModel.findPostsByGroupId(group_id);
  }

  async getPost({ group_id, post_id }) {
    return await this.postModel.findPostByPostId(post_id);
  }

  async putPost({ user_id, group_id, post_id, title, content }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const post = await this.postToboardModel.findPostByPostId(post_id);
    if (user_id !== post.user_id) {
      throw new AppError("Bad Request", 400, "수정 권한이 없습니다.");
    }
    return await this.postModel.update({ post_id, title, content });
  }

  async deletePost({ user_id, group_id, post_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const post = await this.postToboardModel.findPostByPostId(post_id);
    if (user_id !== post.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    const deletePost = await this.postModel.delete(post_id);
    const deletePostToBoard = await this.postToboardModel.delete(post_id);
    return { deletePost, deletePostToBoard };
  }

  async postComment({ user_id, group_id, post_id, text }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const postComment = await this.commentModel.create(text);
    const comment_id = postComment.comment_id;
    const postCommentToPost = await this.commentTopostModel.create({ comment_id, post_id, user_id });
    return { comment_id, postCommentToPost };
  }

  async getComments({ user_id, group_id, post_id }) {
    const comments = await this.commentTopostModel.findCommentsByPostId(post_id);
    return await Promise.all(
      comments.map((item) => {
        return this.commentModel.findById(item);
      })
    );
  }

  async deleteComment({ user_id, group_id, comment_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const comment = await this.commentTopostModel.findCommentByCommentId(comment_id);
    if (user_id !== comment.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    return await this.commentModel.delete(comment_id);
  }

  async postReply({ user_id, group_id, parentComment_id, text }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const postReply = await this.commentModel.create(text);
    const comment_id = postReply.comment_id;
    return await this.replyModel.create({ comment_id, parentComment_id, user_id });
  }

  async getReplies({ user_id, group_id, comment_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const replies = await this.replyModel.getRepliesByCommentId(comment_id);
    return await Promise.all(
      replies.map((item) => {
        return this.commentModel.findById(item);
      })
    );
  }

  async deleteReply({ user_id, group_id, reply_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const reply = await this.replyModel.findReplyByReplyId(reply_id);
    if (user_id !== reply.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    return await this.commentModel.delete(reply_id);
  }

  async postLike({ user_id, group_id, post_id }) {
    return await this.likeModel.postLike({ user_id, post_id });
  }

  async getPostLike({ user_id, group_id, post_id }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const likes = await this.likeModel.getPostLike(post_id);
    return likes.length;
  }

  async groupLike({ user_id, group_id }) {
    return await this.likeModel.groupLike({ user_id, group_id });
  }

  async getGroupLike(group_id) {
    const likes = await this.likeModel.getGroupLike(group_id);
    return likes.length;
  }

  async getLikedGroup(user_id) {
    return await this.likeModel.getLikedGroup(user_id);
  }

  async deleteGroup({ group_id, user_id }) {
    if (user_id) {
      const group = await this.groupModel.findById(group_id);
      const leader = group.leader;
      if (leader !== user_id) {
        throw new AppError("Bad Request", 400, "수정 권한이 없습니다.");
      }
    }
    const deleteGroup = await this.groupModel.delete(group_id);
    const deleteGroupToUser = await this.groupTouserModel.deleteGroupToUser(group_id);
    return { deleteGroup: deleteGroup, deleteGroupToUser: deleteGroupToUser };
  }

  async putGroup({ group_id, user_id, name, tags, introduction, place, location, day, genre, age }) {
    if (user_id) {
      const group = await this.groupModel.findById(group_id);
      const leader = group.leader;
      if (leader !== user_id) {
        throw new AppError("Bad Request", 400, "수정 권한이 없습니다.");
      }
    }
    const putGroup = await this.groupModel.update({ group_id, name, introduction });
    const putTag = await this.groupModel.updateTags({ group_id, tags });
    const putSearch = await this.groupModel.updateSearch({ group_id, place, location, day, genre, age });
    return { putGroup, putTag, putSearch };
  }

  async putProfile({ user_id, group_id, profilePic }) {
    if (user_id) {
      const group = await this.groupModel.findById(group_id);
      const leader = group.leader;
      if (leader !== user_id) {
        throw new AppError("Bad Request", 400, "수정 권한이 없습니다.");
      }
    }
    return await this.groupModel.updateProfile({ group_id, profilePic });
  }

  async adminPutGroup({ group_id, name, tags, introduction, place, location, day, genre, age }) {
    const putGroup = await this.groupModel.update({ group_id, name, introduction });
    const putTag = await this.groupModel.updateTags({ group_id, tags });
    const putSearch = await this.groupModel.updateSearch({ group_id, place, location, day, genre, age });
    return { putGroup, putTag, putSearch };
  }

  async getAllGroups() {
    const groups = await this.groupModel.getGroupByCondition();
    return await this.groupModel.getAllGroups(groups);
  }

  async postAlbum({ user_id, group_id, title, content, images }) {
    const userTogroup = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    const createPost = await this.postModel.create({ group_id, title, content, images });
    const post_id = createPost.post_id;
    const postToboard = await this.albumToboardModel.create({ post_id, user_id, group_id });
    return { createPost, postToboard };
  }

  async getAlbums(group_id) {
    return await this.albumToboardModel.findAlbumsByGroupId(group_id);
  }
}

module.exports = new groupService(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel, albumToboardModel);
