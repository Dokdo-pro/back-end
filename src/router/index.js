const express = require("express");
const authRouter = require("./authRouter");
// 버전1 라우터
const v1Router = express.Router();

v1Router.use("/auth", authRouter);

module.exports = {
  v1: v1Router, // API 버저닝
};
