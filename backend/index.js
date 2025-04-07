const app = require('./app')
const connectDatabase = require("./config/database")
require('dotenv').config()
const cloudinary = require('cloudinary')

// Handling Uncaught Exception
process.on("uncaughtException", err => {
  console.log(`Shutting down the server due to uncaughtException`)

  process.exit(1)
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

connectDatabase()

const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server is running on PORT ${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
  console.log(`Shutting down the server due to unhandledRejection - ${err}`)

  server.close(() => {
    process.exit(1)
  })
})