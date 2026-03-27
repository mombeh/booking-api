import Joi from 'joi';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;       // YYYY-MM-DD
const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;    // HH:MM or HH:MM:SS (24hr)

export const timeSlotSchema = Joi.object({
  date: Joi.string().pattern(dateRegex).required(),
  startTime: Joi.string().pattern(timeRegex).required(),
  endTime: Joi.string().pattern(timeRegex).required(),
});


export const validate = (req, res, next) => {
    const { error } = timeSlotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
