const { Schema } = require("mongoose");

const postTohashtagSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    hashtag: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = postTohashtagSchema;
