const Joi = require('@hapi/joi')

const validateBody = (schema) => {
    return (req,res,next) => {
        const result  = schema.validate(req.body)
    }
} 

const validateParam = (schema, name) =>{
    return (req,res,next) => {
        const validatorResult = schema.validate({param: req.params[name]})

        if(validatorResult.error){
            return res.status(400).json(validatorResult.error)
        }else {
            if(!req.value) req.value = {}
            if(!req.value['params']) req.value.params = {}

            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const schemas = {
    idSchema: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    authSignUpSchema: Joi.object().keys({
        firstName : Joi.string().min(2).required(),
        lastName : Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    authSignInSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
}

module.exports = {
    validateParam,
    schemas,
    validateBody
}