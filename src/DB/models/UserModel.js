const { model } = require("mongoose");
const { UserSchema } = require("../schemas");

const User = model("users", UserSchema);

class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email: email });
  }
  async create(user) {
    return await User.create(user);
  }
  async findById(id) {
    return await User.findOne({ _id: id });
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
    const user = await User.findOne({ _id: userId });
    const { name, email, address, group, profile } = user;
    console.log(user);
    return { name: name, email: email, address: address, group: group, profile: profile };
  }
}

module.exports = new UserModel();
