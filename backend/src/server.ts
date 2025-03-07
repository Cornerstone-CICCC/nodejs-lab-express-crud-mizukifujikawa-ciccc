import express from 'express'
import dotenv from 'dotenv'
import employeeRouter from './routes/employee.routes'
dotenv.config()
import cors from 'cors'

// Create server
const app = express()

// Middleware
app.use(express.json()) // Allow JSON requests
app.use(cors())

// Routes
app.use("/employees", employeeRouter)

// Fallback
app.use((req, res, next) => {
  res.status(404).send("Cannot find what you are looking for :(")
})

// Start server
const PORT = process.env.PORT || 3500
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})