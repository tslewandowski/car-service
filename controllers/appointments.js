const Joi = require("@hapi/joi");
const knex = require("../database");

const asyncHandler = asyncController => (req, res) =>
  asyncController(req, res).catch(error => {
    // eslint-disable-next-line no-console
    console.error("unhandled error in controller", error.message, error.stack);
    res.status(500).json({});
  });

module.exports.createAppointmentSchema = Joi.object().keys({
  start: Joi.date()
    .iso()
    .required(),
  end: Joi.date()
    .iso()
    .greater(Joi.ref("start"))
    .required(),
  price: Joi.number()
    .integer()
    .required(),
  status: Joi.string().required()
});

const createAppointment = async (req, res) => {
  const { start, end, status, price } = req.body;
  const [id] = await knex("appointments")
    .returning("id")
    .insert({ start, end, status, price });
  res.status(200).json({
    id,
    start,
    end,
    status,
    price
  });
};

module.exports.createAppointment = asyncHandler(createAppointment);

const deleteAppointment = async (req, res) => {
  await knex("appointments")
    .where("id", req.params.id)
    .del();

  res.status(204).json({});
};

module.exports.deleteAppointment = asyncHandler(deleteAppointment);
