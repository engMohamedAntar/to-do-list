//userRoute.js
const express= require('express');
const router= express.Router();
const {createUser, updateUser, getAllUsers, getOneUser, deleteUser}= require('../services/userService');
const {protect, allowedTo}= require('../services/authService');
const {createUserValidator}= require('../utils/validators/userValidator');

router.use(protect, allowedTo('admin'));

router.route('/')
.post(createUserValidator, createUser)
.get(getAllUsers)
router.route('/:id')
.put(updateUser)
.get(getOneUser)
.delete(deleteUser)

module.exports= router;