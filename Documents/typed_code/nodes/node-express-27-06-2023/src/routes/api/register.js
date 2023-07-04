const express = require('express');
const registerRouter = express.Router();
const { AddNewUser } = require('../../users/user.controller');

registerRouter
    .route('/')
    .post(AddNewUser);

module.exports = registerRouter;