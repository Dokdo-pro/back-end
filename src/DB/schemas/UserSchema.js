const { Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    group: {
      type: Schema.Types.Array,
      group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
      default: [],
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    likedGroup: {
      type: Schema.Types.Array,
      likedGroup: {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = UserSchema;
