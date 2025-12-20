// validators/userValidator.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('client', 'provider').required(),
  serviceName: Joi.when('role', {
    is: 'provider',
    then: Joi.string().min(2).required(),
    otherwise: Joi.forbidden()
  })
});


export const validate = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
