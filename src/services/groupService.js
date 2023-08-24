const { groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
    this.commentModel = commentModel;
    this.commentTopostModel = commentTopostModel;
    this.replyModel = replyModel;
    this.likeModel = likeModel;
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

  async getAllGroups(orderBy) {
    if (orderBy === "oldest") return await this.groupModel.getOldestGroups();
    if (orderBy === "popularity") {
      const allGroups = await this.groupModel.getOldestGroups();
      const groupIds = allGroups.map((item) => {
        return item.group_id;
      });
      const groupAndLikes = await Promise.all(
        groupIds.map(async (item) => {
          const likes = await this.likeModel.getGroupLike(item);
          return { group_id: item, likes: likes.length };
        })
      );
      groupAndLikes.sort((a, b) => {
        return b.likes - a.likes;
      });
      return groupAndLikes;
    }
    return await this.groupModel.getLatestGroups();
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
    const comments = await this.commentTopostModel.findCommentsByPostId(post_id);
    return await Promise.all(
      comments.map((item) => {
        return this.commentModel.findById(item);
      })
    );
  }

  async deleteComment({ user_id, group_id, comment_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const comment = await this.commentTopostModel.findCommentByCommentId(comment_id);
    if (user_id !== comment.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    return await this.commentModel.delete(comment_id);
  }

  async postReply({ user_id, group_id, parentComment_id, text }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const postReply = await this.commentModel.create(text);
    const comment_id = postReply.comment_id;
    return await this.replyModel.create({ comment_id, parentComment_id, user_id });
  }

  async getReplies({ user_id, group_id, comment_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const replies = await this.replyModel.getRepliesByCommentId(comment_id);
    return await Promise.all(
      replies.map((item) => {
        return this.commentModel.findById(item);
      })
    );
  }

  async deleteReply({ user_id, group_id, reply_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    const reply = await this.replyModel.findReplyByReplyId(reply_id);
    if (user_id !== reply.user_id) {
      throw new AppError("Bad Request", 400, "삭제 권한이 없습니다.");
    }
    return await this.commentModel.delete(reply_id);
  }

  async postLike({ user_id, group_id, post_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    return await this.likeModel.postLike({ user_id, post_id });
  }

  async getPostLike({ user_id, group_id, post_id }) {
    await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
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
}

module.exports = new groupService(groupModel, groupTouserModel, postModel, postToboardModel, commentModel, commentTopostModel, replyModel, likeModel);
