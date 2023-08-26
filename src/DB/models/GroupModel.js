const { model } = require("mongoose");
const { GroupSchema, tagsSchema, groupSearchSchema, grouplikeSchema } = require("../schemas");

const Group = model("groups", GroupSchema);
const Tag = model("tags", tagsSchema);
const GroupSearch = model("groupsearchs", groupSearchSchema);
const Like = model("grouplikes", grouplikeSchema);

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

  async getAllGroups(groups) {
    return await Promise.all(
      groups.map(async (item) => {
        const group = await Group.findOne({ group_id: item });
        const tags = await Tag.find({ group_id: item });
        const cleantags = tags.map((item) => item.tag);
        const search = await GroupSearch.findOne({ group_id: item });
        const likes = await Like.find({ group_id: item });
        return { group_id: item, name: group.name, isRecruit: group.isRecruit, profile: group.profile, leader: group.leader, introduction: group.introduction, place: group.place, createdAt: group.createdAt, tags: cleantags, search, like: likes.length };
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

  async getGroupByCondition(condition) {
    const groups = await GroupSearch.find(condition);
    return groups.map((item) => item.group_id);
  }
}

module.exports = new GroupModel();
