//userService.js
const User= require('../models/userModel');
const asyncHandler= require('express-async-handler')
const ApiError= require('../utils/apiError');
const factoryHandler= require('./factoryHandler');


// @desc get all users
// @route GET localhost:3000/users
// @access Admin
exports.getAllUsers= factoryHandler.getAll(User);

// @desc get all users
// @route GET localhost:3000/users/:id
// @access Admin
exports.getOneUser= factoryHandler.getOne(User);
 
// @desc create a user
// @route POST localhost:3000/users
// @access Admin
exports.createUser= factoryHandler.createOne(User);

// @desc update a user
// @route PUT localhost:3000/users/:id
// @access Admin
exports.updateUser= factoryHandler.updateOne(User);

// @desc delete user
// @route DELETE localhost:3000/users/:id
// @access Admin
exports.deleteUser= factoryHandler.deleteOne(User);