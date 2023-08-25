const { Router } = require("express");
const { asyncHandler } = require("../middlewares");
// const upload = require("../misc/multer");

const router = Router();

// router.post(
//   "/",
//   upload.single("pic"),
//   asyncHandler(async (req, res, next) => {
//     console.log(req.file);
//   })
// );

router.get("/", (req, res, next) => {
  res.send("파일 다운로드 완료");
});

module.exports = router;
