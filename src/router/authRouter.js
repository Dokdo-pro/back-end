const { Router } = require("express");
const { userService } = require("../services");
const { buildResponse } = require("../misc/utils");
const asyncHandler = require("../middlewares/asyncHandler");

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { id, password, name, email, address, profile } = req.body;
    const newUser = await userService.postUser({
      id,
      password,
      name,
      email,
      address,
      profile,
    });
    res.json(buildResponse(newUser));
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { id, password } = req.body;
    const userToken = await userService.getUserToken({ id, password });
    res.cookie("loginToken", userToken).json(buildResponse({ msg: "로그인 성공" }));
  })
);
module.exports = router;
