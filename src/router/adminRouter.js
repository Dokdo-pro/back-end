const { Router } = require("express");
const { userService, groupService } = require("../services");
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

// router.put(
//   "/users/:user_id",
//   asyncHandler(async (req, res, next) => {
//     const { user_id } = req.params;
//     const {}
//   })
// );
module.exports = router;
