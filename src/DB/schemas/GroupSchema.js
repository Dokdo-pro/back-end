const { Schema } = require("mongoose");

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    memberNum: {
      type: Number,
      default: 1,
    },
    isRecruit: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: String,
      default: "",
    },
    like: {
      type: Number,
      default: 0,
    },
    maxMember: {
      type: Number,
      default: 10,
    },
    tag: {
      type: [String],
      default: [],
    },
    duration: {
      type: Date,
      default: "",
    },
    meeting: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = GroupSchema;
