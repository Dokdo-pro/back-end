const { Schema } = require("mongoose");

const GroupPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
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

module.exports = GroupPostSchema;
