const empData = {
  employees: require("../data/employees.json"),
  setEmployee: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (res) => {
  res.json(empData);
};

const addNewEmployee = (req, res) => {
  const { firstname, lastname } = req.body;

  if (firstname == "" && lastname == "") {
    return res.status(400).json({ message: "firstname and lastname are required!" });
  }
  if (firstname == "") {
    return res.status(400).json({ message: "firstname is required" });
  }
  if (lastname == "") {
    return res.status(400).json({ message: "lastname is required" });
  }
  const addNewData = {
    id: empData.employees.length + 1 || 1,
    firstname: firstname,
    lastname: lastname,
  };

  empData.setEmployee([...empData.employees, addNewData]);
  return res.status(201).json(addNewData);
};

const getEmployeeById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Id cannot be empty");
  }
  const employee = empData.employees.find((emp) => emp.id == parseInt(id));
  if (!employee) {
    return res.status(400).json({ message: `Employee with ${id} not found!` });
  }
  return res.status(200).json(employee);
};
module.exports = { getAllEmployees, addNewEmployee, getEmployeeById };
