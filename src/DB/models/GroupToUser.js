const { model } = require("mongoose");
const { groupTouserSchema } = require("../schemas");

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
}

module.exports = new groupTouserModel();
