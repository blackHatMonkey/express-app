//@ts-check
'use strict';

const fs = require('fs');

var employees = [];
var departments = [];
/**
 * Read the departments and employees file.
 *
 * @returns {Promise} Promise object represents read employee and department
 * files.
 */
module.exports.initialize = function() {
        return new Promise((resolve, reject) => {
                fs.readFile('./data/employees.json', (empErr, empData) => {
                        if (empErr) {
                                reject(empErr);
                        }
                        employees = JSON.parse(empData.toString('utf-8'));
                        if (employees.length > 0) {
                                fs.readFile(
                                    './data/departments.json',
                                    (depErr, depData) => {
                                            if (depErr) {
                                                    reject(depErr);
                                            }

                                            departments = JSON.parse(
                                                depData.toString('utf-8'));
                                            if (departments.length > 0) {
                                                    resolve(
                                                        'All departments and employees are added!');
                                            } else {
                                                    reject(
                                                        'Unable to add departments!');
                                            }
                                    });
                        } else {
                                reject('Unable to add employees!');
                        }
                });
        });
};

/**
 * Return all employees.
 *
 * @returns {Promise} Promise object representing array of all employees
 */
module.exports.getAllEmployees = function() {
        return new Promise((resolve, reject) => {
                if (employees.length === 0) {
                        reject('Employees is empty!');
                } else {
                        resolve(employees);
                }
        });
};

/**
 * Return all the managers.
 *
 * @returns {Promise} Promise object representing array of all managers.
 */
module.exports.getManagers = function() {
        return new Promise((resolve, reject) => {
                let managers = [];

                employees.forEach(employee => {
                        if (employee.isManager) {
                                managers.push(employee);
                        }
                });

                if (managers.length > 0) {
                        resolve(managers);
                } else {
                        reject('No managers were found!');
                }
        });
};

/**
 * Return all the departments.
 *
 * @returns {Promise} Promise object representing array of all departments.
 */
module.exports.getDepartments = function() {
        return new Promise((resolve, reject) => {
                if (departments.length === 0) {
                        reject('Departments is empty!');
                } else {
                        resolve(departments);
                }
        });
};

/**
 *
 * @param {*} employeeData
 * @returns {Promise} Promise object representing sucess of adding a new
 * employee.
 */
module.exports.addEmployee = function(employeeData) {
        return new Promise((resolve, reject) => {
                if (typeof employeeData.isManager === 'undefined') {
                        employeeData.isManager = false;
                } else {
                        employeeData.isManager = true;
                }

                let size = employees.length;
                employeeData.employeeNum = size + 1;
                employees.push(employeeData);

                if (size < employees.length) {
                        resolve();
                } else {
                        reject();
                }
        });
};

/**
 * Return all employees with status.
 *
 * @param status Status of the employee.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees with status.
 */
module.exports.getEmployeesByStatus = function(status) {
        return new Promise((resolve, reject) => {
                let result = [];
                employees.forEach(employee => {
                        if (employee.status === status) {
                                result.push(employee);
                        }
                });
                if (result.length === 0) {
                        reject('No employees found!');
                } else {
                        resolve(result);
                }
        });
};

/**
 * Return all employees in department.
 *
 * @param {Number} department A department number.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees in department.
 */
module.exports.getEmployeesByDepartment = function(department) {
        return new Promise((resolve, reject) => {
                let result = [];
                employees.forEach(employee => {
                        if (employee.department == department) {
                                result.push(employee);
                        }
                });
                if (result.length === 0) {
                        reject('No employees found!');
                } else {
                        resolve(result);
                }
        });
};

/**
 * Return all employees who are managed by manager.
 *
 * @param {Number} manager Id of a manager.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees managed by manager.
 */
module.exports.getEmployeesByManager = function(manager) {
        return new Promise((resolve, reject) => {
                let result = [];
                employees.forEach(employee => {
                        if (employee.employeeManagerNum == manager) {
                                result.push(employee);
                        }
                });
                if (result.length === 0) {
                        reject('No employees found!');
                } else {
                        resolve(result);
                }
        });
};

/**
 * Return an employee with employee number num.
 *
 * @param {Number} num An employee number.
 * @returns {Promise} Promise object representing sucess of an employee
 * with employee number num.
 */
module.exports.getEmployeeByNum = function(num) {
        return new Promise((resolve, reject) => {
                let chosenEmployee = null;

                employees.forEach(employee => {
                        if (employee.employeeNum == num) {
                                chosenEmployee = employee;
                        }
                });

                if (chosenEmployee !== null) {
                        resolve(chosenEmployee);
                } else {
                        reject('No employee found!');
                }
        });
};

/**
 * Update the employee.
 *
 * @param {Object} employeeData An employee object.
 * @returns {Promise} Promise object representing sucess of updating
 * an employee.
 */
module.exports.updateEmployee = function(employeeData) {
        return new Promise((resolve, reject) => {
                for (let i = 0; i < employees.length; i++) {
                        if (employees[i].employeeNum ==
                            employeeData.employeeNum) {
                                employees[i] = employeeData;
                                resolve();
                        }
                }
                reject();
        });
};