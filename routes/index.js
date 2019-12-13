const express = require("express");
const {
  createAppointment,
  createAppointmentSchema,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointmentSchema,
  updateAppointment
} = require("../controllers/appointments");
const { validateBody, validatePath } = require("../middlewares/validation");

const router = express.Router();

router
  .route("/appointments")
  .post(validateBody(createAppointmentSchema))
  .post(createAppointment)
  .get(listAppointments);

router
  .route("/appointments/:id")
  .all(validatePath)
  .delete(deleteAppointment)
  .put(validateBody(updateAppointmentSchema))
  .put(updateAppointment)
  .get(getAppointment);

module.exports = router;
