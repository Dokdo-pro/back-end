const express = require("express");
const authRouter = require("./authRouter");
const groupRouter = require("./groupRouter");
const postRouter = require("./postRouter");
const imageRouter = require("./imageRouter");
// 버전1 라우터
const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/group", groupRouter);
v1Router.use("/post", postRouter);
v1Router.use("/image", imageRouter);

module.exports = {
  v1: v1Router, // API 버저닝
};
