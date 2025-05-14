//userRoute.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  getAllUsers,
  getOneUser,
  deleteUser,
  getMe,
  changeMyPassword,
  deactivateMe,
} = require("../services/userService");
const { protect, allowedTo } = require("../services/authService");
const { createUserValidator } = require("../utils/validators/userValidator");
const taskRoute= require('./taskRoute');

router.use('/:userId/tasks', taskRoute)

router.get("/getMe", protect, allowedTo("user"), getMe);
router.put("/changeMyPassword", protect, allowedTo("user"), changeMyPassword);
router.delete("/deactivateMe", protect, allowedTo("user"), deactivateMe);

router.use(protect, allowedTo("admin"));

router.route("/").post(createUserValidator, createUser).get(getAllUsers);
router.route("/:id").put(updateUser).get(getOneUser).delete(deleteUser);

module.exports = router;
