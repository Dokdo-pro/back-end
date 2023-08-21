const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");
const UserSchema = new Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },
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
    isActivated: {
      type: Boolean,
      default: true,
    },
    profilePic: {
      type: String,
      default: "",
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
