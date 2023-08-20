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
    const loginResult = await userService.getUserToken({ id, password });
    res.cookie("loginToken", loginResult.token).json(buildResponse({ isLogin: true, isAdmin: loginResult.isAdmin }));
  })
);

router.put(
  "/logout",
  asyncHandler(async (req, res, next) => {
    return res.clearCookie("loginToken").json({ msg: "로그아웃 성공" });
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
    const user_id = req.user_id;
    const deleteUser = await userService.deleteUser(user_id);
    res.json(buildResponse(deleteUser));
  })
);

router.get(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const userInfo = await userService.getUser(user_id);
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
  "/password",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { password } = req.body;
    const resetPasssword = await userService.putPassword({ password, user_id });
    res.json(buildResponse({ msg: resetPasssword }));
  })
);

router.put(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { name, address, profile } = req.body;
    const editInfo = await userService.putUser({ user_id, name, address, profile });
    res.json(buildResponse(editInfo));
  })
);

router.put(
  "/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    const joinGroup = await userService.joinGroup({ user_id, group_id });
    res.json(buildResponse(joinGroup));
  })
);
module.exports = router;
