const { model } = require("mongoose");
const { groupTouserSchema } = require("../schemas");
const AppError = require("../../misc/AppError");

const GroupToUser = model("groupTousers", groupTouserSchema);

class groupTouserModel {
  async joinGroup({ user_id, group_id }) {
    return await GroupToUser.create({ user_id: user_id, group_id: group_id });
  }

  async getGroup(user_id) {
    const groups = await GroupToUser.find({ user_id: user_id });
    const group_ids = groups.map((item) => {
      return item.group_id;
    });
    return group_ids;
  }

  async findUserAndGroupById({ user_id, group_id }) {
    const userTogroup = await GroupToUser.findOne({ user_id: user_id, group_id, group_id });
    if (!userTogroup) {
      throw new AppError("Bad Request", 400, "모임에 가입하지 않은 사용자입니다.");
    }
    return userTogroup;
  }

  async deleteUser({ user_id, group_id }) {
    return await GroupToUser.deleteOne({ user_id: user_id, group_id: group_id });
  }

  async getGroupMember(group_id) {
    return await GroupToUser.find({ group_id: group_id });
  }
}

module.exports = new groupTouserModel();
