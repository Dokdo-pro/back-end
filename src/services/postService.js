const { postModel, postToboardModel, albumToboardModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class postService {
  constructor(postModel, postToboardModel, albumToboardModel) {
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
    this.albumToboardModel = albumToboardModel;
  }

  async getAllPosts() {
    return await this.postToboardModel.getAllPosts();
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

  async getAllAlbums() {
    return await this.albumToboardModel.getAllAlbums();
  }
}

module.exports = new postService(postModel, postToboardModel, albumToboardModel);
