//userService.js
const User= require('../models/userModel');
const asyncHandler= require('express-async-handler')
const ApiError= require('../utils/apiError');

// @desc get all users
// @route GET localhost:3000/users
// @access Admin
exports.getAllUsers=asyncHandler(async (req,res)=>{    
    const users= await User.find();
    res.status(200).json({status:'success', data: users});
});

// @desc get all users
// @route GET localhost:3000/users/:id
// @access Admin
exports.getOneUser=asyncHandler(async (req,res,next)=>{    
    const user= await User.findById(req.params.id);    
    if(!user)
        return next(new ApiError('User not found yasta', 404));
    
    res.status(201).json({status:'success', data: user});
});
 
// @desc create a user
// @route POST localhost:3000/users
// @access Admin
exports.createUser=asyncHandler(async (req,res)=>{ 
    const newUser= await User.create(req.body);    
    res.status(201).json({status:'success', data: newUser}); 
});

// @desc update a user
// @route PUT localhost:3000/users/:id
// @access Admin
exports.updateUser=asyncHandler(async (req,res)=>{
    const updatedUser= await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({status: 'success', data: updatedUser});
});

// @desc delete user
// @route DELETE localhost:3000/users/:id
// @access Admin
exports.deleteUser=asyncHandler(async (req,res)=>{
    const user= await User.findByIdAndDelete(req.params.id);
    if(!user)
        return new ApiError('no user found', 204);
    res.status(204).send();
});