const { Router } = require("express");
const { postService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler, isAuthenticated } = require("../middlewares");

const router = Router();

router.post(
  "/group/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const { title, content } = req.body;
    const postPost = await postService.postPost({ user_id, group_id, title, content });
    res.json(buildResponse(postPost));
  })
);

module.exports = router;
