const { Schema } = require("mongoose");

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isRecruit: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: String,
      default: "",
    },
    maxMember: {
      type: Number,
      default: 10,
    },
    meeting: {
      type: Number,
      default: 0,
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = GroupSchema;
