const express = require('express');

// 버전1 라우터
const v1Router = express.Router();

module.exports = {
  v1: v1Router, // API 버저닝
};
ß