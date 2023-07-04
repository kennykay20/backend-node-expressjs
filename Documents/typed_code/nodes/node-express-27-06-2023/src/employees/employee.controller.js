const {
  getAllEmployees,
  addNewEmployee,
  getEmployeeById,
} = require("./employee.service");

const GetAllEmployees = (req, res) => {
  return getAllEmployees(res);
};

const AddNewEmployee = (req, res) => {
  return addNewEmployee(req, res);
};

const GetEmployeeById = (req, res) => {
  return getEmployeeById(req, res);
};

module.exports = { GetAllEmployees, AddNewEmployee, GetEmployeeById };
