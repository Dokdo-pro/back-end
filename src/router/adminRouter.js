const { Router } = require("express");
const { userService, groupService, postService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler } = require("../middlewares");

const router = Router();

router.get(
  "/users",
  asyncHandler(async (req, res, next) => {
    const users = await userService.getAllUsers();
    res.json(buildResponse(users));
  })
);

router.put(
  "/users/:user_id",
  asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    const { email, name, profilePic, introduction } = req.body;
    const { withdrawal } = req.query.withdrawal;
    const putUser = await userService.adminPutUser({ user_id, email, name, profilePic, introduction });
    res.json(buildResponse(putUser));
  })
);

router.delete(
  "/users/:user_id",
  asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    const deleteUser = await userService.deleteUser(user_id);
    res.json(buildResponse(deleteUser));
  })
);

router.get(
  "/posts",
  asyncHandler(async (req, res, next) => {
    const posts = await postService.getAllPosts();
    res.json(buildResponse(posts));
  })
);

router.put(
  "/posts/:post_id",
  asyncHandler(async (req, res, next) => {
    const { post_id } = req.params;
    const { title, content } = req.body;
    const putPost = await postService.putPost({ post_id, title, content });
    res.json(buildResponse(putPost));
  })
);
module.exports = router;
