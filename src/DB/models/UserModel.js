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
  async findByName(name) {
    return await User.findOne({ name: name });
  }
  async deleteUser(user_id) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { isActivated: false } });
  }
  async findUser(user_id) {
    return await User.findOne({ user_id });
  }
  async findByIdAndUpdateInfo({ user_id, hashedPW, name, profilePic, introduction, phone, gender }) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { password: hashedPW, name, profilePic, introduction, phone, gender } });
  }
}

module.exports = new UserModel();
