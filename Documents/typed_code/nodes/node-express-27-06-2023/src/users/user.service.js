const shortid = require("shortid");
const path = require("path");
const { format } = require("date-fns");
const fsPromises = require("fs").promises;
require("dotenv").config();
const {
  generateSalt,
  generateHashPassword,
  comparePassword,
} = require("../utils/auth");
const {
  jwtShortAccessToken,
  jwtRefreshToken,
  jwtVerifyToken,
} = require("../utils/index");
const userData = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const ROLES_LIST = require("../config/roles_list");

const secretAccess = process.env.ACCESS_TOKEN_SECRET;
const secretRefresh = process.env.REFRESH_TOKEN_SECRET;

const getAllUsers = async (res) => {
  res.json(userData.users);
};

const handleRegisterUser = async (req, res) => {
  const { firstname, lastname, age, phone, username, password } = req.body;
  if (!username || !password || !phone) {
    return res
      .status(400)
      .json({ message: `username, password and phone number are required!` });
  }
  const duplicateUser = await checkDuplicateUser(username);
  if (duplicateUser) {
    return res.sendStatus(409); //stand as Conflict
  }
  if (password.length <= 5) {
    return res
      .status(400)
      .json({ message: "Password most be greater than 5 characters!" });
  }

  try {
    const salt = await generateSalt();
    const passwordHash = await generateHashPassword(password, salt);
    const userPassword = `${salt}-${passwordHash}`;
    const newUser = {
      id: shortid.generate(),
      firstname: firstname,
      lastname: lastname,
      age: age,
      phone: phone,
      username: username,
      password: userPassword,
      roles: { User: 2013 },
      createdAt: format(new Date(), "dd-MM-yyyy|HH:mm:ss"),
    };
    userData.setUser([...userData.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userData.users)
    );
    console.log("userData: ", userData.users);
    return res.status(201).json({ message: `New username ${username} added!` });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return res.status(500).json({ message: `error: ${error.message}` });
  }
};

const handleLoginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: `username and password are required!` });
  }
  // check that the username already exist
  const foundUser = userData.users.find(
    (person) => person.username === username
  );
  if (!foundUser) {
    return res.status(401).json({ message: "username not found" }); // unauthorized
  }
  const passwordHash = foundUser.password.split("-")[1];
  console.log("foundUser ", foundUser);
  const match = await comparePassword(password, passwordHash);
  if (!match) {
    //console.log("not match ");
    return res.status(401).json({ message: "password not match" });
  }
  // create a jwts
  //console.log(`secretAccess = ${secretAccess}`);
  //console.log(`secretRefresh = ${secretRefresh}`);
  const roles = Object.values(foundUser?.roles);
  const accessToken = await jwtShortAccessToken(
    foundUser.id,
    roles,
    secretAccess
  );
  const refreshToken = await jwtRefreshToken(
    foundUser.userId,
    roles,
    secretRefresh
  );

  //saving refreshtoken with currentUser
  const otherUsers = userData.users.filter(
    (person) => person.username !== foundUser.username
  );
  const currentUser = { ...foundUser, refreshToken };
  console.log("currentUser ", currentUser);
  //
  try {
    //update users with refreshToken generated
    userData.setUser([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userData.users)
    );
    console.log("currentUser detail be4 ", currentUser);
    delete currentUser.password;
    console.log("currentUser detail after delete password ", currentUser);
    //maxAge: 24 * 60 * 60 * 1000,
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      })
      .json({ success: true, accessTk: accessToken });
  } catch (error) {
    console.log(`Error.LOGIN: ${error.message}`);
    return res.status(401).json({ message: `error: ${error.message}` });
  }
  //return res.status(200).json(accessToken).cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
};

const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  console.log("refreshToken cookie: ", refreshToken);
  if (!refreshToken) return res.sendStatus(401);
  const foundUser = userData.users.find(
    (person) => person.refreshToken === cookie?.refreshToken
  );
  if (!foundUser) {
    return res.sendStatus(403); // forbidden
  }
  // evaluate jwt
  try {
    const accessToken = await jwtVerifyToken(
      refreshToken,
      secretRefresh,
      secretAccess
    );
    return res.status(200).json({ success: true, accessTk: accessToken });
  } catch (error) {
    console.log("ERROR.VERIFY", error.message);
    return res.sendStatus(500);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Id cannot be empty");
  }
  const user = userData.users.find((user) => user.id == id);
  if (!user) {
    return res.status(400).json({ message: `User with id: ${id} not found!` });
  }
  return res.status(200).json(user);
};

const handleAddRoles = async (req, res) => {
  const { username } = req.body;
  let { roles } = req.body;
  if (!username || !roles) {
    return res
      .status(400)
      .json({ message: `username and roles are required!` });
  }

  const foundUser = userData.users.find(
    (person) => person.username === username
  );
  if (!foundUser) {
    return res.status(401).json({ message: "username not found" }); // unauthorized
  }
  userRoles = {};
  roles.map((role) => {
    const roleList = ROLES_LIST[role];
    if (!roleList) {
      return res.status(401).json({ message: "roles not include" });
    } else {
      userRoles[role] = ROLES_LIST[role];
    }
  });

  const otherUsers = userData.users.filter(
    (person) => person.username !== username
  );
  roles = userRoles;
  const currentUser = { ...foundUser, roles };
  try {
    userData.setUser([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userData.users)
    );
    //console.log("currentUser ", currentUser);
    return res.status(200).json({ message: "user roles added!" });
  } catch (error) {
    console.log(`Error.AddROLES: ${error.message}`);
    return res.status(401).json({ message: `error: ${error.message}` });
  }
};

const handleLogoutUser = async (req, res) => {
  // as a fullstack or front-end developer, also delete the accessToken

  const cookie = req.cookies;
  if (!cookie?.refreshToken) return res.sendStatus(204); // No content
  console.log("refretk: ", cookie?.refreshToken);
  try {
    // is refreshToken in db?
    const foundUser = userData.users.find(
      (person) => person.refreshToken === cookie?.refreshToken
    );
    if (!foundUser) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // delete refreshtoken in the data
    const otherUsers = userData.users.filter(
      (person) => person.refreshToken !== foundUser.refreshToken
    );
    const currentUser = { ...foundUser, refreshToken: "" };
    console.log("currentUser: ", currentUser);
    userData.setUser([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userData.users)
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    console.log("cookies::: ", res.cookies);
    return res.sendStatus(204);
  } catch (error) {
    console.log("ERROR.LOGOUT", error.message);
    return res.sendStatus(500);
  }
};

const checkDuplicateUser = async (username) => {
  isDuplicate = false;
  if (username) {
    const data = userData.users.find((user) => user.username == username);
    if (data) {
      isDuplicate = true;
      return isDuplicate;
    } else {
      isDuplicate = false;
      return isDuplicate;
    }
  } else {
    return;
  }
};

module.exports = {
  getAllUsers,
  handleRegisterUser,
  handleLoginUser,
  getUserById,
  handleRefreshToken,
  handleLogoutUser,
  handleAddRoles,
};
