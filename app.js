const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const config = require("./config/config");
const asyncHandler = require("./src/utils/asyncHandler.js");
const utils = require('./src/utils/responseMsg.js')

const app = express();

global.logger = require('./src/utils/logger');
global.asyncHandler = asyncHandler;
global.utils = utils;

console.log("----------1st-------------")

const corsOpts = {
  origin: config.CORS_ORIGIN || "*",
  credentials: true,
};
app.use(cors(corsOpts));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true, limit: "1gb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res)=> res.send("Server is running"))
// app.use("/", require('./src/routes/index.js'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = {
  app,
};
