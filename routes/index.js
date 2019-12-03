const express = require("express");
const {
  createAppointment,
  createAppointmentSchema,
  deleteAppointment,
  getAppointment,
  listAppointments
} = require("../controllers/appointments");
const validateBody = require("../middlewares/validation");

const router = express.Router();

router
  .route("/appointments")
  .post(validateBody(createAppointmentSchema))
  .post(createAppointment)
  .get(listAppointments);

router
  .route("/appointments/:id")
  .delete(deleteAppointment)
  .get(getAppointment);

module.exports = router;
