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

const getAppointment = async (req, res) => {
  const [appointment] = await knex("appointments")
    .where("id", req.params.id)
    .select("*");

  if (!appointment) {
    res.status(404).json({});
    return;
  }

  res.status(200).json({
    id: appointment.id,
    start: appointment.start,
    end: appointment.end,
    status: appointment.status,
    price: appointment.price
  });
};

module.exports.getAppointment = asyncHandler(getAppointment);

const listAppointments = async (req, res) => {
  const { error: validationError } = Joi.object()
    .keys({
      from: Joi.string()
        .isoDate()
        .required(),
      to: Joi.string()
        .isoDate()
        .required()
    })
    .validate(req.query);

  if (validationError) {
    res.status(400).json({});
    return;
  }

  const { from, to } = req.query;

  const appointments = await knex("appointments")
    .where(builder => {
      builder
        .whereBetween("start", [from, to])
        .orWhereBetween("end", [from, to])
        .orWhere(subbuilder => {
          subbuilder.where("start", "<", from).andWhere("end", ">", to);
        });
    })
    .orderBy("price", "desc")
    .select();

  res.status(200).json(
    appointments.map(appointment => {
      return {
        id: appointment.id,
        start: appointment.start,
        end: appointment.end,
        status: appointment.status,
        price: appointment.price
      };
    })
  );
};

module.exports.listAppointments = asyncHandler(listAppointments);
