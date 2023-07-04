const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  //console.log(`authHeader: ${authHeader}`);
  //console.log('reqss b4 :: ',req);
  const token = authHeader.split(" ")[1];
  const secret = process.env.ACCESS_TOKEN_SECRET;
  try {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded?.UserInfo) return res.sendStatus(403);
      req.username = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    });
    console.log('reqss after :: ',req.roles);
    console.log('reqss after :: ',req.username);
  } catch (error) {
    console.log("ERROR.VERIFY.TOKEN");
    res.json({ message: `ERROR.verify.token: ${error.message}` });
  }
};

module.exports = verifyJWT;
