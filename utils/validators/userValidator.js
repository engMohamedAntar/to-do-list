const {check}= require('express-validator');
const ApiError = require('../../../ecommerce-project/utils/apiError');
const validatorMiddleware= require('../../middlewares/validatorMiddleware');

exports.createUserValidator= [
    check('email')
    .notEmpty().withMessage('Email should not be empty')
    .isEmail().withMessage('Invalid email'),
    check('name')
    .isLength({min: 3, max: 15}).withMessage('name should be at least 3 chars and at most 15'),
    check('password')
    .notEmpty().withMessage('password should not be empty')
    .custom((val,{req})=>{
        if(val!== req.body.passwordConfirm) 
            return Promise.reject(new ApiError('Password and PasswordConfirm does not match',422)) ;
        return true;
    }),
    validatorMiddleware
]
