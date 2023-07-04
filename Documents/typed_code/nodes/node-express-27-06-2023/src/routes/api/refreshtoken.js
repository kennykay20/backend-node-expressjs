const express = require('express');
const refreshTkRouter = express.Router();
const { HandleRefreshToken } = require('../../users/user.controller');

refreshTkRouter
    .route("/")
    .get(HandleRefreshToken);


module.exports = refreshTkRouter;
