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

  async getOldestGroups() {
    const groups = await Group.find();
    return groups.map((item) => {
      return { name: item.name, isRecruit: item.isRecruit, profile: item.profile, maxMember: item.maxMember, leadar: item.leader, createdAt: item.createdAt, group_id: item.group_id };
    });
  }

  async getLatestGroups() {
    const groups = await Group.find().sort({ createdAt: -1 });
    return groups.map((item) => {
      return { name: item.name, isRecruit: item.isRecruit, profile: item.profile, maxMember: item.maxMember, leadar: item.leader, createdAt: item.createdAt, group_id: item.group_id };
    });
  }

  async delete(group_id) {
    return await Group.deleteOne({ group_id: group_id });
  }
}

module.exports = new GroupModel();
