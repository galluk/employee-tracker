const connection = require('./dbConnection');
const dbScripts = require('./dbScripts');
const appConsts = require('../const/conts');

class Engine {
    constructor() {
    }

    selectData(table) {
        return new Promise(function (resolve, reject) {
            let queryStr = '';
            switch (table) {
                case appConsts.EMPLOYEE_STR:
                    queryStr = dbScripts.SELECT_ALL_EMPLOYEES;
                    break;

                case appConsts.ROLE_STR:
                    queryStr = dbScripts.SELECT_ALL_ROLES;
                    break;

                case appConsts.DEPARTMENT_STR:
                    queryStr = dbScripts.SELECT_ALL_DEPARTMENTS;
                    break;

                case appConsts.DEPARTMENT_BUDGET_STR:
                    queryStr = dbScripts.SELECT_DEPARTMENT_BUDGETS;
                    break;
            }

            connection.query(queryStr, function (error, result) {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }

    insertNewDepartment(deptName) {
        return new Promise(function (resolve, reject) {
            if (deptName) {
                connection.query(dbScripts.ADD_DEPARTMENT, [deptName], function (error, result) {
                    if (error) return reject(error);
                    resolve(result);
                });
            }
        });
    }

    insertNewRole(title, salary, deptId) {
        return new Promise(function (resolve, reject) {
            if (title) {
                connection.query(dbScripts.ADD_ROLE, [title, salary, deptId], function (error, result) {
                    if (error) return reject(error);
                    resolve(result);
                });
            }
        });
    }

    insertNewEmployee(fName, lName, roleId, managerId) {
        return new Promise(function (resolve, reject) {
            if (fName && lName) {
                connection.query(dbScripts.ADD_EMPLOYEE, [fName, lName, roleId, managerId], function (error, result) {
                    if (error) return reject(error);
                    resolve(result);
                });
            }
        });
    }

    updateEmployeeRole(employeeId, roleId) {
        return new Promise(function (resolve, reject) {
            if (employeeId && roleId) {
                connection.query(dbScripts.UPDATE_EMPLOYEE_ROLE, [roleId, employeeId], function (error, result) {
                    if (error) return reject(error);
                    resolve(result);
                });
            }
        });
    }

    updateEmployeeManager(employeeId, managerId) {
        return new Promise(function (resolve, reject) {
            if (employeeId && managerId) {
                connection.query(dbScripts.UPDATE_EMPLOYEE_MANAGER, [managerId, employeeId], function (error, result) {
                    if (error) return reject(error);
                    resolve(result);
                });
            }
        });
    }

}

const dbEngine = new Engine();

module.exports = dbEngine;