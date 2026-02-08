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


const corsOpts = {
  origin: config.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOpts));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true, limit: "1gb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.use("/", (req, res)=> res.json({msg: "jiiiiiiiiiiiiiiiiiiii"}))
app.use("/", require('./src/routes/index.js'));

module.exports = {
  app,
};
