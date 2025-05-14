//userService.js
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factoryHandler = require("./factoryHandler");
const bcrypt = require("bcrypt");

// @desc get all users
// @route GET localhost:3000/users
// @access Admin
exports.getAllUsers = factoryHandler.getAll(User);

// @desc get all users
// @route GET localhost:3000/users/:id
// @access Admin
exports.getOneUser = factoryHandler.getOne(User);

// @desc create a user
// @route POST localhost:3000/users
// @access Admin
exports.createUser = factoryHandler.createOne(User);

// @desc update a user
// @route PUT localhost:3000/users/:id
// @access Admin
exports.updateUser = factoryHandler.updateOne(User);

// @desc delete user
// @route DELETE localhost:3000/users/:id
// @access Admin
exports.deleteUser = factoryHandler.deleteOne(User);

// @desc get logged user data
// @route Get localhost:3000/users/getMe
// @access protect
exports.getMe = asyncHandler(async (req, res, next) => {
  //get logged user data
  const user = req.user;
  res.status(200).json({ status: "success", data: user });
});

// @desc change logged user password
// @route Get localhost:3000/users/changeMyPassword
// @access protect/user
exports.changeMyPassword = asyncHandler(async (req, res, next) => {
  //compare old password with logged user passwod.
  const oldPassword = req.body.oldPassword;
  const compareResult = await bcrypt.compare(oldPassword, req.user.password);
  if (!compareResult) return next(new ApiError("old password is wrong"));

  //update password
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.newPassword, 12),
    passwordChangedAt: Date.now()
  }, {new: true});  
  res.status(200).json({status: 'success', data: updatedUser});
});

// @desc delete logged user
// @route Delete localhost:3000/users/deactivateMe
// @access protect/user
exports.deactivateMe = asyncHandler(async (req, res, next) => {
  const updatedUser= await User.findByIdAndUpdate(req.user._id, {isActive: false}, {new: true});
  res.status(200).json({status: 'success', message: 'Account deactivated'});
});


