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
  async deleteUser(userId) {
    return await User.findByIdAndUpdate(userId, {
      isActivated: false,
    });
  }
  async findUser(userId) {
    const user = await User.findById(userId);
    const { name, email, address, group, profile } = user;
    return { name: name, email: email, address: address, group: group, profile: profile };
  }
  async findByIdAndUpdatePassword({ userId, hashedPW }) {
    return await User.findByIdAndUpdate(userId, { password: hashedPW });
  }
  async findByIdAndUpdateInfo({ userId, name, address, profile }) {
    const newInfo = await User.findByIdAndUpdate(userId, { name, address, profile });
    return { newName: newInfo.name, newAddress: newInfo.address, newProfile: newInfo.profile };
  }
}

module.exports = new UserModel();
