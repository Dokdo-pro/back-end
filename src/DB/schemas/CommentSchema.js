const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");

const CommentSchema = new Schema(
  {
    comment_id: {
      type: Number,
      unique: true,
    },
    author: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    post: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) } }
);

CommentSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: "comment_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .then(function (counter) {
      doc.comment_id = counter.seq;
      next();
    })
    .catch(function (error) {
      return next(error);
    });
});

module.exports = CommentSchema;
