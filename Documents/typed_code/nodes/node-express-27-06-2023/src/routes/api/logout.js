const express = require('express');
const logoutRouter = express.Router();
const { LogoutUser } = require('../../users/user.controller');

logoutRouter
    .route("/")
    .get(LogoutUser);


module.exports = logoutRouter;