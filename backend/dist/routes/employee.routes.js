"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const employeeRouter = (0, express_1.Router)();
const employees = [
    { id: '1', firstname: "John", lastname: 'Smith', age: 22, isMarried: false },
    { id: '2', firstname: "Jane", lastname: 'Doe', age: 34, isMarried: false },
    { id: '3', firstname: "Joe", lastname: 'Moe', age: 41, isMarried: true },
];
/**
 * Get employees
 *
 * @route GET /employees
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with employees list object.
 */
employeeRouter.get('/', (req, res) => {
    res.status(200).json(employees);
});
/**
* Search employees by firstname.
*
* @route GET /employees/search?firstname=somevalue
* @query {string} firstname - The firstname to search for.
* @param {Request<{}, {}, {}, { firstname: string }>} req - Express request containing query parameters.
* @param {Response} res - Express response object.
* @returns {void} Responds with an array of matched employee objects or an error message.
*/
employeeRouter.get('/search', (req, res) => {
    const { firstname } = req.query;
    const foundEmployees = employees.filter(employee => employee.firstname.toLowerCase().includes(firstname.toLowerCase()));
    if (foundEmployees.length === 0) {
        res.status(404).send("No matching employees!");
        return;
    }
    res.status(200).json(foundEmployees);
});
/**
 * Get employee by ID
 *
 * @route GET /employees/:id
 * @param {Request} req - Express request containing employee ID.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with employee matching ID.
 */
employeeRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const employee = employees.find(employee => employee.id === id);
    if (!employee) {
        res.status(404).send("Employee not found");
        return;
    }
    res.status(200).json(employee);
});
/**
 * Adds a new employee to the system.
 *
 * @route POST /employees
 * @param {Request<{}, {}, Omit<Employee, 'id'>>} req - Express request containing the employee data in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the newly created employee.
 */
employeeRouter.post("/", (req, res) => {
    const newEmployee = {
        id: (0, uuid_1.v4)(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        isMarried: req.body.isMarried
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});
/**
 * Updates a employee by ID.
 *
 * @route PUT /employees/:id
 * @param {Request<{ id: string }, {}, Partial<Employee>>} req - Express request containing the employee ID in params and the update fields in the body.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with the updated employee or an error if not found.
 */
employeeRouter.put("/:id", (req, res) => {
    var _a, _b;
    const { id } = req.params;
    const foundIndex = employees.findIndex(employee => employee.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee not found");
        return;
    }
    const updatedEmployee = Object.assign(Object.assign({}, employees[foundIndex]), { firstname: (_a = req.body.firstname) !== null && _a !== void 0 ? _a : employees[foundIndex].firstname, lastname: (_b = req.body.lastname) !== null && _b !== void 0 ? _b : employees[foundIndex].lastname });
    employees[foundIndex] = updatedEmployee;
    res.status(200).json(updatedEmployee);
});
/**
 * Deletes a employee by ID.
 *
 * @route DELETE /employees/:id
 * @param {Request<{ id: string }>} req - Express request containing employee id.
 * @param {Response} res - Express response object.
 * @returns {void} Responds with a message that employee was deleted.
 */
employeeRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const foundIndex = employees.findIndex(employee => employee.id === id);
    if (foundIndex === -1) {
        res.status(404).send("Employee not found");
        return;
    }
    employees.splice(foundIndex, 1);
    res.status(200).send("Employee was deleted!");
});
exports.default = employeeRouter;
