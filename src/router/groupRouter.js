const { Router } = require("express");
const { groupService } = require("../services");
const { asyncHandler, isAuthenticated } = require("../middlewares");
const { buildResponse } = require("../misc/utils");

const router = Router();

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const userToken = req.cookies.loginToken.token;
    const { name, profile, maxMember, tag, duration } = req.body;
    const postGroup = await groupService.postGroup({ userToken, name, profile, maxMember, tag, duration });
    res.json(buildResponse(postGroup));
  })
);
module.exports = router;
