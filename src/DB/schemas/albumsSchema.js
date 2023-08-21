const { Schema } = require("mongoose");

const albumsSchema = new Schema(
  {
    group_id: {
      type: Number,
      required: true,
    },
    album_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = albumsSchema;
