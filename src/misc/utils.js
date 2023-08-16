const bcyrpt = require("bcrypt");

function buildResponse(data, errorMessage) {
  return {
    error: errorMessage ?? null,
    data,
  };
}

hashPassword = async (pw) => {
  const saltRounds = 10;
  const salt = await bcyrpt.genSalt(saltRounds);
  return await bcyrpt.hash(pw, salt);
};

module.exports = {
  buildResponse,
  hashPassword,
};
