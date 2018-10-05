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
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (empErr, empData) => {
            if (empErr) {
                reject(empErr);
            }
            employees = JSON.parse(empData);
            if (employees.length > 0) {
                fs.readFile(
                    './data/departments.json',
                    (depErr, depData) => {
                        if (depErr) {
                            reject(depErr);
                        }

                        departments = JSON.parse(depData);
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
module.exports.getAllEmployees = function () {
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
module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        let managers = [];

        employees.forEach((employee) => {
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
module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        if (departments.length === 0) {
            reject('Departments is empty!');
        } else {
            resolve(departments);
        }
    });
};