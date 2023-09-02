const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: ["áá³áá³ááµá«áá£áº 2023-09-02 áá©áá¥á« 11.59.20-1693623628092.png"],
    },
    post_id: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

PostSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: "post_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .then(function (counter) {
      doc.post_id = counter.seq;
      next();
    })
    .catch(function (error) {
      return next(error);
    });
});

module.exports = PostSchema;
