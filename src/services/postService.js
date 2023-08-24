const { postModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class postService {
  constructor(postModel) {
    this.postModel = postModel;
  }

  async getAllPosts() {
    const posts = await this.postModel.getAllPosts();
    return posts.map((item) => {
      return { title: item.title, content: item.content, createdAt: item.createdAt, updatedAt: item.updatedAt, post_id: item.post_id };
    });
  }
}

module.exports = new postService(postModel);
