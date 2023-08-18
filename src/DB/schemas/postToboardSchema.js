const { Schema } = require("mongoose");

const postToboardSchema = new Schema(
  {
    groupboardId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    boardId: {
      type: String,
      default: "",
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
