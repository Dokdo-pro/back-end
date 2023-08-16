const { userModel } = require("../db/models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../misc/utils");
const bcrypt = require("bcrypt");
const AppError = require("../misc/AppError");

class userService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async postUser(userInfo) {
    const { id, password, name, email, address, profile } = userInfo;
    const user = await this.userModel.findByEmail(email);
    if (user) {
      if (!user.isActivated) {
        throw new AppError("Bad Request", 400, "사용할 수 없는 ID입니다.");
      }
      throw new AppError("Bad Request", 400, "이미 사용중인 이메일입니다.");
    }
    const hashedPW = await hashPassword(password);
    const newUser = await this.userModel.create({ id, password: hashedPW, name, email, address, profile });
    return newUser;
  }

  async getUserToken(userinfo) {
    const { id, password } = userinfo;
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new AppError("Bad Request", 400, "가입되지 않은 ID입니다.");
    }
    if (!user.isActivated) {
      throw new AppError("Bad Request", 400, "사용할 수 없는 ID입니다.");
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Bad Request", 400, "비밀번호를 확인해 주세요.");
    }
    const role = user.role;
    const userId = user._id.toString();
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId, role }, secretKey, { expiresIn: "1h" });
    return { token };
  }
}

module.exports = new userService(userModel);
