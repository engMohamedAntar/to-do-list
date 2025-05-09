//userRoute.js
const express= require('express');
const router= express.Router();
const {createUser, updateUser, getAllUsers, getOneUser, deleteUser}= require('../services/userService');
const {protect, allowedTo}= require('../services/authService');

router.use(protect,allowedTo('admin'));

router.route('/')
.post(createUser)
.get(getAllUsers)
router.route('/:id')
.put(updateUser)
.get(getOneUser)
.delete(deleteUser)

module.exports= router;