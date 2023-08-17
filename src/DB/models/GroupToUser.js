const { model } = require("mongoose");
const { groupTouserSchema } = require("../schemas");

const GroupToUser = model("groupTousers", groupTouserSchema);

class groupTouserModel {
  async joinGroup({ userId, groupId }) {
    return await GroupToUser.create({ userId: userId, groupId: groupId });
  }
  async getGroup(userId) {
    const groups = await GroupToUser.find({ userId: userId });
    const groupIds = groups.map((item) => {
      return item.groupId.toString();
    });
    return groupIds;
  }
}

module.exports = new groupTouserModel();
