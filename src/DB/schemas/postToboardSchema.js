const { Schema } = require("mongoose");

const postToboardSchema = new Schema(
  {
    groupboardId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    boardName: {
      type: String,
      default: null,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = postToboardSchema;
