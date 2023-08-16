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
    return await User.findOne({ name });
  }
  async deleteUser(userId) {
    return await User.findByIdAndUpdate(userId, {
      isActivated: false,
    });
  }
}

module.exports = new UserModel();
