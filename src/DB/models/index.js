const userModel = require("./UserModel");
const groupModel = require("./GroupModel");
const groupTouserModel = require("./GroupToUser");
const postModel = require("./PostModel");
const postToboardModel = require("./PostToBoard");
const commentModel = require("./CommentModel");
const commentTopostModel = require("./CommentToPost");
const replyModel = require("./ReplyModel");

module.exports = {
  userModel,
  groupModel,
  groupTouserModel,
  postModel,
  postToboardModel,
  commentModel,
  commentTopostModel,
  replyModel,
};
