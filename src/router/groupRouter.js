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
module.exports = router;
