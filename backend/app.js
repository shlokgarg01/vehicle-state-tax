const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
// const routes = require('./routes')

app.use(morgan("combined"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(cors());

const errorMiddleware = require("./middleware/error");

app.get("/ping", (_, res) => {
  res.status(200).json({
    message:"Server is running."
  })
})
// app.use('/api/v1', routes);

app.use(errorMiddleware);
module.exports = app;
