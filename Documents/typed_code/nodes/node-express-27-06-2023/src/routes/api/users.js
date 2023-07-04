const express = require('express');
const userRouter = express.Router();
const { GetAllUsers, GetUser } = require('../../users/user.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles');

userRouter
    .route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), GetAllUsers);

userRouter
    .route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), GetUser);

module.exports = userRouter;