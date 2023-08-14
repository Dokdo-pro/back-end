const { Schema } = require("mongoose");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    hashtag: {
      type: [String],
      default: [],
    },
    isReport: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date.getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = PostSchema;
