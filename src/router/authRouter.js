const { Router } = require("express");
const { userService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler, isAuthenticated } = require("../middlewares");

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const newUser = await userService.postUser({
      email,
      password,
    });
    res.json(buildResponse(newUser));
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const loginResult = await userService.getUserToken({ email, password });
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
  "/users",
  asyncHandler(async (req, res, next) => {
    const email = req.query.email;
    const isExist = await userService.isDuplicatedEmail(email);
    res.json(buildResponse({ isExist: isExist }));
  })
);

router.put(
  "/withdrawal",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const password = req.body.password;
    const deleteUser = await userService.deleteUser({ user_id, password });
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

router.put(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { password, name, profilePic, introduction, phone, gender } = req.body;
    const editInfo = await userService.putUser({ user_id, password, name, profilePic, introduction, phone, gender });
    res.json(buildResponse(editInfo));
  })
);

router.get(
  "/me/posts",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const myPosts = await userService.getMyPosts(user_id);
    res.json(buildResponse(myPosts));
  })
);

router.put(
  "/group/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    const joinGroup = await userService.joinGroup({ user_id, group_id });
    res.json(buildResponse(joinGroup));
  })
);

router.delete(
  "/group/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    const leaveGroup = await userService.leaveGroup({ user_id, group_id });
    res.json(buildResponse(leaveGroup));
  })
);

module.exports = router;
