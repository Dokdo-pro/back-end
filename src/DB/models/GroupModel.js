const { model } = require("mongoose");
const { GroupSchema } = require("../schemas");

const Group = model("groups", GroupSchema);

class GroupModel {
  async findByName(name) {
    return await Group.findOne({ name });
  }
  async create({ userId, name, profile, maxMember, tag, duration }) {
    return await Group.create({ name, profile, maxMember, tag, duration, leader: userId });
  }
}

module.exports = new GroupModel();
