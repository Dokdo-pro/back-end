const { Schema } = require("mongoose");

const postToboardSchema = new Schema(
  {
    group_id: {
      type: Number,
      default: null,
    },
    boardName: {
      type: String,
      default: null,
    },
    post_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = postToboardSchema;
