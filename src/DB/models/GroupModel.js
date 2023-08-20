const { model } = require("mongoose");
const { GroupSchema } = require("../schemas");

const Group = model("groups", GroupSchema);

class GroupModel {
  async findByName(name) {
    return await Group.findOne({ name });
  }
  async create({ user_id, name, profile, maxMember, tag, duration }) {
    return await Group.create({ name, profile, maxMember, tag, duration, leader: user_id });
  }
  async findById(group_id) {
    return await Group.findOne({ group_id: group_id });
  }
}

module.exports = new GroupModel();
