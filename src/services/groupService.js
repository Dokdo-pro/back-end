const { groupModel, groupTouserModel } = require("../db/models");
const jwt = require("jsonwebtoken");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
  }
  async postGroup({ userId, name, profile, maxMember, tag, duration }) {
    const group = await this.groupModel.findByName(name);
    if (group) {
      throw new AppError("Bad Request", 400, "이미 존재하는 모임명입니다.");
    }
    const createGroup = await this.groupModel.create({ userId, name, profile, maxMember, tag, duration });
    const groupId = createGroup._id;
    const joinGroup = await this.groupTouserModel.joinGroup({ userId, groupId });
    return { createGroup, joinGroup };
  }
}

module.exports = new groupService(groupModel, groupTouserModel);
