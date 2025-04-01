const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then((data) => {
      console.log(`MongoDB connected with server - ${data.connection.host}`);
    }).catch(error => {
      console.log(`Error while connecting to database - ${error}`)
    })
}

module.exports = connectDatabase