//taskValidator.js
const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createTaskValidator = [
  check("title")
    .isLength({ min: 3, max: 30 })
    .withMessage("title should be at least 3 chars and at most 30"),
  check("description")
    .notEmpty()
    .withMessage("description should not be empty"),
  validatorMiddleware,
];

exports.getAllTasksValidator = [
  //?
  param("userId").custom((val, { req }) => {
    if (req.params.userId && val !== req.user._id.toString())
      throw new Error("You are not authorized to access these tasks");
    return true;
  }),
  validatorMiddleware,
];


//notes
/*
getAllTasksValidator
  In this nested route  localhost:3000/:userId/tasks ensure that userId === req.user._id

  
*/
