const express = require('express');
const empRouter = express.Router();
const { GetAllEmployees, AddNewEmployee, GetEmployeeById } = require('../../employees/employee.controller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles');

empRouter
    .route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), GetAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin), AddNewEmployee);

empRouter
    .route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), GetEmployeeById);

module.exports = empRouter;