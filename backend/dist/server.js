"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const employee_routes_1 = __importDefault(require("./routes/employee.routes"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
// Create server
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // Allow JSON requests
app.use((0, cors_1.default)());
// Routes
app.use("/employees", employee_routes_1.default);
// Fallback
app.use((req, res, next) => {
    res.status(404).send("Cannot find what you are looking for :(");
});
// Start server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
