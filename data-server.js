//@ts-check
'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let sequelize = new Sequelize('d675hkmua4jd8p',
        'hetcwjirktqgfy',
        'd4a5f2c958b8dcd16abf81b2ac628eac0e3e47d34163e3b44d1280dcc9f6b62d', {
                host: 'ec2-107-21-93-132.compute-1.amazonaws.com',
                dialect: 'postgres',
                port: 5432,
                operatorsAliases: false,
                dialectOptions: {
                        ssl: true
                },
                logging: false
        });

let Employee = sequelize.define('Employee', {
        employeeNum: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
        },
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        email: Sequelize.STRING,
        SSN: Sequelize.STRING,
        addressStreet: Sequelize.STRING,
        addressCity: Sequelize.STRING,
        addressState: Sequelize.STRING,
        addressPostal: Sequelize.STRING,
        maritalStatus: Sequelize.STRING,
        isManager: Sequelize.BOOLEAN,
        employeeManagerNum: Sequelize.INTEGER,
        status: Sequelize.STRING,
        department: Sequelize.INTEGER,
        hireDate: Sequelize.STRING
});

let Department = sequelize.define('Department', {
        departmentId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
        },
        departmentName: Sequelize.STRING
});

/**
 * Read the departments and employees file.
 *
 * @returns {Promise} Promise object represents read employee and department
 * files.
 */
module.exports.initialize = function () {
        return new Promise((resolve, reject) => {
                sequelize.sync()
                        .then(() => { resolve(); })
                        .catch((err) => {
                                reject(err);
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
                Employee.findAll().then((data) => {
                        resolve(data);
                }).catch((err) => { reject(err); });
        });
};

/**
 * Return all the managers.
 *
 * @returns {Promise} Promise object representing array of all managers.
 */
module.exports.getManagers = function () {
        return new Promise((resolve, reject) => {
                Employee.findAll({
                        where: {
                                isManager: {
                                        [Op.eq]: true
                                }
                        }
                })
                        .then((data) => { resolve(data); })
                        .catch((err) => { console.log(err); });
        });
};

/**
 * Return all the departments.
 *
 * @returns {Promise} Promise object representing array of all departments.
 */
module.exports.getDepartments = function () {
        return new Promise((resolve, reject) => {
                Department.findAll()
                        .then((data) => { resolve(data); })
                        .catch((err) => { reject(err); });
        });
};

/**
 *
 * @param {*} employeeData
 * @returns {Promise} Promise object representing sucess of adding a new
 * employee.
 */
module.exports.addEmployee = function (employeeData) {
        return new Promise((resolve, reject) => {
                // we need to make sure it is a boolean value (radio button)
                employeeData.isManager = (employeeData.isManager) ? true : false;

                // we can not have any empty strings
                for (let property in employeeData) {
                        if (employeeData[property] === '') {
                                employeeData[property] = null;
                        }
                }

                Employee.create(employeeData)
                        .then(() => { resolve(); })
                        .catch((err) => { reject(err); });


        });
};

/**
 * Return all employees with status.
 *
 * @param status Status of the employee.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees with status.
 */
module.exports.getEmployeesByStatus = function (status) {
        return new Promise((resolve, reject) => {
                Employee.findAll({
                        where: {
                                status: {
                                        [Op.eq]: status
                                }
                        }
                })
                        .then((data) => { resolve(data); })
                        .catch((err) => { reject(err); })
        });
};

/**
 * Return all employees in department.
 *
 * @param {Number} department A department number.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees in department.
 */
module.exports.getEmployeesByDepartment = function (department) {
        return new Promise((resolve, reject) => {
                Employee.findAll({
                        where: {
                                department: {
                                        [Op.eq]: department
                                }
                        }
                })
                        .then((data) => { resolve(data); })
                        .catch((err) => { reject(err); })
        });
};

/**
 * Return all employees who are managed by manager.
 *
 * @param {Number} manager Id of a manager.
 * @returns {Promise} Promise object representing sucess of returning all
 * employees managed by manager.
 */
module.exports.getEmployeesByManager = function (manager) {
        return new Promise((resolve, reject) => {
                Employee.findAll({
                        where: {
                                employeeManagerNum: {
                                        [Op.eq]: manager
                                }
                        }
                })
                        .then((data) => { resolve(data); })
                        .catch((err) => { reject(err); });
        });
};

/**
 * Return an employee with employee number num.
 *
 * @param {Number} num An employee number.
 * @returns {Promise} Promise object representing sucess of an employee
 * with employee number num.
 */
module.exports.getEmployeeByNum = function (num) {
        return new Promise((resolve, reject) => {
                Employee.findAll({
                        where: {
                                employeeNum: { [Op.eq]: num }
                        }
                })
                        .then((data) => {
                                resolve(data[0]);
                        })
                        .catch((err) => { reject(err); })
        });
};

/**
 * Update the employee.
 *
 * @param {Object} employeeData An employee object.
 * @returns {Promise} Promise object representing sucess of updating
 * an employee.
 */
module.exports.updateEmployee = function (employeeData) {
        return new Promise((resolve, reject) => {
                // we need to make sure it is a boolean value (radio button)
                employeeData.isManager = (employeeData.isManager) ? true : false;

                // we can not have any empty strings
                for (let property in employeeData) {
                        if (property == '') {
                                property = null;
                        }
                }

                Employee.update(employeeData, {
                        where: {
                                employeeNum: {
                                        [Op.eq]: employeeData.employeeNum
                                }
                        }
                })
                        .then(() => { resolve(); })
                        .catch((err) => { reject(err); })
        });
};

/**
 * Add a new department.
 * 
 * @param {*} departmentData an object containing department information.
 * @returns {Promise} Promise object representing sucess of adding a new
 * department.
 */
module.exports.addDepartment = function (departmentData) {
        return new Promise((resolve, reject) => {
                // we can not have any empty strings
                for (let property in departmentData) {
                        if (property == '') {
                                property = null;
                        }
                }

                Department.create(departmentData)
                        .then(() => { resolve(); })
                        .catch((err) => { reject(err); })
        });
};

/**
 * Update a department.
 * 
 * @param {*} departmentData an object containing department information.
 * @returns {Promise} Promise object representing sucess of updating a
 * department.
 */
module.exports.updateDepartment = function (departmentData) {
        return new Promise((resolve, reject) => {
                // we can not have any empty strings
                for (let property in departmentData) {
                        if (property == '') {
                                property = null;
                        }
                }

                Department.update(departmentData, {
                        where: {
                                departmentId: {
                                        [Op.eq]: departmentData.departmentId
                                }
                        }
                })
                        .then(() => { resolve(); })
                        .catch((err) => { reject(); })
        });
};

/**
 * Get a department using department id.
 * 
 * @param {*} id a department id.
 * @returns {Promise} Promise object representing sucess of find a
 * department with provided id.
 */
module.exports.getDepartmentById = function (id) {
        return new Promise((resolve, reject) => {
                Department.findOne({
                        where: {
                                departmentId: {
                                        [Op.eq]: id
                                }
                        }
                }).then((data) => {
                        resolve(data);
                })
                        .catch((err) => { reject(err); });
        });
};

/**
 * Remove an employee from the database.
 * 
 * @param {Number} empNum an employee number.
 * @returns {Promise} Promise object representing sucess removing
 * an employee.
 */
module.exports.deleteEmployeeByNum = function (empNum) {
        return new Promise((resolve, reject) => {
                Employee.destroy({
                        where: {
                                employeeNum: {
                                        [Op.eq]: empNum
                                }
                        }
                })
                        .then(() => { resolve(); })
                        .catch((err) => { reject(err); });
        });
};