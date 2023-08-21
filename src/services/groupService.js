const { groupModel, groupTouserModel } = require("../db/models");
const AppError = require("../misc/AppError");

class groupService {
  constructor(groupModel, groupTouserModel) {
    this.groupModel = groupModel;
    this.groupTouserModel = groupTouserModel;
  }

  async postGroup({ user_id, name, profile, maxMember, tag, duration }) {
    const group = await this.groupModel.findByName(name);
    if (group) {
      throw new AppError("Bad Request", 400, "이미 존재하는 모임명입니다.");
    }
    const createGroup = await this.groupModel.create({ user_id, name, profile, maxMember, tag, duration });
    const group_id = createGroup.group_id;
    const joinGroup = await this.groupTouserModel.joinGroup({ user_id, group_id });
    return { createGroup, joinGroup };
  }

  async getGroup({ group_id }) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new AppError("Bad Request", 400, "존재하지 않는 그룹입니다.");
    }
    return group;
  }

  async getAllGroups() {
    return await this.groupModel.getAllGroups();
  }
}

module.exports = new groupService(groupModel, groupTouserModel);
