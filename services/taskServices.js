//taskService.js
const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factoryHandler = require("./factoryHandler");
const bcrypt = require("bcrypt");

exports.addFilterObjToReq = (req, res, next) => {
  let filterObj = {};
  filterObj = {user: req.user._id};
  req.filterObj= filterObj;
  next();  
};


// @desc get all tasks
// @route GET localhost:3000/tasks
// @access User
exports.getAllTasks = factoryHandler.getAll(Task);

// @desc get all tasks
// @route GET localhost:3000/tasks/:id
// @access User
exports.getOneTask = factoryHandler.getOne(Task);

// @desc create a task
// @route POST localhost:3000/tasks
// @access User
exports.createTask = asyncHandler(async(req,res,next)=>{
    const user= await Task.create({...req.body, user: req.user._id});
    res.status(201).json({status: 'success', data: user});
});

// @desc update a task
// @route PUT localhost:3000/tasks/:id
// @access User
exports.updateTask = factoryHandler.updateOne(Task);

// @desc delete task
// @route DELETE localhost:3000/tasks/:id
// @access User
exports.deleteTask = factoryHandler.deleteOne(Task);