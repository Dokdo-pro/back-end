const { userModel, groupTouserModel, groupModel } = require("../db/models");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../misc/utils");
const bcrypt = require("bcrypt");
const AppError = require("../misc/AppError");

class userService {
  constructor(userModel, groupTouserModel, groupModel) {
    this.userModel = userModel;
    this.groupTouserModel = groupTouserModel;
    this.groupModel = groupModel;
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
    const user_id = user.user_id;
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ user_id, role }, secretKey, { expiresIn: "1h" });
    const isAdmin = role === "admin" ? true : false;
    return { token, isAdmin };
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

  async deleteUser(user_id) {
    return await this.userModel.deleteUser(user_id);
  }

  async getUser(user_id) {
    const getUser = await this.userModel.findUser(user_id);
    const getGroup = await this.groupTouserModel.getGroup(user_id);
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

  async putPassword({ password, user_id }) {
    const hashedPW = await hashPassword(password);
    const updatePassword = await userModel.findByIdAndUpdatePassword({ user_id, hashedPW });
    return "비밀번호 변경 완료";
  }

  async putUser({ user_id, name, address, profile }) {
    return userModel.findByIdAndUpdateInfo({ user_id, name, address, profile });
  }

  async joinGroup({ user_id, group_id }) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new AppError("Bad Request", 400, "존재하지 않는 그룹입니다.");
    } else if (!group.isRecruit) {
      throw new AppError("Bad Request", 400, "모집중인 모임이 아닙니다.");
    } else if (groupTouserModel.findUserAndGroupById({ user_id, group_id })) {
      throw new AppError("Bad Request", 400, "이미 가입한 그룹입니다.");
    }
    return groupTouserModel.joinGroup({ user_id, group_id });
  }
}

module.exports = new userService(userModel, groupTouserModel, groupModel);
