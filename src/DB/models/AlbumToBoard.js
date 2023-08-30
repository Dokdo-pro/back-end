const { model } = require("mongoose");
const { albumToboardSchema } = require("../schemas");
const AppError = require("../../misc/AppError");

const AlbumToBoard = model("albumToboards", albumToboardSchema);

class AlbumToBoardModel {
  async create({ post_id, user_id, group_id }) {
    return await AlbumToBoard.create({ post_id: post_id, group_id: group_id, user_id: user_id });
  }
  async findAlbumsByGroupId({ group_id, limit, offset }) {
    return await AlbumToBoard.find({ group_id: group_id }).limit(limit).skip(offset);
  }
  async findAlbumsByUserId({ user_id, limit, offset }) {
    return await AlbumToBoard.find({ user_id: user_id }).limit(limit).skip(offset);
  }
  async findAlbumByPostId(post_id) {
    return await AlbumToBoard.findOne({ post_id: post_id });
  }
  async delete(post_id) {
    return await AlbumToBoard.deleteOne({ post_id: post_id });
  }
  async getAllAlbums() {
    return await AlbumToBoard.find();
  }
}

module.exports = new AlbumToBoardModel();
