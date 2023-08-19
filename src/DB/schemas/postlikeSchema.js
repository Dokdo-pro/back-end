const { Schema } = require("mongoose");

const postlikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = postlikeSchema;
