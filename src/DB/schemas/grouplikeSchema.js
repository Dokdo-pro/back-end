const { Schema } = require("mongoose");

const grouplikeSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
  },
  post_id: {
    type: Number,
    required: true,
  },
});

module.exports = grouplikeSchema;
