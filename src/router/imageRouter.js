const { Router } = require("express");
const { asyncHandler } = require("../middlewares");
const AppError = require("../misc/AppError");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../pic");
  },
  filename: function (req, file, cb) {
    cb(nul, file.originalname);
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return new AppError("Bad Request", 400, "PNG, JPG 파일만 업로드 가능합니다.");
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post("/upload", upload.single("image"), (req, res, next) => {
  res.json("이미지 업로드 완료");
});

router.get("/:img", (req, res, next) => {
  res.sendFile(__dirname + "/");
});

module.exports = router;
