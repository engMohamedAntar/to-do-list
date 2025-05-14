//taskRoute.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createTask,
  updateTask,
  getAllTasks,
  getOneTask,
  deleteTask,
} = require("../services/taskServices");
const { protect, allowedTo } = require("../services/authService");
const { createTaskValidator, getAllTasksValidator} = require("../utils/validators/taskValidator");
const {addFilterObjToReq}= require('../services/taskServices');


router.use(protect, allowedTo("user"));

router.route("/").post(createTaskValidator, createTask).get(addFilterObjToReq ,getAllTasksValidator, getAllTasks);
router.route("/:id").put(updateTask).get(getOneTask).delete(deleteTask);

module.exports = router;
