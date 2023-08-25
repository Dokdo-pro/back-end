const multer = require("multer"); //multer 패키지 참조

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const uploadProfile = multer({ storage: profileStorage });

module.exports = { uploadProfile };
