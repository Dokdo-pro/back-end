const { model } = require("mongoose");
const { GroupSchema, tagsSchema, groupSearchSchema } = require("../schemas");

const Group = model("groups", GroupSchema);
const Tag = model("tags", tagsSchema);
const GroupSearch = model("groupsearchs", groupSearchSchema);

class GroupModel {
  async findByName(name) {
    return await Group.findOne({ name });
  }

  async create({ user_id, name, introduction, tag, place, location, age, genre, day }) {
    const group = await Group.create({ name, introduction, place, leader: user_id });
    const group_id = group.group_id;
    const tags = await Promise.all(
      tag.map(async (item) => {
        return await Tag.create({ group_id, tag: item });
      })
    );
    const searches = await GroupSearch.create({ group_id, location, age, genre, day });
    return { group, tags, searches };
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

  async update({ group_id, name, introduction }) {
    return await Group.findOneAndUpdate({ group_id }, { $set: { name, introduction } }, { new: true });
  }

  async updateTags({ group_id, tags }) {
    return await Promise.all(
      tags.map(async (item) => {
        const tag = await Tag.findOneAndUpdate({ group_id }, { $set: { tag: item } }, { new: true });
        return tag.tag;
      })
    );
  }

  async getSearches(group_id) {
    return await GroupSearch.find({ group_id });
  }

  async updateSearch({ group_id, place, location, day, genre, age }) {
    return await GroupSearch.findOneAndUpdate({ group_id }, { $set: { place, location, day, genre, age } }, { new: true });
  }
}

module.exports = new GroupModel();
