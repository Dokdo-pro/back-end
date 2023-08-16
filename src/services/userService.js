const { userModel } = require("../db/models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../misc/utils");
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
}

module.exports = new userService(userModel);
