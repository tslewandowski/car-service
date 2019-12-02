module.exports = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({});
    return;
  }
  next();
};