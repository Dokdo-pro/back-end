const express = require("express");
const authRouter = require("./authRouter");
const groupRouter = require("./groupRouter");
// 버전1 라우터
const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/group", groupRouter);

module.exports = {
  v1: v1Router, // API 버저닝
};
