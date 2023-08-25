const { model } = require("mongoose");
const { GroupSchema, tagsSchema } = require("../schemas");

const Group = model("groups", GroupSchema);
const Tag = model("tags", tagsSchema);

class GroupModel {
  async findByName(name) {
    return await Group.findOne({ name });
  }

  async create({ user_id, name, profile, maxMember, tag, duration }) {
    const group = await Group.create({ name, profile, maxMember, duration, leader: user_id });
    const group_id = group.group_id;
    const tags = await Promise.all(
      tag.map(async (item) => {
        return await Tag.create({ group_id, tag: item });
      })
    );
    return { group, tags };
  }

  async findById(group_id) {
    return await Group.findOne({ group_id: group_id });
  }

  async getTags(group_id) {
    const tags = await Tag.find({ group_id });
    return tags.map((item) => item.tag);
  }

  async getOldestGroups() {
    const groups = await Group.find();
    return await Promise.all(
      groups.map(async (item) => {
        let tags = await Tag.find({ group_id: item.group_id });
        tags = tags.map((item) => item.tag);
        return { name: item.name, isRecruit: item.isRecruit, profile: item.profile, maxMember: item.maxMember, leadar: item.leader, createdAt: item.createdAt, group_id: item.group_id, tags };
      })
    );
  }

  async getLatestGroups() {
    const groups = await Group.find().sort({ createdAt: -1 });
    return await Promise.all(
      groups.map(async (item) => {
        let tags = await Tag.find({ group_id: item.group_id });
        tags = tags.map((item) => item.tag);
        return { name: item.name, isRecruit: item.isRecruit, profile: item.profile, maxMember: item.maxMember, leadar: item.leader, createdAt: item.createdAt, group_id: item.group_id, tags };
      })
    );
  }

  async delete(group_id) {
    return await Group.deleteOne({ group_id: group_id });
  }

  async update({ group_id, name, profile, maxMember }) {
    return await Group.findOneAndUpdate({ group_id }, { $set: { name, profile, maxMember } }, { new: true });
  }

  async updateTags({ group_id, tags }) {
    return await Promise.all(
      tags.map(async (item) => {
        const tag = await Tag.findOneAndUpdate({ group_id }, { $set: { tag: item } }, { new: true });
        return tag.tag;
      })
    );
  }
}

module.exports = new GroupModel();
