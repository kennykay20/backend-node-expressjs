const express = require('express');
const rolesRouter = express.Router();
const { HandleAddRoles } = require('../../users/user.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles');

rolesRouter
    .route('/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), HandleAddRoles);

module.exports = rolesRouter;