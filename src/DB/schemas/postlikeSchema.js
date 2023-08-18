const { Schema } = require("mongoose");

const likeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  albumId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = likeSchema;
