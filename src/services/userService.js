const { userModel, groupTouserModel } = require("../db/models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../misc/utils");
const bcrypt = require("bcrypt");
const AppError = require("../misc/AppError");

class userService {
  constructor(userModel, groupTouserModel) {
    this.userModel = userModel;
    this.groupTouserModel = groupTouserModel;
  }

  async postUser(userInfo) {
    const { id, password, name, email, address, profile } = userInfo;
    const user = await this.userModel.findByEmail(email);
    if (user) {
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

  async isDuplicatedId(id) {
    const user = await userModel.findById(id);
    if (user) {
      return false;
    }
    return true;
  }

  async isDuplicatedName(name) {
    const user = await userModel.findByName(name);
    if (user) {
      return false;
    }
    return true;
  }

  async deleteUser(userId) {
    return await this.userModel.deleteUser(userId);
  }

  async getUser(userId) {
    const getUser = await this.userModel.findUser(userId);
    const getGroup = await this.groupTouserModel.getGroup(userId);
    return { ...getUser, group: getGroup };
  }

  async getUserId(email) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new AppError("Bad Request", 400, "가입되지 않은 이메일입니다.");
    } else if (!user.isActivated) {
      throw new AppError("Bad Request", 400, "탈퇴한 회원입니다.");
    }
    return user.id;
  }

  async putPassword({ password, userId }) {
    const hashedPW = await hashPassword(password);
    const updatePassword = await userModel.findByIdAndUpdatePassword({ userId, hashedPW });
    return "비밀번호 변경 완료";
  }

  async putUser({ userId, name, address, profile }) {
    return userModel.findByIdAndUpdateInfo({ userId, name, address, profile });
  }
}

module.exports = new userService(userModel, groupTouserModel);
