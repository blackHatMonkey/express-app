"use strict";

const fs = require("fs");

var employees = [];
var departments = [];

const readEmployee = function () {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/employees.json", (err, data) => {
            if (err) {
                throw err;
            }
            employees = JSON.parse(data);
            if (employees.length > 0) {
                resolve("All employees are added!");
            } else {
                reject("Failed to add all employees!");
            }
        });
    });
};

const readDepartments = function () {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/departments.json", (err, data) => {
            if (err) {
                throw err;
            }
            departments = JSON.parse(data);
            if (departments.length > 0) {
                resolve("All departments are added!");
            } else {
                reject("Failed to add all departments!");
            }
        });
    });
};

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        readEmployee()
            .then(readDepartments)
            .then(() => {
                resolve("Employees and departments added!");
            })
            .catch((message) => {
                reject("Unable to add emplyees and departments!");
            });
    });
};

module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        if (employees.length === 0) {
            reject("Employees is empty!");
        } else {
            resolve(employees);
        }
    });
};

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
            reject("No managers were found!");
        }
    });
};

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        if (departments.length === 0) {
            reject("Departments is empty!");
        } else {
            resolve(departments);
        }
    });
};