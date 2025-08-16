const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createTodoSchema = Joi.object({
  task: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('').optional(),
});

const updateTodoSchema = Joi.object({
  task: Joi.string().trim().min(1).optional(),
  description: Joi.string().allow('').optional(),
})
  .or('task', 'description')
  .messages({
    'object.missing': 'Request body must contain at least one of "task" or "description".',
  });

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createTodoSchema,
  updateTodoSchema,
};
