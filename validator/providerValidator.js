//validator/providervalidator

import Joi from "joi";

export const providerRegisterSchema = Joi.object({
    email: Joi.string().email({ maxDomainSegments: 2 }).required(),
    serviceName: Joi.string().min(2).required()
});

export const validate = (req, res, next) => {
    const { error } = providerRegisterSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const providerLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});