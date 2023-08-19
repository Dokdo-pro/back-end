const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");

const GroupSchema = new Schema(
  {
    group_id: {
      type: Number,
      unique: true,
    },
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
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

GroupSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: "group_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .then(function (counter) {
      doc.group_id = counter.seq;
      next();
    })
    .catch(function (error) {
      return next(error);
    });
});

module.exports = GroupSchema;
