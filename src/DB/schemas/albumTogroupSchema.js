const { Schema } = require("mongoose");

const albumTogroupSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date.getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = albumTogroupSchema;
