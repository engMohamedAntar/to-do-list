//authRoute.js
const express= require('express');
const router= express.Router();
const {signUp, logIn}= require('../services/authService');
const {forgotPassword, verifyResetCode, resetPassword}= require('../services/authService');

router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

router.route('/signUp')
.post(signUp)
router.route('/logIn')
.post(logIn)
module.exports= router;