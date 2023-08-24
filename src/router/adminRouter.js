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
module.exports = router;
