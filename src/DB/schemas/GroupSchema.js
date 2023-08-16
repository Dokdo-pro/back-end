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
      type: boolean,
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
    posts: {
      type: Schema.Types.Array,
      posts: {
        type: Schema.Types.ObjectId,
        ref: "Grouppost",
      },
      default: [],
    },
    meeting: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date.getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = GroupSchema;
