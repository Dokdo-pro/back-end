const { Router } = require("express");
const { groupService } = require("../services");
const { asyncHandler, isAuthenticated } = require("../middlewares");
const { buildResponse } = require("../misc/utils");

const router = Router();

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { name, profile, maxMember, tag, duration } = req.body;
    const postGroup = await groupService.postGroup({ user_id, name, profile, maxMember, tag, duration });
    res.json(buildResponse(postGroup));
  })
);

router.get(
  "/:group_id",
  asyncHandler(async (req, res, next) => {
    const group_id = Number(req.params.group_id);
    const groupInfo = await groupService.getGroup({ group_id });
    res.json(buildResponse(groupInfo));
  })
);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const groupsInfo = await groupService.getAllGroups();
    res.json(buildResponse(groupsInfo));
  })
);

router.post(
  "/:group_id/posts",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const { title, content } = req.body;
    const postPost = await groupService.postPost({ user_id, group_id, title, content });
    res.json(buildResponse(postPost));
  })
);

router.get(
  "/:group_id/posts",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const getPosts = await groupService.getPosts({ user_id, group_id });
    res.json(buildResponse(getPosts));
  })
);

router.get(
  "/:group_id/posts/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const post_id = req.params.post_id;
    const getPost = await groupService.getPost({ user_id, group_id, post_id });
    res.json(buildResponse(getPost));
  })
);

router.put(
  "/:group_id/posts/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const { title, content } = req.body;
    const putPost = await groupService.putPost({ user_id, group_id, post_id, title, content });
    res.json(buildResponse(putPost));
  })
);

router.delete(
  "/:group_id/posts/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const deletePost = await groupService.deletePost({ user_id, group_id, post_id });
    res.json(buildResponse(deletePost));
  })
);
module.exports = router;
