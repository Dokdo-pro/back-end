const { Router } = require("express");
const { userService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler, isAuthenticated } = require("../middlewares");

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

router.put(
  "/logout",
  asyncHandler(async (req, res, next) => {
    return res.clearCookie("loginToken").end();
  })
);

router.get(
  "/checkDupId",
  asyncHandler(async (req, res, next) => {
    const { id } = req.body;
    const isDuplicated = await userService.isDuplicatedId(id);
    const msg = isDuplicated ? "사용 가능한 아이디입니다." : "이미 사용중인 아이디입니다.";
    res.json(buildResponse({ isDuplicated: isDuplicated, msg: msg }));
  })
);

router.get(
  "/checkDupName",
  asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const isDuplicated = await userService.isDuplicatedName(name);
    const msg = isDuplicated ? "사용 가능한 이름입니다." : "이미 사용중인 이름입니다.";
    res.json(buildResponse({ isDuplicated: isDuplicated, msg: msg }));
  })
);

router.put(
  "/withdrawal",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const userToken = req.cookies.loginToken.token;
    const deleteUser = await userService.deleteUser(userToken);
    res.json(buildResponse(deleteUser));
  })
);

router.get(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const userToken = req.cookies.loginToken.token;
    const userInfo = await userService.getUser(userToken);
    res.json(buildResponse(userInfo));
  })
);

router.get(
  "/id",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const userId = await userService.getUserId(email);
    res.json(buildResponse({ userId: userId }));
  })
);

router.patch(
  "/reset-pw",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const userToken = req.cookies.loginToken.token;
    const { password } = req.body;
    const resetPasssword = await userService.putPassword({ password, userToken });
    res.json(buildResponse({ msg: resetPasssword }));
  })
);
module.exports = router;
