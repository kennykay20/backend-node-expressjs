const bcrypt = require("bcrypt");

const generateSalt = async () => {
  const saltRounds = 10;
  return await bcrypt.genSalt(saltRounds);
};

const generateHashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashPassword) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

module.exports = { generateSalt, generateHashPassword, comparePassword };
