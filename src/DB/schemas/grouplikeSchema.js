const { Schema } = require("mongoose");

const grouplikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
});

module.exports = grouplikeSchema;
