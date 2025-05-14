//authService.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createJwt = require("../utils/createJWT");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail= require('../utils/sendEmail');
const crypto= require('crypto');

// @desc signUp
// @route POST localhost:3000/auth/signUp
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return next(new ApiError("This user exist before", 409));

  const newUser = await User.create(req.body);
  const token = createJwt({ id: newUser.id });

  res.status(201).json({ data: newUser, token });
});

// @desc logIn
// @route POST localhost:3000/auth/logIn
// @access Public
exports.logIn = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return next(new ApiError("Invalid email or password", 401));
  const token = createJwt({ id: user.id });
  res.status(200).json({ data: user, token });
});

// @desc create the protect middlewaare
exports.protect = asyncHandler(async (req, res, next) => {  
  // check weather token exist (user is loggedIn)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new ApiError("Not loggedIn please login first.", 401));
  const token = req.headers.authorization.split(" ")[1];
  
  // verify token (not expired and valid)
  const decoded = jwt.verify(token, process.env.JWT_SECRET); //?
   
  // ensure that the user still exit 
  const user = await User.findById(decoded.id);
  if (!user)
    return next(new ApiError("user of this token does no longer exist", 401));
  // check if the user password changed after token is created
  if (user.passwordChangedAt) {
    let passwordChangedAt = user.passwordChangedAt;
    const jwtCreatedAt = decoded.iat;
    passwordChangedAt = parseInt(passwordChangedAt.getTime() / 1000);
    if (passwordChangedAt > jwtCreatedAt)
      return next(new ApiError("password changed, please logIn again", 401));
  }
  //check weather the user account is deactivated
  if (!user.isActive)
    return next(
      new ApiError("This user is deactivated, activate it first.", 401)
    );

  req.user = user;
    
  next();
});


exports.allowedTo =
  (...roles) =>
  (req, res, next) => {    
    const user= req.user;
    
    if(!roles.includes(user.role))
        return next(new ApiError('You are not permitted to access this route', 403));

    next();
  };

// @desc fortgotPassword
// @route POST localhost:3000/auth/forgotPassword
// @access Public
exports.forgotPassword= asyncHandler(async(req,res,next)=>{
  // get email and from body & ensure a user exist for this email.
  const user= await User.findOne({email: req.body.email});
  if(!user)
    return next(new ApiError('No user found for this email', 404));

  //create a random 6 digits reset code.
  const resetCode= Math.floor((Math.random()*1000000)+1).toString();

  //send this code to loggedIn user  
  sendEmail({
    email: user.email,
    subject: 'Password Reset Code - valid for 10 minutes',
    message: `Your resetCode is ${resetCode}`
  })
  user.resetCodeCreatedAt= Date.now();
  const hashedCode= crypto.createHash('sha256').update(resetCode).digest('hex');
  user.resetCode= hashedCode;
  await user.save();

  res.status(200).json({status: 'success', message: "reset code sent to your email"});
});

// @desc verifyResetCode
// @route POST localhost:3000/auth/verifyResetCode 
// @access Public
exports.verifyResetCode= asyncHandler(async(req,res,next)=>{
  const hashedResetCode= crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
  const user= await User.findOne({email: req.body.email, resetCode: hashedResetCode, resetCodeCreatedAt:{$lt: Date.now()+10000}});
  if(!user) 
    return next(new ApiError('Invalid reseCode or expired', 400));
  user.resetCodeVerified= true;
  await user.save();

  res.status(200).json({status: 'success', message: "reset code verified successfully"});
});

// @desc resetPassword
// @route PUT localhost:3000/auth/resetPassword 
// @access Public
exports.resetPassword= asyncHandler(async(req,res,next)=>{
  const user= await User.findOne({email: req.body.email});
  if(!user.resetCodeVerified)
    return next(new ApiError('resetCode not verified, verify it first', 400));
  user.password= req.body.newPassword;
  user.resetCode= undefined;
  user.resetCodeCreatedAt= undefined; 
  user.resetCodeVerified= false;
  user.save();
  const token= createJwt({id: user._id});
  res.status(200).json({status: 'success', message: "password have been reset successfully", token});
})