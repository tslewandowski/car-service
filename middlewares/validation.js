const Joi = require('@hapi/joi')

module.exports.validateBody = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({});
    return;
  }
  next();
};

const pathSchema = Joi.object().keys({
  id: Joi.number().integer().required()
})

module.exports.validatePath = (req, res, next) => {
  const { error } = pathSchema.validate(req.params);
  if (error) {
    res.status(400).json({});
  }

  next()
}