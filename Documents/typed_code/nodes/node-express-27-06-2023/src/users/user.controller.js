const {
  getAllUsers,
  getUserById,
  handleRegisterUser,
  handleLoginUser,
  handleRefreshToken,
  handleLogoutUser,
  handleAddRoles,
} = require("./user.service");

const GetAllUsers = async (req, res) => {
  return await getAllUsers(res);
};

const GetUser = async (req, res) => {
  return await getUserById(req, res);
};

const AddNewUser = async (req, res) => {
  return await handleRegisterUser(req, res);
};

const LoginUser = async (req, res) => {
  return await handleLoginUser(req, res);
};

const HandleRefreshToken = async (req, res) => {
  return await handleRefreshToken(req, res);
};

const HandleAddRoles = async ( req, res) => {
  return await handleAddRoles(req, res);
}

const LogoutUser = async (req, res) => {
  return await handleLogoutUser(req, res);
};

module.exports = {
  GetAllUsers,
  GetUser,
  AddNewUser,
  LoginUser,
  LogoutUser,
  HandleRefreshToken,
  HandleAddRoles,
};
