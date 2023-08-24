const { postModel, postToboardModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class postService {
  constructor(postModel, postToboardModel) {
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
  }

  async getAllPosts() {
    const posts = await this.postModel.getAllPosts();
    return posts.map((item) => {
      return { title: item.title, content: item.content, createdAt: item.createdAt, updatedAt: item.updatedAt, post_id: item.post_id };
    });
  }

  async putPost({ post_id, title, content }) {
    const post = await this.postModel.update({ post_id, title, content });
    return { title: post.title, content: post.content, createdAt: post.createdAt, updatedAt: post.updatedAt, post_id: post.post_id };
  }

  async deletePost(post_id) {
    const deletePost = await this.postModel.delete(post_id);
    const deletePostFromGroup = await this.postToboardModel.delete(post_id);
    return { deletePost: deletePost, deletePostFromGroup: deletePostFromGroup };
  }
}

module.exports = new postService(postModel, postToboardModel);
