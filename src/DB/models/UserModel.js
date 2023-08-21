const { model } = require("mongoose");
const { UserSchema } = require("../schemas");

const User = model("users", UserSchema);

class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  async create(user) {
    return await User.create(user);
  }
  async findById(id) {
    return await User.findOne({ id });
  }
  async findByName(name) {
    return await User.findOne({ name: name });
  }
  async deleteUser(user_id) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { isActivated: false } });
  }
  async findUser(user_id) {
    const user = await User.findOne({ user_id });
    const { name, email, address, group, profile } = user;
    return { name: name, email: email, address: address, group: group, profile: profile };
  }
  async findByIdAndUpdatePassword({ user_id, hashedPW }) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { password: hashedPW } });
  }
  async findByIdAndUpdateInfo({ user_id, name, address, profile }) {
    const newInfo = await User.findOneAndUpdate({ user_id: user_id }, { $set: { name, address, profile } });
    return { newName: newInfo.name, newAddress: newInfo.address, newProfile: newInfo.profile };
  }
}

module.exports = new UserModel();
