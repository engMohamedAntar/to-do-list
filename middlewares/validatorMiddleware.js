//validatorMiddleware.js
const {validationResult}= require('express-validator');
const validatorMiddleware= (req, res, next) => {    
    const result = validationResult(req);
    console.log('result');
    console.log(result);
    console.log('result.array()');
    console.log(result.array());
    
    if (!result.isEmpty())
        return res.send({ errors: result.array() });    
    next();
};

module.exports= validatorMiddleware;