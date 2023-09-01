const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");
const UserSchema = new Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      defalut: "",
    },
    email: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    profilePic: {
      type: String,
      default: "_2a0a1793-5279-44d0-be24-37dd2bf7e866-1693608814602.jpeg",
    },
    introduction: {
      type: String,
      default: "안녕하세요.",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

UserSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: "user_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .then(function (counter) {
      doc.user_id = counter.seq;
      next();
    })
    .catch(function (error) {
      return next(error);
    });
});

module.exports = UserSchema;
