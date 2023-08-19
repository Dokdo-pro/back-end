const jwt = require("jsonwebtoken");
const AppError = require("../misc/AppError");

module.exports = (req, res, next) => {
  try {
    const Token = req.cookies.loginToken;
    if (!Token || Token === "null") {
      throw new AppError("Unauthorized", 401, "로그인 후 사용해주세요.");
    }
    jwt.verify(Token.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (decoded.role !== "admin") {
        throw new AppError("Forbidden", 403, "접근 권한이 없습니다.");
      }
    });
    next();
  } catch (error) {
    next(error);
  }
};
