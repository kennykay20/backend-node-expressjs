const express = require('express');
const loginRouter = express.Router();
const { LoginUser } = require('../../users/user.controller');


loginRouter
    .route('/')
    .post(LoginUser);

module.exports = loginRouter;